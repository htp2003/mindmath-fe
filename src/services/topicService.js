// src/services/topicService.js

// Function to get topics by chapter ID
export const getTopicsByChapterId = async (chapterId) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const response = await fetch(
    `https://mindmath.azurewebsites.net/api/chapters/${chapterId}/topics`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }
  const data = await response.json();
  return data; // Return the topics data
};

// Function to add a new topic under a specific chapter
export const addTopic = async (chapterId, topic) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const response = await fetch(
    `https://mindmath.azurewebsites.net/api/chapters/${chapterId}/topics`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
      body: JSON.stringify(topic),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add topic");
  }
  return await response.json(); // Return the response data
};
