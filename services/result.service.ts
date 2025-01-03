import { API_ENDPOINTS } from "@/constants/api";
import { User } from "@/types/global.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FilterParams {
    pageSize?: string;
    type?: string;
}

export const getAllResults = async (filterParams: FilterParams) => {
    const queryString = new URLSearchParams(filterParams as Record<string, string>).toString();
    const url = queryString ? `${API_ENDPOINTS.RESULT}?${queryString}` : API_ENDPOINTS.RESULT;
    try {
        const userData = await AsyncStorage.getItem('userInfo');
        if (!userData) throw new Error('User data not found');
        const user: User = await JSON.parse(userData);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
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

export const getResultById = async (resultId: string) => {
    const url = `${API_ENDPOINTS.RESULT}/mobile/${resultId}`;
    try {
        const userData = await AsyncStorage.getItem('userInfo');
        if (!userData) throw new Error('User data not found');
        const user: User = await JSON.parse(userData);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
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