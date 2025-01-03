import { API_ENDPOINTS } from "@/constants/api"

interface FilterParams {
    pageSize?: string;
    info?: boolean;
    content?: boolean;
    practice?: boolean;
    active?: boolean;
    orderAsc?: boolean;
    orderDesc?: boolean;
    search?: string;
}

export const getAllLectures = async (filterParams: FilterParams) => {
    const queryString = new URLSearchParams(filterParams as Record<string, string>).toString();
    const url = queryString ? `${API_ENDPOINTS.LECTURES}?${queryString}` : API_ENDPOINTS.LECTURES;
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
        console.error('Error fetching lectures:', error);
        throw error; // Có thể xử lý lỗi theo cách bạn muốn
    }
}

export const getLectureById = async (lectureId: string, filterParams: FilterParams) => {
    const queryString = new URLSearchParams(filterParams as Record<string, string>).toString();
    const url = queryString ? `${API_ENDPOINTS.LECTURES}/${lectureId}?${queryString}` : API_ENDPOINTS.LECTURES;
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
        console.error('Error fetching lectures:', error);
        throw error; // Có thể xử lý lỗi theo cách bạn muốn
    }
}