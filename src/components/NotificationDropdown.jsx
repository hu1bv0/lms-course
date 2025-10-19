import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, ChevronDown, User, Settings, BookOpen, Award, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import notificationService from '../services/firebase/notificationService';
import { useSelector } from 'react-redux';

const NotificationDropdown = ({ userRole = 'student' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  
  // Get current user ID from Redux store
  const user = useSelector(state => state.auth.user);
  const userId = user?.uid || 'FewUVCMbr7QZBoW2pwVqx1NZtXm1'; // Fallback for testing

  // Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Use notificationService to get all notifications
      const result = await notificationService.getAllNotifications(userId);
      
      if (result.success) {
        setNotifications(result.notifications);
        setUnreadCount(result.unreadCount);
      } else {
        console.error('Error loading notifications:', result.error);
        toast.error('Không thể tải thông báo');
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) return;

      const result = await notificationService.markAsRead(notificationId, notification.category);
      
      if (result.success) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        ));
        
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const result = await notificationService.markAllAsRead(userId);
      
      if (result.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
        toast.success('Đã đánh dấu tất cả là đã đọc');
      } else {
        toast.error('Không thể đánh dấu tất cả là đã đọc');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Không thể đánh dấu tất cả là đã đọc');
    }
  };

  // Get notification icon
  const getNotificationIcon = (notification) => {
    if (notification.category === 'system') {
      return Settings;
    }
    
    switch (notification.type) {
      case 'course_completed':
        return Award;
      case 'lesson_completed':
        return BookOpen;
      case 'exam_completed':
        return CheckCircle;
      case 'payment':
        return AlertCircle;
      case 'achievement':
        return Award;
      default:
        return Bell;
    }
  };

  // Get notification color
  const getNotificationColor = (notification) => {
    if (notification.category === 'system') {
      return 'text-orange-600 bg-orange-100';
    }
    
    switch (notification.type) {
      case 'course_completed':
      case 'achievement':
        return 'text-green-600 bg-green-100';
      case 'lesson_completed':
      case 'exam_completed':
        return 'text-blue-600 bg-blue-100';
      case 'payment':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // Separate notifications by category
  const personalNotifications = notifications.filter(n => n.category === 'personal');
  const systemNotifications = notifications.filter(n => n.category === 'system');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <div>
                {/* Personal Notifications */}
                {personalNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Thông báo chính</span>
                        <span className="text-xs text-gray-500">({personalNotifications.length})</span>
                      </div>
                    </div>
                    {personalNotifications.map((notification) => {
                      const IconComponent = getNotificationIcon(notification);
                      const colorClass = getNotificationColor(notification);
                      
                      return (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${colorClass}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title || 'Thông báo'}
                                </h4>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatTime(notification.createdAt || notification.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.content || notification.message || 'Không có nội dung'}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* System Notifications */}
                {systemNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Thông báo hệ thống</span>
                        <span className="text-xs text-gray-500">({systemNotifications.length})</span>
                      </div>
                    </div>
                    {systemNotifications.map((notification) => {
                      const IconComponent = getNotificationIcon(notification);
                      const colorClass = getNotificationColor(notification);
                      
                      return (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.isRead ? 'bg-orange-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${colorClass}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title || 'Thông báo hệ thống'}
                                </h4>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatTime(notification.createdAt || notification.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.content || notification.message || 'Không có nội dung'}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Empty state for each category */}
                {personalNotifications.length === 0 && systemNotifications.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Không có thông báo nào</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
