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
    // Convert params to UTF-8 if needed
    const normalizedParams = {};
    Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
            // Ensure the value is a string and normalize it
            normalizedParams[key] = String(params[key]).replace(/\+/g, ' ');
        }
    });

    // Sort parameters by key (case-sensitive ASCII sort)
    const sortedParams = {};
    Object.keys(normalizedParams)
        .sort((a, b) => a.localeCompare(b, 'en'))
        .forEach(key => {
            sortedParams[key] = normalizedParams[key];
        });

    // Create query string with encoded values
    const signData = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    // Create HMAC SHA512 signature
    const hmac = CryptoJS.HmacSHA512(signData, secretKey);
    return hmac.toString(CryptoJS.enc.Hex).toLowerCase();
};

// Function to verify VNPay response
const verifyVNPayResponse = (queryParams) => {
    const vnpParams = {};

    // Extract and normalize VNPay parameters
    Object.keys(queryParams).forEach(key => {
        if (key.startsWith('vnp_')) {
            // Replace '+' with space and decode URI components
            vnpParams[key] = decodeURIComponent(queryParams[key].replace(/\+/g, ' '));
        }
    });

    // Store and remove secure hash from params
    const receivedHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Calculate new hash
    const calculatedHash = createSignature(vnpParams, VNPAY_CONFIG.hashSecret);

    console.log('Normalized Params:', vnpParams);
    console.log('Received Hash:', receivedHash);
    console.log('Calculated Hash:', calculatedHash);

    return {
        isValid: receivedHash.toLowerCase() === calculatedHash.toLowerCase(),
        vnpParams
    };
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
    console.group('Payment Return Processing');
    const { isValid, vnpParams } = verifyVNPayResponse(queryParams);

    console.groupEnd();

    return {
        isValid,
        isSuccess: vnpParams.vnp_ResponseCode === '00',
        transactionId: vnpParams.vnp_TxnRef,
        amount: parseInt(vnpParams.vnp_Amount) / 100,
        message: vnpParams.vnp_OrderInfo
    };
};