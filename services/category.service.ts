import { API_ENDPOINTS } from "@/constants/api"

export const getAllCategories = async () => {
    const url = API_ENDPOINTS.CATEGORIES;
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

export const getAllTestsByCategory = async (categoryId: string | undefined) => {
    const url = API_ENDPOINTS.CATEGORIES;
    try {
        const response = await fetch(`${url}/${categoryId}/tests?pageSize=999`, {
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