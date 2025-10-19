import React, { useState } from 'react';
import { X, Save, Send, Clock, Users, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import firestoreService from '../../../services/firebase/firestoreService';

const CreateNotificationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipients: 'all_users',
    scheduledAt: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        content: '',
        recipients: 'all_users',
        scheduledAt: '',
        status: 'draft'
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    }
    
    if (formData.status === 'scheduled' && !formData.scheduledAt) {
      newErrors.scheduledAt = 'Vui lòng chọn thời gian lên lịch';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (status) => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const notificationData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: 'system',
        recipients: formData.recipients,
        status: status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Admin',
        readCount: 0,
        totalRecipients: formData.recipients === 'all_users' ? 0 : 0, // Will be calculated when sent
        ...(status === 'scheduled' && formData.scheduledAt && {
          scheduledAt: new Date(formData.scheduledAt).toISOString()
        }),
        ...(status === 'sent' && {
          sentAt: new Date().toISOString()
        })
      };

      const result = await firestoreService.createDocument('notifications', notificationData);
      
      if (result.success) {
        toast.success(
          status === 'draft' ? 'Đã lưu thông báo dưới dạng bản nháp' :
          status === 'scheduled' ? 'Đã lên lịch thông báo' :
          'Đã gửi thông báo thành công'
        );
        onSuccess && onSuccess();
        onClose();
      } else {
        throw new Error('Không thể tạo thông báo');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Không thể tạo thông báo');
    } finally {
      setLoading(false);
    }
  };

  // Get priority info
  const getPriorityInfo = (priority) => {
    return { icon: Info, color: 'text-blue-600 bg-blue-100', label: 'Thông báo' };
  };

  if (!isOpen) return null;

  const priorityInfo = getPriorityInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tạo thông báo hệ thống</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tiêu đề thông báo"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập nội dung thông báo"
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đối tượng nhận
                </label>
                <select
                  value={formData.recipients}
                  onChange={(e) => handleInputChange('recipients', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all_users">Tất cả người dùng</option>
                  <option value="students">Chỉ học sinh</option>
                  <option value="parents">Chỉ phụ huynh</option>
                  <option value="teachers">Chỉ giáo viên</option>
                  <option value="admins">Chỉ quản trị viên</option>
                </select>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lên lịch gửi (tùy chọn)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.scheduledAt ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.scheduledAt && (
                  <p className="mt-1 text-sm text-red-600">{errors.scheduledAt}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Để trống nếu muốn gửi ngay hoặc lưu dưới dạng bản nháp
                </p>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xem trước
                </label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${priorityInfo.color}`}>
                      <priorityInfo.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {formData.title || 'Tiêu đề thông báo'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {priorityInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.content || 'Nội dung thông báo sẽ hiển thị ở đây...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {formData.recipients === 'all_users' ? 'Tất cả người dùng' :
                 formData.recipients === 'students' ? 'Chỉ học sinh' :
                 formData.recipients === 'parents' ? 'Chỉ phụ huynh' :
                 formData.recipients === 'teachers' ? 'Chỉ giáo viên' :
                 'Chỉ quản trị viên'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                disabled={loading}
              >
                Hủy
              </button>
              
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Đang lưu...' : 'Lưu nháp'}
              </button>
              
              {formData.scheduledAt ? (
                <button
                  onClick={() => handleSubmit('scheduled')}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Clock className="w-4 h-4" />
                  {loading ? 'Đang lên lịch...' : 'Lên lịch'}
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit('sent')}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Đang gửi...' : 'Gửi ngay'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNotificationModal;
