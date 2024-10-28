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
export const updateChapter = async (
  subjectId,
  chapterId,
  updatedChapterData
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  try {
    const response = await fetch(
      `${API_URL}/${subjectId}/chapters/${chapterId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedChapterData), // Send updated chapter data
      }
    );

    // Check for a 204 No Content response
    if (response.status === 204) {
      return; // No content, nothing to parse
    }

    // For other status codes, try parsing the response
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update chapter");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating chapter:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};


// Function to toggle the active status of a chapter using DELETE
export const toggleChapterStatus = async (subjectId, chapterId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const response = await fetch(
    `${API_URL}/${subjectId}/chapters/${chapterId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Check for 204 No Content response
  if (response.status === 204) {
    return { success: true }; // Indicate success without parsing a body
  }

  if (!response.ok) {
    throw new Error("Failed to toggle chapter status");
  }

  return response.json(); // Return the data if any is provided
};



