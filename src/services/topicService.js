// src/services/topicService.js
export const getTopicsByChapterId = async (chapterId) => {
  const response = await fetch(
    `https://mindmath.azurewebsites.net/api/chapters/${chapterId}/topics`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }
  const data = await response.json();
  return data;
};

export const addTopic = async (chapterId, topic) => {
  const response = await fetch(
    `https://mindmath.azurewebsites.net/api/chapters/${chapterId}/topics`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topic),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add topic");
  }
  return await response.json();
};
