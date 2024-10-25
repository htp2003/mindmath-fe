import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = "https://mindmath.azurewebsites.net/api/auths";

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
      localStorage.setItem("token", data.accessToken);
      const decodedToken = jwtDecode(data.accessToken);
      return { ...data, decodedToken };
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
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Change password function
export const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.Id || decodedToken.id;

    const response = await fetch(`https://mindmath.azurewebsites.net/api/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        oldPassword,
        newPassword
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to change password');
    }

    const responseData = await response.json().catch(() => ({
      message: "Password changed successfully"
    }));

    return responseData;
  } catch (error) {
    console.error("Error in changePassword:", error);
    throw error;
  }
};

// Update user profile function
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.Id || decodedToken.id;

    if (!userId) {
      throw new Error("User ID not found in token");
    }

    const formData = new FormData();
    formData.append('fullname', userData.fullname);
    formData.append('email', userData.email);
    formData.append('phoneNumber', userData.phoneNumber);

    if (userData.avatar) {
      formData.append('File', userData.avatar);
    }

    const response = await fetch(`https://mindmath.azurewebsites.net/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    // Get the response text first
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${responseText}`);
    }

    let updatedData;
    try {
      // Try to parse the response text as JSON if it's not empty
      updatedData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.warn("Response is not valid JSON:", responseText);
      // If parsing fails, create a default response object
      updatedData = {
        message: "Profile updated successfully",
        // If you have the avatar URL in the decoded token or response headers
        avatarUrl: response.headers.get('X-Avatar-Url') || decodedToken.avatarUrl
      };
    }

    // Get updated user data after successful update
    const newUserResponse = await fetch(`https://mindmath.azurewebsites.net/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (newUserResponse.ok) {
      const newUserData = await newUserResponse.json();
      // Update localStorage with new user data if needed
      if (newUserData.accessToken) {
        localStorage.setItem("token", newUserData.accessToken);
      }
      // Merge the new user data with our update response
      updatedData = {
        ...updatedData,
        ...newUserData,
        avatarUrl: newUserData.avatarUrl || newUserData.AvatarUrl
      };
    }

    return updatedData;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};


// Logout function
export const logout = () => {
  localStorage.removeItem("token");
};