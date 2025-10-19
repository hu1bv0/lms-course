import firestoreService from './firestoreService';

class NotificationService {
  constructor() {
    this.firestore = firestoreService;
  }

  // Get user notifications (personal notifications)
  async getUserNotifications(userId) {
    try {
      const result = await this.firestore.getCollection('user_notifications');
      
      let notifications = [];
      if (Array.isArray(result)) {
        notifications = result.filter(notif => notif.userId === userId);
      } else if (result?.success && Array.isArray(result.data)) {
        notifications = result.data.filter(notif => notif.userId === userId);
      }

      return {
        success: true,
        notifications: notifications.map(notif => ({
          id: notif.id || notif.uid || `user_${Date.now()}_${Math.random()}`,
          userId: notif.userId,
          title: notif.title || 'Thông báo',
          content: notif.content || notif.message || 'Không có nội dung',
          type: notif.type || 'general',
          category: 'personal',
          isRead: notif.isRead || false,
          readAt: notif.readAt || null,
          createdAt: notif.createdAt || notif.created_at || new Date().toISOString(),
          updatedAt: notif.updatedAt || notif.updated_at || new Date().toISOString(),
          data: notif.data || {}
        }))
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return {
        success: false,
        error: error.message,
        notifications: []
      };
    }
  }

  // Get system notifications
  async getSystemNotifications() {
    try {
      const result = await this.firestore.getCollection('notifications');
      
      let notifications = [];
      if (Array.isArray(result)) {
        notifications = result.filter(notif => (notif.type || 'system') === 'system');
      } else if (result?.success && Array.isArray(result.data)) {
        notifications = result.data.filter(notif => (notif.type || 'system') === 'system');
      }

      return {
        success: true,
        notifications: notifications.map(notif => ({
          id: notif.id || notif.uid || `system_${Date.now()}_${Math.random()}`,
          title: notif.title || 'Thông báo hệ thống',
          content: notif.content || notif.message || 'Không có nội dung',
          type: notif.type || 'system',
          category: 'system',
          status: notif.status || 'draft',
          createdAt: notif.createdAt || notif.created_at || new Date().toISOString(),
          sentAt: notif.sentAt || notif.sent_at || null,
          scheduledAt: notif.scheduledAt || notif.scheduled_at || null,
          recipients: notif.recipients || 'all_users',
          readCount: notif.readCount || notif.read_count || 0,
          totalRecipients: notif.totalRecipients || notif.total_recipients || 0,
          author: notif.author || notif.createdBy || 'Admin',
          updatedAt: notif.updatedAt || notif.updated_at || new Date().toISOString()
        }))
      };
    } catch (error) {
      console.error('Error fetching system notifications:', error);
      return {
        success: false,
        error: error.message,
        notifications: []
      };
    }
  }

  // Get all notifications for a user (both personal and system)
  async getAllNotifications(userId) {
    try {
      const [userResult, systemResult] = await Promise.all([
        this.getUserNotifications(userId),
        this.getSystemNotifications()
      ]);

      const allNotifications = [
        ...userResult.notifications,
        ...systemResult.notifications
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        notifications: allNotifications,
        unreadCount: allNotifications.filter(n => !n.isRead).length
      };
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      return {
        success: false,
        error: error.message,
        notifications: [],
        unreadCount: 0
      };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, category = 'personal') {
    try {
      if (category === 'personal') {
        const result = await this.firestore.updateDocument('user_notifications', notificationId, {
          isRead: true,
          readAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return result;
      } else {
        // For system notifications, we might want to track read status differently
        // For now, just return success
        return { success: true };
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const userNotifications = await this.getUserNotifications(userId);
      
      if (userNotifications.success) {
        const unreadNotifications = userNotifications.notifications.filter(n => !n.isRead);
        
        for (const notification of unreadNotifications) {
          await this.markAsRead(notification.id, 'personal');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a user notification
  async createUserNotification(userId, notificationData) {
    try {
      const notification = {
        userId,
        title: notificationData.title || 'Thông báo',
        content: notificationData.content || 'Không có nội dung',
        type: notificationData.type || 'general',
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: notificationData.data || {}
      };

      const result = await this.firestore.createDocument('user_notifications', notification);
      return result;
    } catch (error) {
      console.error('Error creating user notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create notifications for course completion
  async createCourseCompletionNotification(userId, courseTitle) {
    return this.createUserNotification(userId, {
      title: 'Chúc mừng! Bạn đã hoàn thành khóa học',
      content: `Bạn đã hoàn thành khóa học "${courseTitle}". Hãy tiếp tục học tập!`,
      type: 'course_completed',
      data: { courseTitle }
    });
  }

  // Create notifications for lesson completion
  async createLessonCompletionNotification(userId, lessonTitle) {
    return this.createUserNotification(userId, {
      title: 'Bài học đã hoàn thành',
      content: `Bạn đã hoàn thành bài học "${lessonTitle}". Tiếp tục học tập nhé!`,
      type: 'lesson_completed',
      data: { lessonTitle }
    });
  }

  // Create notifications for exam completion
  async createExamCompletionNotification(userId, examTitle, score) {
    return this.createUserNotification(userId, {
      title: 'Bài thi đã hoàn thành',
      content: `Bạn đã hoàn thành bài thi "${examTitle}" với điểm số ${score}.`,
      type: 'exam_completed',
      data: { examTitle, score }
    });
  }

  // Create notifications for achievement
  async createAchievementNotification(userId, achievementTitle) {
    return this.createUserNotification(userId, {
      title: 'Thành tích mới!',
      content: `Chúc mừng! Bạn đã đạt được thành tích "${achievementTitle}".`,
      type: 'achievement',
      data: { achievementTitle }
    });
  }

  // Create notifications for payment
  async createPaymentNotification(userId, paymentData) {
    return this.createUserNotification(userId, {
      title: 'Thông báo thanh toán',
      content: `Thanh toán ${paymentData.amount} VND cho ${paymentData.description} đã ${paymentData.status === 'success' ? 'thành công' : 'thất bại'}.`,
      type: 'payment',
      data: paymentData
    });
  }

  // Create system notification (for admin)
  async createSystemNotification(notificationData) {
    try {
      const notification = {
        title: notificationData.title || 'Thông báo hệ thống',
        content: notificationData.content || 'Không có nội dung',
        type: 'system',
        recipients: notificationData.recipients || 'all_users',
        status: notificationData.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: notificationData.author || 'Admin',
        readCount: 0,
        totalRecipients: 0, // Will be calculated when sent
        ...(notificationData.scheduledAt && {
          scheduledAt: notificationData.scheduledAt
        }),
        ...(notificationData.sentAt && {
          sentAt: notificationData.sentAt
        })
      };

      const result = await this.firestore.createDocument('notifications', notification);
      return result;
    } catch (error) {
      console.error('Error creating system notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
