import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  GraduationCap,
  User,
  ChevronDown,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Copy
} from 'lucide-react';
import { toast } from 'react-toastify';
import firestoreService from '../../../services/firebase/firestoreService';

const AdminUserManagement = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    role: 'student',
    phone: '',
    grade: '',
    subscription: 'free'
  });

  // Generate user code for students
  const generateUserCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch users from Firebase
      console.log('Fetching users from Firebase...');
      const usersSnapshot = await firestoreService.getCollection('users');
      console.log('Users snapshot:', usersSnapshot);
      
      // Handle different response formats
      let usersData = [];
      
      if (Array.isArray(usersSnapshot)) {
        // Direct array response
        usersData = usersSnapshot;
      } else if (usersSnapshot && usersSnapshot.success && Array.isArray(usersSnapshot.data)) {
        // Object with success and data properties
        usersData = usersSnapshot.data;
      } else if (usersSnapshot && Array.isArray(usersSnapshot)) {
        // Another array format
        usersData = usersSnapshot;
      }
      
      if (usersData.length > 0) {
        const processedUsers = usersData.map(user => ({
          id: user.id || user.uid || '',
          email: user.email || '',
          displayName: user.displayName || user.name || user.display_name || 'Không có tên',
          role: user.role || 'student',
          status: user.status || 'active',
          createdAt: user.createdAt || user.created_at || new Date().toISOString(),
          lastLogin: user.lastLoginAt || user.lastLogin || user.last_login || new Date().toISOString(),
          phone: user.phone || user.phoneNumber || '',
          avatar: user.avatar || user.photoURL || user.avatar_url || '',
          subscription: user.subscription || 'free',
          grade: user.grade || '',
          userCode: user.userCode || user.user_code || (user.role === 'student' ? generateUserCode() : null)
        }));
        
        console.log('Processed users data:', processedUsers);
        setUsers(processedUsers);
        toast.success(`Đã tải ${processedUsers.length} người dùng`);
      } else {
        console.log('No users found or empty collection');
        setUsers([]);
        toast.info('Không có người dùng nào trong hệ thống');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (isSelectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
    setIsSelectAll(!isSelectAll);
  }, [isSelectAll, filteredUsers]);

  // Handle individual selection
  const handleSelectUser = useCallback((userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  }, []);

  // Get role icon and color
  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return { icon: Shield, color: 'text-red-600 bg-red-100', label: 'Admin' };
      case 'teacher':
        return { icon: GraduationCap, color: 'text-blue-600 bg-blue-100', label: 'Giáo viên' };
      case 'student':
        return { icon: User, color: 'text-green-600 bg-green-100', label: 'Học sinh' };
      case 'parent':
        return { icon: Users, color: 'text-purple-600 bg-purple-100', label: 'Phụ huynh' };
      default:
        return { icon: User, color: 'text-gray-600 bg-gray-100', label: 'Không xác định' };
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  // Handle user actions
  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email || '',
        displayName: user.displayName || '',
        role: user.role || 'student',
        phone: user.phone || '',
        grade: user.grade || '',
        subscription: user.subscription || 'free'
      });
      setIsModalOpen(true);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      displayName: '',
      role: 'student',
      phone: '',
      grade: '',
      subscription: 'free'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      email: '',
      displayName: '',
      role: 'student',
      phone: '',
      grade: '',
      subscription: 'free'
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        ...formData,
        status: 'active',
        createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add userCode for students
      if (formData.role === 'student' && !editingUser?.userCode) {
        userData.userCode = generateUserCode();
      }

      if (editingUser) {
        // Update existing user
        const result = await firestoreService.updateDocument('users', editingUser.id, userData);
        if (result.success) {
          setUsers(prev => prev.map(user => 
            user.id === editingUser.id 
              ? { ...user, ...userData }
              : user
          ));
          toast.success('Đã cập nhật người dùng thành công');
        } else {
          throw new Error('Không thể cập nhật người dùng');
        }
      } else {
        // Create new user
        const result = await firestoreService.createDocument('users', userData);
        if (result.success) {
          const newUser = { id: result.id, ...userData };
          setUsers(prev => [...prev, newUser]);
          toast.success('Đã tạo người dùng thành công');
        } else {
          throw new Error('Không thể tạo người dùng');
        }
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(editingUser ? 'Không thể cập nhật người dùng' : 'Không thể tạo người dùng');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await firestoreService.deleteDocument('users', userId);
      if (result.success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast.success('Đã xóa người dùng thành công');
      } else {
        throw new Error('Không thể xóa người dùng');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Không thể xóa người dùng');
    }
  };

  const handleViewUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setViewingUser(user);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingUser(null);
  };

  const handleToggleStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      const result = await firestoreService.updateDocument('users', userId, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      if (result.success) {
        setUsers(prev => prev.map(u => 
          u.id === userId 
            ? { ...u, status: newStatus }
            : u
        ));
        toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} người dùng`);
      } else {
        throw new Error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Không thể cập nhật trạng thái người dùng');
    }
  };

  // Handle copy user code
  const handleCopyCode = (userCode) => {
    navigator.clipboard.writeText(userCode).then(() => {
      toast.success(`Đã sao chép mã: ${userCode}`);
    }).catch(() => {
      toast.error('Không thể sao chép mã');
    });
  };

  // Handle generate user code
  const handleGenerateCode = async (userId) => {
    try {
      const newCode = generateUserCode();
      
      const result = await firestoreService.updateDocument('users', userId, {
        userCode: newCode,
        updatedAt: new Date().toISOString()
      });

      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, userCode: newCode }
            : user
        ));
        toast.success(`Đã tạo mã học sinh: ${newCode}`);
      } else {
        throw new Error('Không thể tạo mã học sinh');
      }
    } catch (error) {
      console.error('Error generating user code:', error);
      toast.error('Không thể tạo mã học sinh');
    }
  };

  // Bulk actions
  const handleBulkActivate = async () => {
    try {
      const promises = selectedUsers.map(userId => 
        firestoreService.updateDocument('users', userId, {
          status: 'active',
          updatedAt: new Date().toISOString()
        })
      );
      
      await Promise.all(promises);
      
      setUsers(prev => prev.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, status: 'active' }
          : user
      ));
      
      setSelectedUsers([]);
      setIsSelectAll(false);
      toast.success(`Đã kích hoạt ${selectedUsers.length} người dùng`);
    } catch (error) {
      console.error('Error bulk activating users:', error);
      toast.error('Không thể kích hoạt người dùng');
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      const promises = selectedUsers.map(userId => 
        firestoreService.updateDocument('users', userId, {
          status: 'inactive',
          updatedAt: new Date().toISOString()
        })
      );
      
      await Promise.all(promises);
      
      setUsers(prev => prev.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, status: 'inactive' }
          : user
      ));
      
      setSelectedUsers([]);
      setIsSelectAll(false);
      toast.success(`Đã vô hiệu hóa ${selectedUsers.length} người dùng`);
    } catch (error) {
      console.error('Error bulk deactivating users:', error);
      toast.error('Không thể vô hiệu hóa người dùng');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng?`)) {
      return;
    }

    try {
      const promises = selectedUsers.map(userId => 
        firestoreService.deleteDocument('users', userId)
      );
      
      await Promise.all(promises);
      
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      setIsSelectAll(false);
      toast.success(`Đã xóa ${selectedUsers.length} người dùng`);
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      toast.error('Không thể xóa người dùng');
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
                <h1 className="text-xl font-semibold text-gray-900">Quản lý người dùng</h1>
                <p className="text-sm text-gray-600">{filteredUsers.length} người dùng</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={loadUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
              <button 
                onClick={handleAddUser}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <UserPlus className="w-4 h-4" />
                Thêm người dùng
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
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="teacher">Giáo viên</option>
                <option value="student">Học sinh</option>
                <option value="parent">Phụ huynh</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedUsers.length} người dùng
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleBulkActivate}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                  >
                    Kích hoạt ({selectedUsers.length})
                  </button>
                  <button 
                    onClick={handleBulkDeactivate}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                  >
                    Vô hiệu hóa ({selectedUsers.length})
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700"
                  >
                    Xóa ({selectedUsers.length})
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
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã học sinh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đăng ký
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đăng nhập cuối
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.role);
                    const RoleIcon = roleInfo.icon;
                    
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <RoleIcon className="w-4 h-4" />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                              {roleInfo.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role === 'student' && user.userCode ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {user.userCode}
                              </span>
                              <button
                                onClick={() => handleCopyCode(user.userCode)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Sao chép mã"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          ) : user.role === 'student' ? (
                            <button
                              onClick={() => handleGenerateCode(user.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Tạo mã
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewUser(user.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleToggleStatus(user.id)}
                              className={user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                              title={user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            >
                              {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
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
            
            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người dùng</h3>
                <p className="text-gray-600">Thử thay đổi bộ lọc để tìm thêm người dùng</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {isDetailModalOpen && viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Chi tiết người dùng</h2>
                <button
                  onClick={handleCloseDetailModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Tên hiển thị</label>
                        <p className="text-sm text-gray-900">{viewingUser.displayName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <p className="text-sm text-gray-900">{viewingUser.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
                        <p className="text-sm text-gray-900">{viewingUser.phone || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Gói đăng ký</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          viewingUser.subscription === 'free' ? 'bg-gray-100 text-gray-800' :
                          viewingUser.subscription === 'premium' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {viewingUser.subscription === 'free' ? 'Miễn phí' :
                           viewingUser.subscription === 'premium' ? 'Premium' : 'Pro'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role & Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vai trò & Trạng thái</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Vai trò</label>
                        <div className="flex items-center gap-2 mt-1">
                          {(() => {
                            const roleInfo = getRoleInfo(viewingUser.role);
                            const RoleIcon = roleInfo.icon;
                            return (
                              <>
                                <RoleIcon className="w-4 h-4" />
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                                  {roleInfo.label}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewingUser.status)}`}>
                          {viewingUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </div>
                      {viewingUser.role === 'student' && viewingUser.grade && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Lớp</label>
                          <p className="text-sm text-gray-900">{viewingUser.grade}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Code (for students) */}
                  {viewingUser.role === 'student' && viewingUser.userCode && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-blue-900 mb-4">Mã học sinh</h3>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-lg font-bold text-blue-600 bg-blue-100 px-3 py-2 rounded">
                          {viewingUser.userCode}
                        </span>
                        <button
                          onClick={() => handleCopyCode(viewingUser.userCode)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          <Copy className="w-4 h-4" />
                          Sao chép
                        </button>
                      </div>
                      <p className="text-sm text-blue-600 mt-2">
                        Phụ huynh có thể sử dụng mã này để kết nối với học sinh
                      </p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{viewingUser.displayName}</h3>
                    <p className="text-sm text-gray-600">{viewingUser.email}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleCloseDetailModal();
                          handleEditUser(viewingUser.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleToggleStatus(viewingUser.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                          viewingUser.status === 'active' 
                            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {viewingUser.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {viewingUser.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      </button>
                      {viewingUser.role === 'student' && !viewingUser.userCode && (
                        <button
                          onClick={() => handleGenerateCode(viewingUser.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                        >
                          <UserPlus className="w-4 h-4" />
                          Tạo mã học sinh
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thời gian</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Ngày tạo</label>
                        <p className="text-sm text-gray-900">
                          {new Date(viewingUser.createdAt).toLocaleDateString('vi-VN')} {new Date(viewingUser.createdAt).toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Đăng nhập cuối</label>
                        <p className="text-sm text-gray-900">
                          {new Date(viewingUser.lastLogin).toLocaleDateString('vi-VN')} {new Date(viewingUser.lastLogin).toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseDetailModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    handleCloseDetailModal();
                    handleEditUser(viewingUser.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên hiển thị *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò *
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="student">Học sinh</option>
                      <option value="teacher">Giáo viên</option>
                      <option value="parent">Phụ huynh</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {formData.role === 'student' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lớp
                      </label>
                      <input
                        type="text"
                        value={formData.grade}
                        onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                        placeholder="VD: Lớp 5A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gói đăng ký
                    </label>
                    <select
                      value={formData.subscription}
                      onChange={(e) => setFormData(prev => ({ ...prev, subscription: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="free">Miễn phí</option>
                      <option value="premium">Premium</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>
                </div>

                {formData.role === 'student' && editingUser?.userCode && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-800">Mã học sinh:</span>
                      <span className="font-mono text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {editingUser.userCode}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Phụ huynh có thể sử dụng mã này để kết nối với học sinh
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingUser ? 'Cập nhật' : 'Tạo người dùng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
