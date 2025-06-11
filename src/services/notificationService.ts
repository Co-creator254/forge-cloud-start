
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export class NotificationService {
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_notifications', { p_user_id: userId });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('mark_notification_read', { p_notification_id: notificationId });

      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('mark_all_notifications_read', { p_user_id: userId });

      return !error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('create_notification', {
          p_user_id: notification.user_id,
          p_title: notification.title,
          p_message: notification.message,
          p_type: notification.type,
          p_action_url: notification.action_url
        });

      return !error;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('get_unread_notification_count', { p_user_id: userId });

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }
      return data || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}
