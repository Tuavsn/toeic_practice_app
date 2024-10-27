import { API_ENDPOINTS } from "@/constants/api"

interface FilterParams {
    pageSize?: string;
    difficulty?: string;
    partNum?: string;
    topic?: string;
    orderAscBy?: string;
    orderDescBy?: string;
}

export const getAllQuestions = async (filterParams: FilterParams) => {
    const queryString = new URLSearchParams(filterParams as Record<string, string>).toString();

    const url = queryString ? `${API_ENDPOINTS.QUESTIONS}?${queryString}` : API_ENDPOINTS.QUESTIONS;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        })

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error; // Có thể xử lý lỗi theo cách bạn muốn
    }
}