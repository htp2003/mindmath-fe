import axios from "axios";

const BASE_URL = "https://mindmath.azurewebsites.net/api";

// Function to get problem types by topic ID
export const getProblemTypesByTopicId = async (topicId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${BASE_URL}/topics/${topicId}/problem-types`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching problem types:", error);
    throw error;
  }
};

// Function to add a new problem type for a specific topic ID
export const addProblemType = async (topicId, problemType) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/topics/${topicId}/problem-types`,
      problemType,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding problem type:", error);
    throw error;
  }
};

// Function to update a problem type
export const updateProblemType = async (
  topicId,
  problemTypeId,
  updatedProblemTypeData
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/topics/${topicId}/problem-types/${problemTypeId}`,
      updatedProblemTypeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating problem type:", error);
    throw error;
  }
};

// Function to toggle the active status of a problem type
export const toggleProblemTypeStatus = async (topicId, problemTypeId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  try {
    const response = await axios.delete(
      `${BASE_URL}/topics/${topicId}/problem-types/${problemTypeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 204 ? null : response.data;
  } catch (error) {
    console.error("Error toggling problem type status:", error);
    throw error;
  }
};
