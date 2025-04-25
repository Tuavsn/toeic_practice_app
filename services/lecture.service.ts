import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, Lecture, PaginationMeta } from "@/types/global.type";
import ApiHandler from "@/utils/ApiHandler";
import Logger from "@/utils/Logger";

export interface LectureListResponse {
  lectures: Lecture[];
  pagination: PaginationMeta;
}

interface FilterParams {
  page?: number;
  pageSize?: number;
  info?: boolean;
  content?: boolean;
  practice?: boolean;
  active?: boolean;
  orderAsc?: boolean;
  orderDesc?: boolean;
  search?: string;
}

/**
 * LectureService class for handling lecture-related API operations
 */
class LectureService {
  /**
   * Get all lectures with optional filtering
   * @param filterParams Filter parameters for pagination, info, practice, etc.
   * @returns ApiResponse containing lectures with pagination metadata
   */
  async getAllLectures(
    filterParams: FilterParams = {}
  ): Promise<ApiResponse<Lecture[]>> {
    Logger.info("Fetching all lectures with filters", filterParams);

    try {
      // Convert boolean values to strings for API compatibility
      const params: Record<string, any> = {};
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = typeof value === 'boolean' ? value.toString() : value;
        }
      });
      
      // Default to page 1 if not specified
      if (!params.page) {
        params.page = 1;
      }
      
      // Default to pageSize 5 if not specified
      if (!params.pageSize) {
        params.pageSize = 5;
      }

      const response = await ApiHandler.Get<Lecture[]>(
        API_ENDPOINTS.LECTURES,
        params
      );

      Logger.debug(`Got response for lectures: success=${response.success}, count=${response.data?.length || 0}`);
      
      return response;
    } catch (error) {
      Logger.error('Error in getAllLectures:', error);
      throw error;
    }
  }

  /**
   * Get a single lecture by its ID with optional filters
   * @param lectureId ID of the lecture
   * @param filterParams Additional filters (e.g., info, content)
   * @returns ApiResponse containing a single lecture
   */
  async getLectureById(
    lectureId: string,
    filterParams: FilterParams = {}
  ): Promise<ApiResponse<Lecture>> {
    Logger.info(`Fetching lecture by ID: ${lectureId}`, filterParams);

    try {
      // Convert boolean values to strings for API compatibility
      const params: Record<string, any> = {};
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = typeof value === 'boolean' ? value.toString() : value;
        }
      });

      const response = await ApiHandler.Get<Lecture>(
        `${API_ENDPOINTS.LECTURES}/${lectureId}`,
        params
      );

      Logger.debug(`Got response for lecture ${lectureId}: success=${response.success}`);
      
      return response;
    } catch (error) {
      Logger.error(`Error in getLectureById (${lectureId}):`, error);
      throw error;
    }
  }
  
  /**
   * Create a new lecture
   * @param lectureData Lecture data to create
   * @returns ApiResponse containing the created lecture
   */
  async createLecture(lectureData: Partial<Lecture>): Promise<ApiResponse<Lecture>> {
    Logger.info("Creating new lecture", lectureData);
    
    try {
      const response = await ApiHandler.Post<Lecture>(
        API_ENDPOINTS.LECTURES,
        lectureData
      );
      
      Logger.debug(`Created lecture: success=${response.success}`);
      
      return response;
    } catch (error) {
      Logger.error('Error in createLecture:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing lecture
   * @param lectureId ID of the lecture to update
   * @param lectureData Updated lecture data
   * @returns ApiResponse containing the updated lecture
   */
  async updateLecture(
    lectureId: string, 
    lectureData: Partial<Lecture>
  ): Promise<ApiResponse<Lecture>> {
    Logger.info(`Updating lecture ${lectureId}`, lectureData);
    
    try {
      const response = await ApiHandler.Put<Lecture>(
        `${API_ENDPOINTS.LECTURES}/${lectureId}`,
        lectureData
      );
      
      Logger.debug(`Updated lecture ${lectureId}: success=${response.success}`);
      
      return response;
    } catch (error) {
      Logger.error(`Error in updateLecture (${lectureId}):`, error);
      throw error;
    }
  }
  
  /**
   * Delete a lecture
   * @param lectureId ID of the lecture to delete
   * @returns ApiResponse containing the deletion result
   */
  async deleteLecture(lectureId: string): Promise<ApiResponse<any>> {
    Logger.info(`Deleting lecture ${lectureId}`);
    
    try {
      const response = await ApiHandler.Delete(
        `${API_ENDPOINTS.LECTURES}/${lectureId}`
      );
      
      Logger.debug(`Deleted lecture ${lectureId}: success=${response.success}`);
      
      return response;
    } catch (error) {
      Logger.error(`Error in deleteLecture (${lectureId}):`, error);
      throw error;
    }
  }
}

export default new LectureService();