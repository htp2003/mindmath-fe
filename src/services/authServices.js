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

// Get current user function
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Update user profile function
export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.Id || decodedToken.id;

    console.log("Updating user profile for ID:", userId);
    console.log("Update data:", userData);

    const response = await fetch(`https://mindmath.azurewebsites.net/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fullname: userData.fullname,
        email: userData.email,
        phoneNumber: userData.phoneNumber
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const responseText = await response.text();
    console.log("Response text:", responseText);

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.status} - ${responseText}`);
    }

    let updatedData;
    try {
      updatedData = JSON.parse(responseText);
    } catch (parseError) {
      console.warn("Response is not valid JSON:", responseText);
      updatedData = { message: "Profile updated successfully" };
    }

    console.log("Profile updated successfully:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  // Nếu bạn có bất kỳ state nào khác cần xóa, hãy thêm vào đây
};

