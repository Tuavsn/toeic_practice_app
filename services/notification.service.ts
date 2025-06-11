import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, PaginationMeta, User } from "@/types/global.type";
import ApiHandler from "@/utils/ApiHandler";
import Logger from "@/utils/Logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum NotificationType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS"
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
  deepLink?: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: PaginationMeta;
}

interface NotificationFilterParams {
  current?: number;
  pageSize?: number;
}

interface MarkAllAsReadResponse {
  markedAsReadCount: number;
}

/**
 * NotificationService class for handling notification-related API operations
 */
class NotificationService {
  /**
   * Get all notifications with pagination
   * @param filterParams Filter parameters for pagination
   * @returns ApiResponse containing notifications with pagination metadata
   */
  async getNotifications(
    filterParams: NotificationFilterParams = {}
  ): Promise<ApiResponse<Notification[]>> {
    Logger.info("Fetching all notifications with filters", filterParams);

    try {
      const params: Record<string, any> = {};
      
      // Default to current page 1 if not specified
      if (!filterParams.current) {
        params.current = 1;
      } else {
        params.current = filterParams.current;
      }
      
      // Default to pageSize 10 if not specified
      if (!filterParams.pageSize) {
        params.pageSize = 10;
      } else {
        params.pageSize = filterParams.pageSize;
      }

       // Retrieve stored user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }
      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Get<Notification[]>(
        API_ENDPOINTS.NOTIFICATIONS,
        params,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(`Got response for notifications: success=${response.success}, count=${response.data?.length || 0}`);
      
      return response;
    } catch (error) {
      Logger.error('Error in getNotifications:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   * @param notificationId ID of the notification to mark as read
   * @returns ApiResponse containing the updated notification
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    Logger.info(`Marking notification as read: ${notificationId}`);

    try {
       // Retrieve stored user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }
      const user: User = JSON.parse(raw);

      const response = await ApiHandler.Patch<Notification>(
        `${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Logger.debug(`Marked notification ${notificationId} as read: success=${response.success}`);
      
      return response;
    } catch (error) {
      Logger.error(`Error in markAsRead (${notificationId}):`, error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   * @returns ApiResponse containing the count of marked notifications
   */
  async markAllAsRead(): Promise<ApiResponse<MarkAllAsReadResponse>> {
    Logger.info("Marking all notifications as read");

    try {
      const response = await ApiHandler.Patch<MarkAllAsReadResponse>(
        `${API_ENDPOINTS.NOTIFICATIONS}/read-all`
      );

      Logger.debug(`Marked all notifications as read: success=${response.success}, count=${response.data?.markedAsReadCount || 0}`);
      
      return response;
    } catch (error) {
      Logger.error('Error in markAllAsRead:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param notificationId ID of the notification to delete
   * @returns ApiResponse containing the deletion result
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<any>> {
    Logger.info(`Deleting notification ${notificationId}`);
    
    try {
       // Retrieve stored user token
      const raw = await AsyncStorage.getItem('userInfo');
      if (!raw) {
        Logger.error('User info not found in storage');
        throw new Error('Authentication required');
      }
      const user: User = JSON.parse(raw);
      
      const response = await ApiHandler.Delete(
        `${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      Logger.debug(`Deleted notification ${notificationId}: success=${response.success}`);
      
      return response;
    } catch (error) {
      Logger.error(`Error in deleteNotification (${notificationId}):`, error);
      throw error;
    }
  }

  /**
   * Get unread notifications count
   * @returns Promise containing the count of unread notifications
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await this.getNotifications({ current: 1, pageSize: 1000 });
      if (response.success && response.data) {
        return response.data.filter(notification => !notification.isRead).length;
      }
      return 0;
    } catch (error) {
      Logger.error('Error in getUnreadCount:', error);
      return 0;
    }
  }
}

export default new NotificationService();