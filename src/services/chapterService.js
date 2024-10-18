const API_URL = "https://mindmath.azurewebsites.net/api/subjects"; // Base URL for subjects

// Function to add a new chapter under a specific subject
export const addChapter = async (subjectId, chapter) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const response = await fetch(`${API_URL}/${subjectId}/chapters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the headers
    },
    body: JSON.stringify(chapter),
  });

  if (!response.ok) {
    throw new Error("Failed to add chapter");
  }
  return response.json(); // Return the response data
};

// Function to get chapters by subject ID
export const getChaptersBySubjectId = async (subjectId) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const response = await fetch(`${API_URL}/${subjectId}/chapters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the headers
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chapters");
  }
  const data = await response.json();
  return data; // Return the chapters data
};
