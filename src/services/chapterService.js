const API_URL = "https://mindmath.azurewebsites.net/api/subjects"; // Base URL for subjects

// Function to add a new chapter under a specific subject
export const addChapter = async (subjectId, chapter) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const response = await fetch(`${API_URL}/${subjectId}/chapters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(chapter), // Send the chapter details in the request body
  });

  if (!response.ok) {
    throw new Error("Failed to add chapter");
  }
  return response.json(); // Return the added chapter data
};

// Function to get chapters by subject ID
export const getChaptersBySubjectId = async (subjectId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const response = await fetch(`${API_URL}/${subjectId}/chapters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chapters");
  }
  return response.json(); // Return the fetched chapters
};

// Function to update a chapter under a specific subject
export const updateChapter = async (subjectId, chapterId, updatedChapter) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  // Ensure that the subjectId is included in the updated data payload
  const dataToSend = { ...updatedChapter, subjectId };

  try {
    const response = await fetch(`${API_URL}/${subjectId}/chapters/${chapterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend), // Send the updated chapter data with subjectId
    });

    // Parse response as JSON
    const responseData = await response.json();

    // Handle the case where the response is not ok (status codes >= 400)
    if (!response.ok) {
      console.error("Failed to update chapter:", responseData.message || responseData);
      throw new Error(responseData.message || "Failed to update chapter.");
    }

    console.log("Chapter updated successfully!");

    // Reload the page and retain the subjectId in the URL if desired
    window.location.href = `/subjects/${subjectId}/chapters`; // Modify the URL according to your routing
    // Alternatively, just reload the page
    // window.location.reload();

  } catch (error) {
    // Handle network or other unexpected errors
    console.error("An error occurred:", error.message || error);
    throw new Error("An error occurred while updating the chapter. Please try again.");
  }
};



// Function to deactivate a chapter (set active to false)
export const deactivateChapter = async (subjectId, chapterId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const response = await fetch(
    `${API_URL}/${subjectId}/chapters/${chapterId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subjectId, active: false }), // Include both subjectId and active field
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deactivate chapter");
  }
  return response.json(); // Return the response after deactivation
};
