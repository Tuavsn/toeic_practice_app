import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, PaginationMeta } from "@/types/global.type";
import { Category, Test } from "@/types/global.type";
import ApiHandler from "@/utils/ApiHandler";
import Logger from "@/utils/Logger";

/**
 * Parameters to filter and paginate category tests
 */
interface FilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  orderAscBy?: string;
  orderDescBy?: string;
}

/**
 * Service for handling category-related API operations
 */
class CategoryService {
  /**
   * Fetch all categories (paginated)
   */
  async getAllCategories(
    page: number = 1,
    pageSize: number = 999
  ): Promise<ApiResponse<Category[]>> {
    Logger.info("Fetching all categories", { page, pageSize });

    try {
      const params = { page, pageSize };
      const response = await ApiHandler.Get<Category[]>(
        API_ENDPOINTS.CATEGORIES,
        params
      );

      Logger.debug(
        `Fetched categories: success=${response.success}, count=${response.data?.length || 0}`
      );

      return response;
    } catch (error) {
      Logger.error('Error in getAllCategories:', error);
      throw error;
    }
  }

  /**
   * Fetch tests for a specific category with optional filtering/pagination
   */
  async getAllTestsByCategory(
    categoryId: string,
  ): Promise<ApiResponse<Test[]>> {
    Logger.info("Fetching tests for category", { categoryId });

    try {
      const params: Record<string, any> = {};

      params.page = 1;
      params.pageSize = 999;

      const response = await ApiHandler.Get<Test[]>(
        `${API_ENDPOINTS.TESTS}/${categoryId}`,
        params
      );

      Logger.debug(
        `Fetched tests for category ${categoryId}: success=${response.success}, count=${response.data?.length || 0}`
      );

      return response;
    } catch (error) {
      Logger.error(`Error in getAllTestsByCategory (${categoryId}):`, error);
      throw error;
    }
  }
}

export default new CategoryService();
