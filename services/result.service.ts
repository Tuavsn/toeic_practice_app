import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, PaginationMeta, Result, SubmitRequest, User } from "@/types/global.type";
import ApiHandler from "@/utils/ApiHandler";
import Logger from "@/utils/Logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Parameters to filter and paginate results
 */
interface FilterParams {
  page?: number;
  pageSize?: number;
  type?: string;
}

/**
 * Service for handling result-related API operations
 */
class ResultService {
  /**
   * Fetch paginated list of results with optional filtering
   */
  async getAllResults(
    filterParams: FilterParams = {}
  ): Promise<ApiResponse<Result[]>> {
    Logger.info("Fetching all results with filters", filterParams);

    try {
      // Build query params
      const params: Record<string, any> = {};
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
      // Defaults
      if (!params.page) params.page = 1;
      if (!params.pageSize) params.pageSize = 999;

      // Retrieve user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }
      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Get<Result[]>(
        API_ENDPOINTS.RESULT,
        params,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(
        `Fetched results: success=${response.success}, count=${response.data?.length || 0}`
      );
      return response;
    } catch (error) {
      Logger.error('Error in getAllResults:', error);
      throw error;
    }
  }

  /**
   * Fetch a single result by ID
   */
  async getResultById(
    resultId: string
  ): Promise<ApiResponse<Result>> {
    Logger.info(`Fetching result by ID: ${resultId}`);

    try {
      // Retrieve user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }
      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Get<Result>(
        `${API_ENDPOINTS.RESULT}/mobile/${resultId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(
        `Fetched result ${resultId}: success=${response.success}`
      );
      return response;
    } catch (error) {
      Logger.error(`Error in getResultById (${resultId}):`, error);
      throw error;
    }
  }
}

export default new ResultService();
