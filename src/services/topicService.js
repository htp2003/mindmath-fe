const API_URL = "https://mindmath.azurewebsites.net/api/chapters"; // Base URL for chapters

// Function to get topics by chapter ID
export const getTopicsByChapterId = async (chapterId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const response = await fetch(`${API_URL}/${chapterId}/topics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }

  return response.json(); // Return the topics data
};

// Function to add a new topic under a specific chapter
export const addTopic = async (chapterId, topic) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const response = await fetch(`${API_URL}/${chapterId}/topics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(topic),
  });

  if (!response.ok) {
    throw new Error("Failed to add topic");
  }

  return response.json(); // Return the added topic data
};

// Function to update a topic under a specific chapter
export const updateTopic = async (chapterId, topicId, updatedTopicData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  // Kiểm tra URL, chapterId, và topicId
  const updateUrl = `${API_URL}/${chapterId}/topics/${topicId}`;
  try {
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTopicData), // { "name": "string", "description": "string" }
    });

    // Kiểm tra mã trạng thái để xử lý
    if (response.status === 204) {
      return; // No content, successful update
    }

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update topic");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating topic:", error);
    throw error;
  }
};

// Function to toggle the active status of a topic
export const toggleTopicStatus = async (chapterId, topicId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const response = await fetch(
    `${API_URL}/${chapterId}/topics/${topicId}/`,
    {
      method: "DELETE", // Change method to PATCH if this is what the API expects
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 204) {
    return; // No content, successful toggle
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || "Failed to toggle topic status");
  }

  return responseData;
};


