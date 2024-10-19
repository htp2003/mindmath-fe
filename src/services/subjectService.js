import axios from "axios";

const BASE_URL = "https://mindmath.azurewebsites.net/api/subjects";

// Function to get subjects
export const getSubjects = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

// Function to add a new subject
export const addSubject = async (subject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(BASE_URL, subject, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
};

// Function to update a subject
export const updateSubject = async (subjectId, subject) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${BASE_URL}/${subjectId}`, subject, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
};

// Function to toggle subject activation status
export const toggleSubjectStatus = async (subjectId, currentActiveStatus) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  try {
    // First, fetch the current details of the subject
    const currentSubjectResponse = await axios.get(`${BASE_URL}/${subjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const currentSubject = currentSubjectResponse.data;

    // Toggle the active status
    const updatedSubject = {
      ...currentSubject,
      active: !currentActiveStatus, // Toggle active status
    };

    const response = await axios.put(`${BASE_URL}/${subjectId}`, updatedSubject, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error toggling subject status:", error.response.data);
      throw new Error(error.response.data.message || "Failed to toggle subject status.");
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response from the server. Please check your network connection.");
    } else {
      console.error("Error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};



