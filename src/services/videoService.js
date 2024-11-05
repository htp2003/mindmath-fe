import axios from 'axios';
const API_URL = "https://mindmath.azurewebsites.net/api";

export const getSubjects = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/subjects/active`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        throw error;
    }
};

export const getChapters = async (subjectId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${API_URL}/subjects/${subjectId}/chapters/active`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    pageSize: 20, // Thêm tham số pageSize vào đây
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching chapters:", error);
        throw error;
    }
};

export const getTopics = async (chapterId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${API_URL}/chapters/${chapterId}/topics/active`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
    }
};

export const getProblemTypes = async (topicId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${API_URL}/topics/${topicId}/problem-types/active`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching problem types:", error);
        throw error;
    }
};

export const submitInput = async (problemTypeId, userId, inputs) => {
    try {
        const token = localStorage.getItem("token");
        // Join multiple inputs with commas
        const input = inputs.join(',');
        const response = await axios.post(
            `${API_URL}/problem-types/${problemTypeId}/users/${userId}/input-parameters`,
            { input },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting input:", error);
        throw error;
    }
};
export const getInputParam = async (problemTypeId, userId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${API_URL}/problem-types/${problemTypeId}/users/${userId}/input-parameters`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching input parameters:", error);
        throw error;
    }
};


// Rest of the service remains the same
export const getSolution = async (inputParameterId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/solutions/${inputParameterId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get solution: ${errorText}`);
    }

    const solution = await response.json();
    return solution;
};