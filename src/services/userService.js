// userService.js
const API_URL = "https://mindmath.azurewebsites.net/api/users";

export const getUsers = async (page = 1, pageSize = 10) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    // Extract pagination info from headers
    const totalPages = parseInt(response.headers.get("X-Total-Pages") || "1");
    const totalCount = parseInt(response.headers.get("X-Total-Count") || "0");

    const data = await response.json();

    return {
      users: data,
      pagination: {
        totalPages,
        totalCount,
        currentPage: page,
        pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const toggleUserStatus = async (userId, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    const url = `${API_URL}/${userId}/active?active=${newStatus}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update user status");
    }

    return true;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};
