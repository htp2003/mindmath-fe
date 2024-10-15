// src/services/userService.js

const API_URL = "https://mindmath.azurewebsites.net/api/users";

export const getUsers = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    return data; // Return the user data
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw the error for further handling
  }
};

// You can add more functions here for creating, updating, and deleting users in the future.
