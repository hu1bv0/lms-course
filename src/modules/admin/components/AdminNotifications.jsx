import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ArrowLeft,
  RefreshCw,
  Settings,
  User,
  BookOpen,
  DollarSign,
  Shield
} from 'lucide-react';
import { toast } from 'react-toastify';
import firestoreService from '../../../services/firebase/firestoreService';
import CreateNotificationModal from './CreateNotificationModal';

const AdminNotifications = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 'notif_1',
      title: 'Chào mừng học sinh mới',
      content: 'Chào mừng bạn đến với Learnly LMS! Hãy khám phá các khóa học thú vị.',
      type: 'welcome',
      priority: 'normal',
      status: 'sent',
      recipients: 'all_students',
      createdAt: '2024-01-15T10:30:00Z',
      sentAt: '2024-01-15T10:35:00Z',
      readCount: 45,
      totalRecipients: 50
    },
    {
      id: 'notif_2',
      title: 'Khóa học mới: Toán học lớp 5',
      content: 'Khóa học Toán học lớp 5 đã được thêm vào hệ thống. Hãy đăng ký ngay!',
      type: 'course',
      priority: 'high',
      status: 'scheduled',
      recipients: 'students_grade_5',
      createdAt: '2024-01-14T15:20:00Z',
      scheduledAt: '2024-01-16T09:00:00Z',
      readCount: 0,
      totalRecipients: 25
    },
    {
      id: 'notif_3',
      title: 'Bảo trì hệ thống',
      content: 'Hệ thống sẽ được bảo trì từ 2:00 - 4:00 ngày mai. Vui lòng lưu công việc.',
      type: 'system',
      priority: 'urgent',
      status: 'sent',
      recipients: 'all_users',
      createdAt: '2024-01-13T14:00:00Z',
      sentAt: '2024-01-13T14:05:00Z',
      readCount: 120,
      totalRecipients: 150
    },
    {
      id: 'notif_4',
      title: 'Nhắc nhở thanh toán',
      content: 'Gói Premium của bạn sẽ hết hạn trong 3 ngày. Hãy gia hạn để tiếp tục sử dụng.',
      type: 'payment',
      priority: 'normal',
      status: 'sent',
      recipients: 'premium_users',
      createdAt: '2024-01-12T11:30:00Z',
      sentAt: '2024-01-12T11:35:00Z',
      readCount: 8,
      totalRecipients: 12
    },
    {
      id: 'notif_5',
      title: 'Cập nhật tính năng mới',
      content: 'Chúng tôi đã thêm tính năng chat trực tiếp với giáo viên. Hãy thử ngay!',
      type: 'feature',
      priority: 'normal',
      status: 'draft',
      recipients: 'all_users',
      createdAt: '2024-01-11T16:45:00Z',
      readCount: 0,
      totalRecipients: 150
    }
  ];

  // Calculate tab counts based on actual notifications
  const tabs = [
    { id: 'all', label: 'Tất cả', count: notifications.length },
    { id: 'sent', label: 'Đã gửi', count: notifications.filter(n => n.status === 'sent').length },
    { id: 'scheduled', label: 'Đã lên lịch', count: notifications.filter(n => n.status === 'scheduled').length },
    { id: 'draft', label: 'Bản nháp', count: notifications.filter(n => n.status === 'draft').length }
  ];

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch notifications from Firebase
      console.log('Fetching notifications from Firebase...');
      const notificationsSnapshot = await firestoreService.getCollection('notifications');
      console.log('Notifications snapshot:', notificationsSnapshot);
      
      // Handle different response formats
      let notificationsData = [];
      
      if (Array.isArray(notificationsSnapshot)) {
        notificationsData = notificationsSnapshot;
      } else if (notificationsSnapshot && notificationsSnapshot.success && Array.isArray(notificationsSnapshot.data)) {
        notificationsData = notificationsSnapshot.data;
      }
      
      if (notificationsData.length > 0) {
        const processedNotifications = notificationsData
          .filter(notification => (notification.type || 'system') === 'system') // Only show system notifications
          .map(notification => ({
            id: notification.id || notification.uid || '',
            title: notification.title || '',
            content: notification.content || notification.message || '',
            type: notification.type || 'system',
            priority: notification.priority || 'normal',
            status: notification.status || 'draft',
            recipients: notification.recipients || 'all_users',
            createdAt: notification.createdAt || notification.created_at || new Date().toISOString(),
            sentAt: notification.sentAt || notification.sent_at || null,
            scheduledAt: notification.scheduledAt || notification.scheduled_at || null,
            readCount: notification.readCount || notification.read_count || 0,
            totalRecipients: notification.totalRecipients || notification.total_recipients || 0
          }));
        
        console.log('Processed system notifications data:', processedNotifications);
        setNotifications(processedNotifications);
        toast.success(`Đã tải ${processedNotifications.length} thông báo hệ thống`);
      } else {
        console.log('No notifications found or empty collection');
        setNotifications([]);
        toast.info('Không có thông báo nào trong hệ thống');
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Không thể tải danh sách thông báo');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Handle create notification modal
  const handleCreateNotification = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    loadNotifications(); // Reload notifications after creating
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || notification.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (isSelectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(notif => notif.id));
    }
    setIsSelectAll(!isSelectAll);
  }, [isSelectAll, filteredNotifications]);

  // Handle individual selection
  const handleSelectNotification = useCallback((notificationId) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  }, []);

  // Get notification type info
  const getNotificationTypeInfo = (type) => {
    switch (type) {
      case 'welcome':
        return { icon: User, color: 'text-blue-600 bg-blue-100', label: 'Chào mừng' };
      case 'course':
        return { icon: BookOpen, color: 'text-green-600 bg-green-100', label: 'Khóa học' };
      case 'system':
        return { icon: Settings, color: 'text-orange-600 bg-orange-100', label: 'Hệ thống' };
      case 'payment':
        return { icon: DollarSign, color: 'text-purple-600 bg-purple-100', label: 'Thanh toán' };
      case 'feature':
        return { icon: Bell, color: 'text-indigo-600 bg-indigo-100', label: 'Tính năng' };
      default:
        return { icon: Bell, color: 'text-gray-600 bg-gray-100', label: 'Khác' };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'normal':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'text-green-600 bg-green-100';
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Handle notification actions
  const handleEditNotification = (notificationId) => {
    toast.info('Tính năng chỉnh sửa thông báo đang phát triển');
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const result = await firestoreService.deleteDocument('notifications', notificationId);
      if (result.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        toast.success('Đã xóa thông báo');
      } else {
        throw new Error('Không thể xóa thông báo');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  const handleViewNotification = (notificationId) => {
    toast.info('Tính năng xem chi tiết thông báo đang phát triển');
  };

  const handleSendNotification = async (notificationId) => {
    try {
      setSending(true);
      
      const result = await firestoreService.updateDocument('notifications', notificationId, {
        status: 'sent',
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'sent', sentAt: new Date().toISOString() }
            : notif
        ));
        toast.success('Đã gửi thông báo hệ thống');
      } else {
        throw new Error('Không thể gửi thông báo');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Không thể gửi thông báo');
    } finally {
      setSending(false);
    }
  };

  const handleScheduleNotification = async (notificationId) => {
    try {
      const scheduledAt = new Date();
      scheduledAt.setHours(scheduledAt.getHours() + 1); // Schedule 1 hour from now
      
      const result = await firestoreService.updateDocument('notifications', notificationId, {
        status: 'scheduled',
        scheduledAt: scheduledAt.toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'scheduled', scheduledAt: scheduledAt.toISOString() }
            : notif
        ));
        toast.success('Đã lên lịch thông báo hệ thống');
      } else {
        throw new Error('Không thể lên lịch thông báo');
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      toast.error('Không thể lên lịch thông báo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition"
                title="Quay lại"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Quản lý thông báo hệ thống</h1>
                <p className="text-sm text-gray-600">{filteredNotifications.length} thông báo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={loadNotifications}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
              <button 
                onClick={handleCreateNotification}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Tạo thông báo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {tab.label}
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedNotifications.length} thông báo
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">
                    Gửi ({selectedNotifications.length})
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
                    Xóa ({selectedNotifications.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông báo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ưu tiên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người nhận
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => {
                    const typeInfo = getNotificationTypeInfo(notification.type);
                    const TypeIcon = typeInfo.icon;
                    
                    return (
                      <tr key={notification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={() => handleSelectNotification(notification.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {notification.content}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4" />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                              {typeInfo.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority === 'urgent' ? 'Khẩn cấp' :
                             notification.priority === 'high' ? 'Cao' :
                             notification.priority === 'normal' ? 'Bình thường' : 'Thấp'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                            {notification.status === 'sent' ? 'Đã gửi' :
                             notification.status === 'scheduled' ? 'Đã lên lịch' : 'Bản nháp'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{notification.readCount}/{notification.totalRecipients}</div>
                            <div className="text-xs text-gray-400">đã đọc</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{new Date(notification.createdAt).toLocaleDateString('vi-VN')}</div>
                            <div className="text-xs text-gray-400">
                              {notification.sentAt ? 
                                `Gửi: ${new Date(notification.sentAt).toLocaleTimeString('vi-VN')}` :
                                notification.scheduledAt ?
                                `Lên lịch: ${new Date(notification.scheduledAt).toLocaleTimeString('vi-VN')}` :
                                'Chưa gửi'
                              }
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewNotification(notification.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditNotification(notification.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {notification.status === 'draft' && (
                              <button 
                                onClick={() => handleSendNotification(notification.id)}
                                disabled={sending}
                                className="text-blue-600 hover:text-blue-900"
                                title="Gửi ngay"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                            {notification.status === 'draft' && (
                              <button 
                                onClick={() => handleScheduleNotification(notification.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Lên lịch"
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            
            {!loading && filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
                <p className="text-gray-600">Thử thay đổi bộ lọc để tìm thêm thông báo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Notification Modal */}
      <CreateNotificationModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default AdminNotifications;
