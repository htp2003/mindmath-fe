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

// Format date function for VNPay
const formatDate = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

// Generate unique order ID with timestamp
const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${timestamp}_${random}`;
};

// Format amount to VNPay format (multiply by 100 to handle cents)
const formatAmount = (amount) => {
    return Math.round(amount * 100);
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

// Create payment URL with proper parameters
const createPaymentUrl = (amount, description, ipAddr = '127.0.0.1') => {
    const createDate = formatDate(new Date());
    const orderId = generateOrderId();

    const params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: VNPAY_CONFIG.tmnCode,
        vnp_Amount: formatAmount(amount),
        vnp_CreateDate: createDate,
        vnp_CurrCode: 'VND',
        vnp_IpAddr: ipAddr,
        vnp_Locale: 'vn',
        vnp_OrderInfo: description,
        vnp_OrderType: 'other',
        vnp_ReturnUrl: VNPAY_CONFIG.returnUrl,
        vnp_TxnRef: orderId,
        vnp_BankCode: '', // Optional bank code
    };

    // Create signature
    const signature = createSignature(params, VNPAY_CONFIG.hashSecret);
    params.vnp_SecureHash = signature;

    // Create URL with parameters
    const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

    return {
        url: `${VNPAY_CONFIG.paymentUrl}?${queryString}`,
        orderId: orderId
    };
};

// Create transaction
// export const createTransaction = async (userId, amount, description) => {
//     try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             throw new Error("No token found");
//         }

//         // Get client IP (you might want to implement a proper IP detection)
//         const ipAddr = await axios.get('https://api.ipify.org?format=json')
//             .then(response => response.data.ip)
//             .catch(() => '127.0.0.1');

//         // Create payment URL with client IP
//         const { url: paymentUrl, orderId } = createPaymentUrl(amount, description, ipAddr);

//         // Create transaction in your system
//         const response = await axios.post(
//             `${API_URL}/transactions/create`,
//             {
//                 amount: amount,
//                 description: description,
//                 orderId: orderId
//             },
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: { userId }
//             }
//         );

//         return {
//             transactionId: response.data.id,
//             paymentUrl: paymentUrl
//         };
//     } catch (error) {
//         console.error("Error creating transaction:", error);
//         throw error;
//     }
// };
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
    const vnpParams = {};

    // Extract VNPay parameters
    Object.keys(queryParams).forEach(key => {
        if (key.startsWith('vnp_')) {
            vnpParams[key] = queryParams[key];
        }
    });

    // Extract secure hash
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Calculate signature for comparison
    const calculatedHash = createSignature(vnpParams, VNPAY_CONFIG.hashSecret);

    return {
        isValid: secureHash === calculatedHash,
        isSuccess: vnpParams.vnp_ResponseCode === '00',
        transactionId: vnpParams.vnp_TxnRef,
        amount: parseInt(vnpParams.vnp_Amount) / 100, // Convert back from VNPay format
        message: vnpParams.vnp_OrderInfo
    };
};