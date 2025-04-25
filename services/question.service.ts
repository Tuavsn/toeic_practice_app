import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, PaginationMeta, Question } from "@/types/global.type";
import ApiHandler from "@/utils/ApiHandler";
import Logger from "@/utils/Logger";

/**
 * Parameters to filter and paginate questions
 */
interface FilterParams {
  current?: number;
  pageSize?: number;
  difficulty?: string;
  partNum?: string;
  topic?: string;
  orderAscBy?: string;
  orderDescBy?: string;
}

/**
 * Service for handling question-related API operations
 */
class QuestionService {
  /**
   * Fetch questions with optional filtering and pagination
   * @param filterParams Filtering and pagination options
   */
  async getAllQuestions(
    filterParams: FilterParams = {}
  ): Promise<ApiResponse<Question[]>> {
    Logger.info("Fetching all questions with filters", filterParams);

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

      const response = await ApiHandler.Get<Question[]>(
        API_ENDPOINTS.QUESTIONS,
        params
      );

      Logger.debug(
        `Fetched questions: success=${response.success}, count=${response.data?.length || 0}`
      );

      return response;
    } catch (error) {
      Logger.error('Error in getAllQuestions:', error);
      throw error;
    }
  }
}

export default new QuestionService();