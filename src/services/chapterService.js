// chapterService.js
const API_URL = "https://mindmath.azurewebsites.net/api/subjects"; // Base URL for subjects

// Function to add a new chapter under a specific subject
export const addChapter = async (subjectId, chapter) => {
  const response = await fetch(`${API_URL}/${subjectId}/chapters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chapter),
  });
  if (!response.ok) {
    throw new Error("Failed to add chapter");
  }
  return response.json();
};
// chapterService.js
export const getChaptersBySubjectId = async (subjectId) => {
  const response = await fetch(`https://mindmath.azurewebsites.net/api/subjects/${subjectId}/chapters`);
  if (!response.ok) {
    throw new Error('Failed to fetch chapters');
  }
  const data = await response.json();
  return data;
};

