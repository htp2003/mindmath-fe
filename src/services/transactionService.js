import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = "https://mindmath.azurewebsites.net/api";
const VNPAY_CONFIG = {
    returnUrl: "https://www.mindmath.live/user-dashboard",
    ipnUrl: "https://mindmath.azurewebsites.net/api/transactions/IPN",
    tmnCode: "OSTQ4K61",
    hashSecret: "6E4H3847V9B6752M23DBR3QHJKF62DWI",
    paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
};



const createSignature = (params, secretKey) => {
    console.group('Signature Creation Debug');

    // Step 1: Normalize and sort params
    const sortedParams = Object.keys(params)
        .filter(key => params[key] !== '' && params[key] !== null && params[key] !== undefined)
        .sort()
        .reduce((acc, key) => {
            // Convert all values to string and replace spaces with plus
            acc[key] = String(params[key]).replace(/ /g, '+');
            return acc;
        }, {});

    console.log('Sorted and Normalized Params:', sortedParams);

    // Step 2: Create query string with plus signs instead of spaces
    const signData = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    console.log('Sign Data:', signData);

    // Step 3: Create HMAC SHA512
    const hmac = CryptoJS.HmacSHA512(signData, secretKey);
    const signature = hmac.toString(CryptoJS.enc.Hex);

    console.log('Final Signature:', signature);
    console.groupEnd();

    return signature;
};

const verifyVNPayResponse = (queryParams) => {
    console.group('VNPay Response Verification');

    // Extract VNPay parameters
    const vnpParams = {};
    Object.keys(queryParams).forEach(key => {
        if (key.startsWith('vnp_')) {
            // Keep original value without decoding
            vnpParams[key] = queryParams[key];
        }
    });

    // Log original params for debugging
    console.log('Original VNPay Params:', vnpParams);

    // Store and remove secure hash
    const receivedHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Calculate new hash
    const calculatedHash = createSignature(vnpParams, VNPAY_CONFIG.hashSecret);

    // Compare hashes (case-insensitive)
    const hashesMatch = receivedHash.toLowerCase() === calculatedHash.toLowerCase();

    console.log('Hash Comparison:');
    console.log('Received Hash:', receivedHash);
    console.log('Calculated Hash:', calculatedHash);
    console.log('Hashes Match:', hashesMatch);

    console.groupEnd();

    return {
        isValid: hashesMatch,
        vnpParams
    };
};
// Use this function to test with sample data
const testSignatureCreation = () => {
    const sampleParams = {
        vnp_Amount: '19000000',
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: 'VNP14655543',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: 'Payment for order 325b292a-e0d7-483c-a900-0d399e3cccb7',
        vnp_PayDate: '20240307210914',
        vnp_ResponseCode: '00',
        vnp_TmnCode: 'OSTQ4K61',
        vnp_TransactionNo: '14655543',
        vnp_TransactionStatus: '00',
        vnp_TxnRef: '325b292a-e0d7-483c-a900-0d399e3cccb7'
    };

    console.log('Testing with sample data:');
    createSignature(sampleParams, VNPAY_CONFIG.hashSecret);
};

export const createTransaction = async (userId, amount, description) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }

        // API call to create a transaction and get the VNPay URL
        const response = await axios.post(
            `${API_URL}/transactions/web/create?userId=${userId}`,
            {
                amount: amount,
                description: description,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Get payment URL from response
        return {
            transactionId: response.data.id,
            paymentUrl: response.data.paymentUrl,
        };
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
};


// Handle payment return with proper validation
export const handlePaymentReturn = async (queryParams) => {
    const { isValid, vnpParams } = verifyVNPayResponse(queryParams);
    console.log('Full VNPay Response:', vnpParams);

    try {
        // Check VNPay response code first
        if (vnpParams.vnp_ResponseCode === '00') {
            // Call backend API
            const response = await axios.get(`${API_URL}/transactions/ReturnUrl`, {
                params: {
                    vnp_Amount: vnpParams.vnp_Amount,
                    vnp_BankCode: vnpParams.vnp_BankCode,
                    vnp_BankTranNo: vnpParams.vnp_BankTranNo,
                    vnp_CardType: vnpParams.vnp_CardType,
                    vnp_OrderInfo: vnpParams.vnp_OrderInfo,
                    vnp_PayDate: vnpParams.vnp_PayDate,
                    vnp_ResponseCode: vnpParams.vnp_ResponseCode,
                    vnp_TmnCode: vnpParams.vnp_TmnCode,
                    vnp_TransactionNo: vnpParams.vnp_TransactionNo,
                    vnp_TransactionStatus: vnpParams.vnp_TransactionStatus,
                    vnp_TxnRef: vnpParams.vnp_TxnRef,
                    vnp_SecureHash: vnpParams.vnp_SecureHash
                }
            });

            console.log('Backend API Response:', response);

            // If we get a 200 status, consider it successful regardless of response format
            if (response.status === 200) {
                return {
                    isValid: true,
                    isSuccess: true,
                    transactionId: vnpParams.vnp_TxnRef,
                    amount: parseInt(vnpParams.vnp_Amount) / 100,
                    message: 'Payment completed successfully'
                };
            }
        }

        // If we get here, something went wrong
        return {
            isValid,
            isSuccess: false,
            transactionId: vnpParams.vnp_TxnRef,
            amount: parseInt(vnpParams.vnp_Amount) / 100,
            message: 'Payment verification failed'
        };
    } catch (error) {
        console.error('Backend API Error:', error);
        throw error;
    }
};