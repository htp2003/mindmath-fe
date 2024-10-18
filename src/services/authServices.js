import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = "https://mindmath.azurewebsites.net/api/auths"; // Base API URL

// Register function
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed!");
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken); // Store token
      const decodedToken = jwtDecode(data.accessToken); // Decode the token
      return { ...data, decodedToken }; // Return data along with the decoded token
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};


// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  // Nếu bạn có bất kỳ state nào khác cần xóa, hãy thêm vào đây
};

