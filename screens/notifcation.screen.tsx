import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { 
  Ionicons, 
  MaterialIcons,
  AntDesign,
  Feather
} from '@expo/vector-icons';
import NotificationService, { 
  Notification, 
  NotificationType 
} from '@/services/notification.service';
import Logger from '@/utils/Logger';

interface NotificationScreenProps {
  className?: string;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  const pageSize = 10;

  // Load notifications
  const loadNotifications = useCallback(async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await NotificationService.getNotifications({
        current: page,
        pageSize
      });

      if (response.success && response.data) {
        setNotifications(response.data);
        if (response.pagination) {
          setTotalPages(Math.ceil(response.pagination.total / pageSize));
          setUnreadCount(response.data.filter(n => !n.isRead).length);
        }
        setCurrentPage(page);
      } else {
        setError('Failed to load notifications');
      }
    } catch (err) {
      Logger.error('Error loading notifications:', err);
      setError('An error occurred while loading notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    loadNotifications(1, true);
  }, [loadNotifications]);

  // Mark single notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await NotificationService.markAsRead(notificationId);
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      Logger.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true);
      const response = await NotificationService.markAllAsRead();
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      Logger.error('Error marking all notifications as read:', err);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // Delete notification with confirmation
  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await NotificationService.deleteNotification(notificationId);
              
              if (response.success) {
                const deletedNotification = notifications.find(n => n.id === notificationId);
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                
                if (deletedNotification && !deletedNotification.isRead) {
                  setUnreadCount(prev => Math.max(0, prev - 1));
                }
                
                // Reload if current page becomes empty
                if (notifications.length === 1 && currentPage > 1) {
                  loadNotifications(currentPage - 1);
                }
              }
            } catch (err) {
              Logger.error('Error deleting notification:', err);
            }
          },
        },
      ]
    );
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    const iconSize = 20;
    
    switch (type) {
      case NotificationType.SUCCESS:
        return <Ionicons name="checkmark-circle" size={iconSize} color="#10B981" />;
      case NotificationType.WARNING:
        return <Ionicons name="warning" size={iconSize} color="#F59E0B" />;
      case NotificationType.ERROR:
        return <Ionicons name="alert-circle" size={iconSize} color="#EF4444" />;
      default:
        return <Ionicons name="information-circle" size={iconSize} color="#3B82F6" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString();
  };

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  if (loading && notifications.length === 0) {
    return (
      <View className={`flex-1 items-center justify-center p-8 bg-white ${className}`}>
        <ActivityIndicator size="large" color="#6B7280" />
        <Text className="mt-2 text-gray-500">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 bg-white ${className}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
        <View className="flex-row items-center space-x-3">
          <Ionicons name="notifications" size={24} color="#374151" />
          <Text className="text-xl font-semibold text-gray-900">Notifications</Text>
          {unreadCount > 0 && (
            <View className="bg-red-500 px-2 py-1 rounded-full min-w-[20px] items-center">
              <Text className="text-white text-xs font-medium">
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            disabled={markingAllAsRead}
            className="flex-row items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg active:bg-blue-100"
            style={{ opacity: markingAllAsRead ? 0.5 : 1 }}
          >
            <MaterialIcons name="done-all" size={16} color="#2563EB" />
            <Text className="text-sm text-blue-600">
              {markingAllAsRead ? 'Marking...' : 'Mark all as read'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error State */}
      {error && (
        <View className="p-4 bg-red-50 border-l-4 border-l-red-400">
          <View className="flex-row items-center">
            <Ionicons name="alert-circle" size={20} color="#F87171" />
            <Text className="ml-3 text-sm text-red-700 flex-1">{error}</Text>
            <TouchableOpacity
              onPress={() => loadNotifications(currentPage)}
              className="ml-2"
            >
              <Text className="text-sm text-red-600 font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
          />
        }
      >
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center p-12">
            <Ionicons name="notifications-outline" size={48} color="#D1D5DB" />
            <Text className="text-lg font-medium text-gray-900 mb-2">No notifications</Text>
            <Text className="text-sm text-gray-500 text-center">
              You're all caught up! Check back later for new notifications.
            </Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <View key={notification.id}>
              <TouchableOpacity
                className={`p-4 ${
                  !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-400' : 'bg-white'
                } active:bg-gray-50`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <View className="flex-1">
                      <Text className={`text-sm ${
                        !notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <TouchableOpacity
                        onPress={() => handleMarkAsRead(notification.id)}
                        className="p-1"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="checkmark" size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleDeleteNotification(notification.id)}
                      className="p-1"
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
              {index < notifications.length - 1 && (
                <View className="h-px bg-gray-200 ml-4" />
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Pagination */}
      {totalPages > 1 && (
        <View className="flex-row items-center justify-between p-4 border-t border-gray-200">
          <Text className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => loadNotifications(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 border border-gray-300 rounded-md active:bg-gray-50"
              style={{ opacity: (currentPage === 1 || loading) ? 0.5 : 1 }}
            >
              <Text className="text-sm text-gray-700">Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => loadNotifications(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-2 border border-gray-300 rounded-md active:bg-gray-50"
              style={{ opacity: (currentPage === totalPages || loading) ? 0.5 : 1 }}
            >
              <Text className="text-sm text-gray-700">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default NotificationScreen;