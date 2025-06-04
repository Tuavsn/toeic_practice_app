import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, PaginationMeta, Question, Test, TestInfo } from "@/types/global.type";
import { SubmitRequest, User } from "@/types/global.type";
import ApiHandler from "@/utils/ApiHandler";
import Logger from "@/utils/Logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Parameters to filter and paginate tests
 */
interface FilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  orderAscBy?: string;
  orderDescBy?: string;
}

interface TestQuestions {
    totalQuestion: number;
    listMultipleChoiceQuestions: Question[];
}


/**
 * Service for handling test-related API operations
 */
class TestService {
  /**
   * Fetch paginated list of tests with optional filtering
   */
  async getAllTests(
    filterParams: FilterParams = {}
  ): Promise<ApiResponse<Test[]>> {
    Logger.info("Fetching tests with filters", filterParams);

    try {
      // Prepare params, converting values to strings
      const params: Record<string, any> = {};
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });

      // Defaults
      if (!params.page) params.page = 1;
      if (!params.pageSize) params.pageSize = 999;

      const response = await ApiHandler.Get<Test[]>(
        API_ENDPOINTS.TESTS,
        params
      );

      Logger.debug(
        `Got response for tests: success=${response.success}, count=${response.data?.length || 0}`
      );

      return response;
    } catch (error) {
      Logger.error('Error in getAllTests:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed information about a specific test
   */
  async getTestInfo(testId: string): Promise<ApiResponse<TestInfo>> {
    Logger.info(`Fetching test info for test ID: ${testId}`);

    try {
      const response = await ApiHandler.Get<TestInfo>(
        `${API_ENDPOINTS.TESTS}/${testId}/info`
      );

      Logger.debug(
        `Got response for test info: success=${response.success}`
      );

      return response;
    } catch (error) {
      Logger.error(`Error in getTestInfo (${testId}):`, error);
      throw error;
    }
  }

  /**
   * Fetch all questions for a specific test
   */
  async getTestQuestions(
    testId: string
  ): Promise<ApiResponse<TestQuestions>> {
    Logger.info(`Fetching questions for test ID: ${testId}`);

    try {
      const response = await ApiHandler.Get<TestQuestions>(
        `${API_ENDPOINTS.TESTS}/${testId}/full-test`
      );

      Logger.debug(
        `Got response for test questions: success=${response.success}`
      );

      return response;
    } catch (error) {
      Logger.error(`Error in getTestQuestions (${testId}):`, error);
      throw error;
    }
  }

  /**
   * Submit a completed test
   */
  async submitTest(
    submission: SubmitRequest
  ): Promise<ApiResponse<any>> {
    Logger.info('Submitting test', { testId: submission.testId });

    try {
      // Retrieve user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }

      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Post<any>(
        `${API_ENDPOINTS.TESTS}/submit`,
        submission,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(`Test submission response: success=${response.success}`);
      return response;
    } catch (error) {
      Logger.error('Error in submitTest:', error);
      throw error;
    }
  }
}

export default new TestService();