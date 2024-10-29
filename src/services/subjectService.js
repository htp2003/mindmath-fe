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

// Function to toggle the active status of a subject using DELETE
export const toggleSubjectStatus = async (subjectId) => {
  const token = localStorage.getItem("token");
  try {
    // Send DELETE request to API
    await axios.delete(`https://mindmath.azurewebsites.net/api/subjects/${subjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error blocking subject:", error);
    throw error;
  }
};




