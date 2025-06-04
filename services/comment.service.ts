import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, PaginationMeta, Comment, CommentTargetType } from "@/types/global.type";
import { CreateCommentRequest, DeleteCommentRequest, User } from "@/types/global.type";
import ApiHandler from "@/utils/ApiHandler";
import Logger from "@/utils/Logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Parameters to filter and paginate comments
 */
interface CommentFilterParams {
  current?: number;
  pageSize?: number;
  term?: string;
  sortBy?: string[];
  sortDirection?: string[];
  active?: boolean;
}

/**
 * Response structure for comment listings
 */
interface CommentViewResponse extends Comment {
  // Additional fields that may be in the response
  likedByCurrentUser?: boolean;
  replyCount?: number;
  parentComment?: Comment | null;
}

/**
 * Service for handling comment-related API operations
 */
class CommentService {
  /**
   * Get root-level comments for a specific target (post, question, etc.)
   */
  async getRootComments(
    targetType: CommentTargetType,
    targetId: string,
    filterParams: CommentFilterParams = {}
  ): Promise<ApiResponse<CommentViewResponse[]>> {
    Logger.info(`Fetching root comments for ${targetType} ID: ${targetId}`, filterParams);

    try {
      // Convert filter params to query parameters
      const params: Record<string, any> = {};
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });

      // Set defaults if not provided
      if (!params.current) params.current = 1;
      if (!params.pageSize) params.pageSize = 10;

      // Retrieve stored user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }
      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Get<CommentViewResponse[]>(
        `${API_ENDPOINTS.COMMENTS}/root/${targetType}/${targetId}`,
        params,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(
        `Got response for root comments: success=${response.success}, count=${response.data?.length || 0}`
      );

      return response;
    } catch (error) {
      Logger.error(`Error in getRootComments (${targetType}/${targetId}):`, error);
      throw error;
    }
  }

  /**
   * Get reply comments for a specific parent comment
   */
  async getReplyComments(
    targetType: CommentTargetType,
    targetId: string,
    parentId: string,
    filterParams: CommentFilterParams = {}
  ): Promise<ApiResponse<CommentViewResponse[]>> {
    Logger.info(`Fetching reply comments for parent ID: ${parentId}`, filterParams);

    try {
      // Convert filter params to query parameters
      const params: Record<string, any> = {};
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });

      // Set defaults if not provided
      if (!params.current) params.current = 1;
      if (!params.pageSize) params.pageSize = 10;

      // Retrieve stored user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }
      const user: User = JSON.parse(raw);


      const response = await ApiHandler.Get<CommentViewResponse[]>(
        `${API_ENDPOINTS.COMMENTS}/replies/${targetType}/${targetId}/${parentId}`,
        params,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(
        `Got response for reply comments: success=${response.success}, count=${response.data?.length || 0}`
      );

      return response;
    } catch (error) {
      Logger.error(`Error in getReplyComments (parent=${parentId}):`, error);
      throw error;
    }
  }

  /**
   * Create a new comment (root or reply)
   */
  async createComment(
    comment: CreateCommentRequest
  ): Promise<ApiResponse<CommentViewResponse>> {
    Logger.info('Creating comment', { 
      targetType: comment.targetType, 
      targetId: comment.targetId,
      isReply: !!comment.parentId 
    });

    try {
      // Retrieve user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }

      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Post<CommentViewResponse>(
        API_ENDPOINTS.COMMENTS,
        comment,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(`Comment creation response: success=${response.success}`);
      return response;
    } catch (error) {
      Logger.error('Error in createComment:', error);
      throw error;
    }
  }

  /**
   * Toggle like status on a comment
   */
  async toggleLike(
    commentId: string
  ): Promise<ApiResponse<CommentViewResponse>> {
    Logger.info(`Toggling like for comment ID: ${commentId}`);

    try {
      // Retrieve user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }

      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Put<CommentViewResponse>(
        `${API_ENDPOINTS.COMMENTS}/toggle-like/${commentId}`,
        {},  // No request body needed
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(`Toggle like response: success=${response.success}`);
      return response;
    } catch (error) {
      Logger.error(`Error in toggleLike (${commentId}):`, error);
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(
    commentId: string,
    request: DeleteCommentRequest
  ): Promise<ApiResponse<CommentViewResponse>> {
    Logger.info(`Deleting comment ID: ${commentId}`);

    try {
      // Retrieve user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }

      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Delete<CommentViewResponse>(
        `${API_ENDPOINTS.COMMENTS}/${commentId}`,
        { 
          data: request,
          headers: { Authorization: `Bearer ${user.token}` } 
        }
      );

      Logger.debug(`Delete comment response: success=${response.success}`);
      return response;
    } catch (error) {
      Logger.error(`Error in deleteComment (${commentId}):`, error);
      throw error;
    }
  }
}

export default new CommentService();