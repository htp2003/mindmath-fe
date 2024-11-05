import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = "https://mindmath.azurewebsites.net/api/auths";
const API_TOKEN_URL = "https://mindmath.azurewebsites.net/api";

export const getCurrentUserInfo = async () => {
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

    const response = await fetch(`${API_TOKEN_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};

export const getNewToken = async () => {
  try {
    const currentToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!currentToken || !refreshToken) {
      throw new Error("No tokens found");
    }

    const response = await fetch(`${API_TOKEN_URL}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: currentToken,
        refreshToken: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error("Failed to get new token");
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data.accessToken;
    }

    throw new Error("No access token received");
  } catch (error) {
    console.error("Error getting new token:", error);
    throw error;
  }
};


export const refreshAccessToken = async () => {
  try {
    const currentToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!currentToken || !refreshToken) {
      throw new Error("No tokens found");
    }

    const response = await fetch(`${API_URL}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: currentToken,
        refreshToken: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data.accessToken;
    }

    throw new Error("No access token received");
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Nếu refresh token fail, logout user
    logout();
    throw error;
  }
};
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
      // Lưu thêm refresh token
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
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

export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.Id || decodedToken.id;

    if (!userId) {
      return null;
    }

    return {
      id: userId
    };
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

    // 1. Update profile
    const response = await fetch(`${API_TOKEN_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${errorText}`);
    }

    // 2. Get updated user info
    const updatedUserData = await getCurrentUserInfo();
    return {
      success: true,
      ...updatedUserData
    };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};