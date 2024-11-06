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

    // Log input params
    console.log('Input Params:', params);
    console.log('Secret Key:', secretKey);

    // Step 1: Normalize params
    const normalizedParams = {};
    Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
            normalizedParams[key] = String(params[key])
                .replace(/\+/g, ' ')
                .trim();
        }
    });
    console.log('Normalized Params:', normalizedParams);

    // Step 2: Sort params (case-sensitive)
    const sortedKeys = Object.keys(normalizedParams).sort();
    const sortedParams = {};
    sortedKeys.forEach(key => {
        sortedParams[key] = normalizedParams[key];
    });
    console.log('Sorted Params:', sortedParams);

    // Step 3: Build query string WITHOUT URL encoding
    const signData = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    console.log('Sign Data (Raw Query String):', signData);

    // Step 4: Create HMAC SHA512
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
            // Do not decode parameters at this stage
            vnpParams[key] = queryParams[key];
        }
    });
    console.log('Extracted VNPay Params:', vnpParams);

    // Store and remove secure hash
    const receivedHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;
    console.log('Params for Signature:', vnpParams);

    // Calculate new hash
    const calculatedHash = createSignature(vnpParams, VNPAY_CONFIG.hashSecret);

    console.log('Hash Comparison:');
    console.log('Received Hash:', receivedHash);
    console.log('Calculated Hash:', calculatedHash);
    console.log('Hashes Match:', receivedHash.toLowerCase() === calculatedHash.toLowerCase());

    console.groupEnd();
    return {
        isValid: receivedHash.toLowerCase() === calculatedHash.toLowerCase(),
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
export const handlePaymentReturn = (queryParams) => {
    const { isValid, vnpParams } = verifyVNPayResponse(queryParams);

    // Also run test with sample data for comparison
    console.log('\nRunning test with sample data for comparison:');
    testSignatureCreation();

    return {
        isValid,
        isSuccess: vnpParams.vnp_ResponseCode === '00',
        transactionId: vnpParams.vnp_TxnRef,
        amount: parseInt(vnpParams.vnp_Amount) / 100,
        message: vnpParams.vnp_OrderInfo
    };
};