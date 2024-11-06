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



// Create signature for VNPay
const createSignature = (params, secretKey) => {
    // Sort parameters by key
    const sortedParams = {};
    Object.keys(params)
        .sort()
        .forEach(key => {
            if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
                sortedParams[key] = params[key];
            }
        });

    // Create query string
    const signData = Object.keys(sortedParams)
        .map(key => `${key}=${sortedParams[key]}`)
        .join('&');

    // Create HMAC SHA512 signature
    return CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);
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
    const vnpParams = {};

    // Extract VNPay parameters
    Object.keys(queryParams).forEach(key => {
        if (key.startsWith('vnp_')) {
            vnpParams[key] = queryParams[key];
        }
    });

    // Log toàn bộ params nhận được
    console.log('VNPay Params:', vnpParams);

    // Log mã response
    console.log('Response Code:', vnpParams.vnp_ResponseCode);

    // Extract secure hash
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Log secure hash nhận được từ VNPay
    console.log('Secure Hash:', secureHash);

    // Calculate signature for comparison
    const calculatedHash = createSignature(vnpParams, VNPAY_CONFIG.hashSecret);

    // Log secure hash được tính toán từ code
    console.log('Calculated Hash:', calculatedHash);
    console.log('Hashes Match:', secureHash === calculatedHash);

    console.groupEnd();

    return {
        isValid: secureHash === calculatedHash,
        isSuccess: vnpParams.vnp_ResponseCode === '00',
        transactionId: vnpParams.vnp_TxnRef,
        amount: parseInt(vnpParams.vnp_Amount) / 100,
        message: vnpParams.vnp_OrderInfo
    };
};