import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse } from "@/types/global.type";
import { User, PaginationMeta } from "@/types/global.type";
import ApiHandler from "@/utils/ApiHandler";
import Logger from "@/utils/Logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Service for fetching user account/statistics info
 */
class StatService {
  /**
   * Fetch current user's account/statistics info
   */
  async getStat(): Promise<ApiResponse<any>> {
    Logger.info("Fetching user statistics/account info");

    try {
      // Retrieve stored user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }
      const user: User = JSON.parse(raw);

      // Request account data
      const response = await ApiHandler.Get<any>(
        `${API_ENDPOINTS.AUTH}/account`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response.success) {
        Logger.debug('Fetched user statistics successfully', response.data);
      } else {
        Logger.error('Failed to fetch user statistics', response.message);
      }

      return response;
    } catch (error) {
      Logger.error('Error in getStat:', error);
      throw error;
    }
  }
}

export default new StatService();
