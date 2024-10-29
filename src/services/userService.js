const API_URL = "https://mindmath.azurewebsites.net/api/users";

export const getUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Function to toggle user status
export const toggleUserStatus = async (userId, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    // Construct the URL with the query parameter
    const url = `https://mindmath.azurewebsites.net/api/users/${userId}/active?active=${newStatus}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to update user status");
    }

    // Return true if the update was successful
    return true;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error; // Propagate the error
  }
};
