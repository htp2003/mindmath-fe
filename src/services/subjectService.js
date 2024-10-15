const API_URL = "https://mindmath.azurewebsites.net/api/subjects";

// Function to get subjects
export const getSubjects = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return response.json();
};

// Function to add a new subject
export const addSubject = async (subject) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subject),
  });
  if (!response.ok) {
    throw new Error("Failed to add subject");
  }
  return response.json();
};

