import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Plus, X, Link, Users, BookOpen, Award, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { parentService } from '../../../services/firebase';

const ParentProfile = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [linking, setLinking] = useState(false);
  
  // Get current user from Redux
  const user = useSelector(state => state.auth.user);
  const userData = useSelector(state => state.auth.userData);

  // Load children data
  const loadChildren = async () => {
    const userId = user?.uid || userData?.uid;
    if (!userId) {
      console.log('No user ID found');
      return;
    }
    
    try {
      setLoading(true);
      const result = await parentService.getParentChildren(userId);
      
      if (result.success) {
        setChildren(result.children);
      } else {
        console.error('Error loading children:', result.error);
        toast.error('Không thể tải danh sách con cái');
      }
    } catch (error) {
      console.error('Error loading children:', error);
      toast.error('Không thể tải danh sách con cái');
    } finally {
      setLoading(false);
    }
  };

  // Handle linking student
  const handleLinkStudent = async () => {
    if (!studentCode.trim()) {
      toast.error('Vui lòng nhập mã học sinh');
      return;
    }

    const userId = user?.uid || userData?.uid;
    if (!userId) {
      toast.error('Không thể xác định thông tin người dùng');
      return;
    }

    try {
      setLinking(true);
      const result = await parentService.linkStudentToParent(userId, studentCode.trim());
      
      if (result.success) {
        toast.success(`Đã liên kết với học sinh ${result.student.name}`);
        setStudentCode('');
        setShowLinkModal(false);
        loadChildren(); // Reload children list
      } else {
        toast.error(result.error || 'Không thể liên kết học sinh');
      }
    } catch (error) {
      console.error('Error linking student:', error);
      toast.error('Không thể liên kết học sinh');
    } finally {
      setLinking(false);
    }
  };

  // Handle unlinking student
  const handleUnlinkStudent = async (studentId, studentName) => {
    if (!confirm(`Bạn có chắc muốn hủy liên kết với ${studentName}?`)) {
      return;
    }

    const userId = user?.uid || userData?.uid;
    if (!userId) {
      toast.error('Không thể xác định thông tin người dùng');
      return;
    }

    try {
      const result = await parentService.unlinkStudent(userId, studentId);
      
      if (result.success) {
        toast.success(`Đã hủy liên kết với ${studentName}`);
        loadChildren(); // Reload children list
      } else {
        toast.error(result.error || 'Không thể hủy liên kết');
      }
    } catch (error) {
      console.error('Error unlinking student:', error);
      toast.error('Không thể hủy liên kết');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    loadChildren();
  }, []);

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
                <X className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h1>
                <p className="text-sm text-gray-600">Quản lý thông tin và liên kết con cái</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {userData?.displayName || userData?.fullName || 'Phụ huynh'}
                    </h3>
                    <p className="text-sm text-gray-600">Phụ huynh</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {userData?.email || user?.email || 'Chưa cập nhật'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {userData?.phone || 'Chưa cập nhật'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Tham gia: {userData?.createdAt ? formatDate(userData.createdAt) : 'Không xác định'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Children Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Quản lý con cái</h2>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Liên kết học sinh
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
              ) : children.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có con cái nào</h3>
                  <p className="text-gray-600 mb-4">Liên kết với học sinh để theo dõi việc học tập</p>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Liên kết học sinh đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{child.name}</h3>
                            <p className="text-sm text-gray-600">{child.grade}</p>
                            <p className="text-xs text-gray-500">Mã: {child.userCode}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Liên kết: {formatDate(child.linkedAt)}
                          </span>
                          <button
                            onClick={() => handleUnlinkStudent(child.id, child.name)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Hủy liên kết"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Link Student Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Liên kết học sinh</h2>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã học sinh
                  </label>
                  <input
                    type="text"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mã học sinh (6 ký tự)"
                    maxLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Mã học sinh là mã 6 ký tự được tạo khi học sinh đăng ký
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Link className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Cách lấy mã học sinh</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Học sinh có thể xem mã của mình trong phần thông tin cá nhân hoặc yêu cầu giáo viên cung cấp mã này.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                  disabled={linking}
                >
                  Hủy
                </button>
                <button
                  onClick={handleLinkStudent}
                  disabled={linking || !studentCode.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {linking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang liên kết...
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4" />
                      Liên kết
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentProfile;
