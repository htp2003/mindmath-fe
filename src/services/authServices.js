import axios from 'axios';

const API_URL = '/api/auths/register'; // Địa chỉ API

//register
export const register = async (userData) => {
    try {
        const response = await axios.post('https://mindmath.azurewebsites.net/api/auths/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

//login
export const login = async (loginData) => {
    try {
        const response = await axios.post('https://mindmath.azurewebsites.net/api/auths/login', loginData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};
