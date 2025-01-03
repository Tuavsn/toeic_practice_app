import { API_ENDPOINTS } from "@/constants/api";
import { User } from "@/types/global.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStat = async () => {
    const url = `${API_ENDPOINTS.AUTH}/account`;
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