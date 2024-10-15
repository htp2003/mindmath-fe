import axios from "axios";

const BASE_URL = "https://mindmath.azurewebsites.net/api";

// Function to get problem types by topic ID
export const getProblemTypesByTopicId = async (topicId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/topics/${topicId}/problem-types`
    );
    return response.data; // Assuming the API returns the data in the response body
  } catch (error) {
    console.error("Error fetching problem types:", error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Function to add a new problem type for a specific topic ID
export const addProblemType = async (topicId, problemType) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/topics/${topicId}/problem-types`,
      problemType
    );
    return response.data; // Assuming the API returns the created problem type in the response body
  } catch (error) {
    console.error("Error adding problem type:", error);
    throw error; // Rethrow the error for handling in the component
  }
};
