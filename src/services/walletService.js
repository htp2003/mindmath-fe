import axios from 'axios';
const API_URL = "https://mindmath.azurewebsites.net/api";

export const getWalletBalance = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/wallets/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        throw error;
    }
};

export const getTransactionHistory = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/transactions/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                pageSize: 20, // Thêm tham số pageSize vào đây
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};