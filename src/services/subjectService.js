import axios from "axios";

const BASE_URL = "https://mindmath.azurewebsites.net/api/subjects";

// Function to get subjects
export const getSubjects = async () => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the subjects data
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to add a new subject
export const addSubject = async (subject) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  try {
    const response = await axios.post(BASE_URL, subject, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the created subject data
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error; // Rethrow the error for further handling
  }
};
