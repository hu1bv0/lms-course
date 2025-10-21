import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { 
  GraduationCapIcon, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  UserPlus,
  DollarSign,
  ChevronDown,
  User,
  BookOpen
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { USER_ROLES, legacyAuthService as AuthService } from "../../../services/firebase";
import adminAnalyticsService from "../../../services/firebase/adminAnalyticsService";
import { toast } from "react-toastify";
import CourseManagement from "../components/CourseManagement";
import AdminReports from "../components/AdminReports";
import AdminUserManagement from "../components/AdminUserManagement";
import AdminNotifications from "../components/AdminNotifications";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userData, logout, role } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard', 'reports', 'user-management'
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState("pending");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [stats, setStats] = useState({
    users: { total: 0, byRole: { admin: 0, teacher: 0, student: 0, parent: 0 } },
    courses: { total: 0, active: 0, inactive: 0, totalLessons: 0, totalExams: 0, totalEnrollments: 0, averageRating: 0 },
    enrollments: { total: 0, completed: 0, inProgress: 0, averageProgress: 0 },
    transactions: { total: 0, pending: 0, approved: 0, rejected: 0, totalRevenue: 0 },
    recentActivities: []
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout]);

  // Fetch payments from Firebase
  const fetchPayments = useCallback(async (status = 'all') => {
    setLoading(true);
    try {
      // Map tab status to Firebase status
      let firebaseStatus = null;
      if (status === 'completed') {
        firebaseStatus = 'approved';
      } else if (status === 'pending') {
        firebaseStatus = 'pending';
      } else if (status === 'rejected') {
        firebaseStatus = 'rejected';
      }
      
      const response = await AuthService.getTransactions(firebaseStatus);
      
      // Transform Firebase data to match our UI format
      const transformedPayments = response.transactions.map(transaction => ({
        id: transaction.id,
        user: transaction.userName || 'N/A',
        email: transaction.userEmail || 'N/A',
        amount: transaction.amount || 0,
        status: transaction.status || 'pending',
        date: transaction.createdAt || new Date().toISOString(),
        proof: transaction.paymentProof || null,
        userId: transaction.userId,
        planType: transaction.planType
      }));
      
      setPayments(transformedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Fallback to mock data if API fails
      const mockPayments = recentPayments.filter(payment => 
        status === 'all' || payment.status === status
      );
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  }, [paymentTab]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const dashboardStats = await adminAnalyticsService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Approve payment
  const handleApprovePayment = useCallback(async (paymentId) => {
    try {
      await AuthService.approveTransaction(paymentId, userData?.uid);
      
      // Refresh payments and stats after approval
      await Promise.all([
        fetchPayments(paymentTab),
        fetchStats()
      ]);
      
      toast.success('Đã duyệt thanh toán và nâng cấp tài khoản thành công!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Có lỗi xảy ra khi duyệt thanh toán!', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [userData?.uid, fetchPayments, paymentTab, fetchStats]);

  // Reject payment
  const handleRejectPayment = useCallback(async (paymentId) => {
    try {
      await AuthService.rejectTransaction(paymentId, userData?.uid, 'Admin rejected');
      
      // Refresh payments and stats after rejection
      await Promise.all([
        fetchPayments(paymentTab),
        fetchStats()
      ]);
      
      toast.success('Đã từ chối thanh toán!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Có lỗi xảy ra khi từ chối thanh toán!', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [userData?.uid, fetchPayments, paymentTab, fetchStats]);

  // Filter payments based on search and current tab
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map tab status to payment status
    let matchesTab = false;
    if (paymentTab === 'completed' && payment.status === 'approved') {
      matchesTab = true;
    } else if (paymentTab === 'pending' && payment.status === 'pending') {
      matchesTab = true;
    } else if (paymentTab === 'rejected' && payment.status === 'rejected') {
      matchesTab = true;
    }
    
    return matchesSearch && matchesTab;
  });

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (isSelectAll) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(payment => payment.id));
    }
    setIsSelectAll(!isSelectAll);
  }, [isSelectAll, filteredPayments]);

  // Handle individual selection
  const handleSelectPayment = useCallback((paymentId) => {
    setSelectedPayments(prev => {
      if (prev.includes(paymentId)) {
        return prev.filter(id => id !== paymentId);
      } else {
        return [...prev, paymentId];
      }
    });
  }, []);

  // Bulk approve payments
  const handleBulkApprove = useCallback(async () => {
    if (selectedPayments.length === 0) return;
    
    try {
      // Approve all selected payments
      await Promise.all(
        selectedPayments.map(paymentId => 
          AuthService.approveTransaction(paymentId, userData?.uid)
        )
      );
      
      // Refresh data
      await Promise.all([
        fetchPayments(paymentTab),
        fetchStats()
      ]);
      
      // Clear selection
      setSelectedPayments([]);
      setIsSelectAll(false);
      
      toast.success(`Đã duyệt ${selectedPayments.length} thanh toán và nâng cấp tài khoản thành công!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error bulk approving payments:', error);
    }
  }, [selectedPayments, userData?.uid, fetchPayments, paymentTab, fetchStats]);

  // Bulk reject payments
  const handleBulkReject = useCallback(async () => {
    if (selectedPayments.length === 0) return;
    
    try {
      // Reject all selected payments
      await Promise.all(
        selectedPayments.map(paymentId => 
          AuthService.rejectTransaction(paymentId, userData?.uid, 'Admin rejected')
        )
      );
      
      // Refresh data
      await Promise.all([
        fetchPayments(paymentTab),
        fetchStats()
      ]);
      
      // Clear selection
      setSelectedPayments([]);
      setIsSelectAll(false);
      
      toast.success(`Đã từ chối ${selectedPayments.length} thanh toán!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error bulk rejecting payments:', error);
    }
  }, [selectedPayments, userData?.uid, fetchPayments, paymentTab, fetchStats]);

  // Navigation handlers
  const handleViewReports = () => {
    setCurrentView('reports');
  };


  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Update payments when paymentTab changes
  useEffect(() => {
    if (activeTab === "payments") {
      fetchPayments(paymentTab);
    }
  }, [activeTab, paymentTab, fetchPayments]);

  // Fetch stats and payments when component mounts
  useEffect(() => {
    fetchStats();
    if (activeTab === "payments") {
      fetchPayments(paymentTab);
    }
  }, [fetchStats, fetchPayments, activeTab, paymentTab]);

  // Mock data - trong thực tế sẽ fetch từ API

  const recentPayments = [
    {
      id: "PAY001",
      user: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      amount: 59000,
      status: "pending",
      date: "2024-01-15",
      proof: "payment_proof_001.jpg"
    },
    {
      id: "PAY002", 
      user: "Trần Thị B",
      email: "tranthib@email.com",
      amount: 599000,
      status: "completed",
      date: "2024-01-14",
      proof: "payment_proof_002.jpg"
    },
    {
      id: "PAY003",
      user: "Lê Văn C",
      email: "levanc@email.com", 
      amount: 59000,
      status: "rejected",
      date: "2024-01-13",
      proof: "payment_proof_003.jpg"
    }
  ];


  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  // Debug log
  console.log('Payments debug:', { 
    payments: payments.length, 
    paymentTab, 
    filteredPayments: filteredPayments.length,
    allPayments: payments.map(p => ({ id: p.id, status: p.status, user: p.user })),
    statusMapping: { 
      tab: paymentTab, 
      firebaseStatus: paymentTab === 'completed' ? 'approved' : paymentTab,
      actualStatus: payments[0]?.status,
      match: payments[0]?.status === paymentTab
    }
  });
  
  // Debug filter logic
  if (payments.length > 0) {
    const payment = payments[0];
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = false;
    if (paymentTab === 'completed' && payment.status === 'approved') {
      matchesTab = true;
    } else if (paymentTab === 'pending' && payment.status === 'pending') {
      matchesTab = true;
    } else if (paymentTab === 'rejected' && payment.status === 'rejected') {
      matchesTab = true;
    }
    
    console.log('Filter debug:', {
      payment,
      paymentTab,
      matchesTab,
      searchTerm,
      matchesSearch,
      finalResult: matchesSearch && matchesTab
    });
  }

  // Debug log
  console.log('Admin Dashboard - Role check:', { role, USER_ROLES_ADMIN: USER_ROLES.ADMIN, isAdmin: role === USER_ROLES.ADMIN });

  // Redirect if not admin - REMOVED to prevent conflict with RequiredAuth
  // This logic is now handled by RequiredAuth component in routing
  // useEffect(() => {
  //   if (role && role !== USER_ROLES.ADMIN) {
  //     console.log('Not admin, redirecting to student dashboard');
  //     navigate(ENDPOINTS.STUDENT.DASHBOARD);
  //   }
  // }, [role, navigate]);

  // Show loading while checking role
  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Since RequiredAuth handles role checking, we can safely render the admin dashboard
  // if we reach this point, the user is authenticated and has admin role

  // Render different views
  if (currentView === 'reports') {
    return (
      <AdminReports onBack={handleBackToDashboard} />
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <GraduationCapIcon className="w-9 h-9 text-blue-600" strokeWidth={2.67} />
                <h1 className="text-2xl font-bold text-black">Learnly Admin</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {userData?.displayName?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-gray-700 font-medium">{userData?.displayName || "Admin"}</span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate(ENDPOINTS.SHARED.PROFILE);
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Hồ sơ cá nhân
                    </button>
                    <button
                      onClick={() => {
                        navigate(ENDPOINTS.AUTH.CHANGE_PASSWORD);
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Đổi mật khẩu
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Tổng quan", icon: BarChart3 },
              { id: "courses", label: "Khóa học", icon: BookOpen },
              { id: "payments", label: "Thanh toán", icon: CreditCard },
              { id: "users", label: "Người dùng", icon: Users },
              { id: "notifications", label: "Thông báo", icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">
                      Chào mừng trở lại, {userData?.displayName || "Admin"}! 👋
                    </h2>
                  </div>
                  <p className="text-blue-100">
                    Hôm nay bạn sẽ quản lý gì? Hãy tiếp tục phát triển nền tảng học tập!
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? '...' : stats.users.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng khóa học</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? '...' : stats.courses.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng đăng ký</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? '...' : stats.enrollments.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? '...' : stats.transactions.totalRevenue.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <UserPlus className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Học sinh</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? '...' : stats.users.byRole.student || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <GraduationCapIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Giáo viên</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? '...' : stats.users.byRole.teacher || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? '...' : stats.transactions.pending}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tiến độ TB</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? '...' : `${stats.enrollments.averageProgress}%`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                  <button
                    onClick={handleViewReports}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    Xem báo cáo chi tiết
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {statsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : stats.recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'enrollment' ? 'bg-blue-100' :
                            activity.type === 'transaction' ? 'bg-green-100' :
                            activity.type === 'completion' ? 'bg-purple-100' : 'bg-gray-100'
                          }`}>
                            {activity.type === 'enrollment' && <UserPlus className="w-5 h-5 text-blue-600" />}
                            {activity.type === 'transaction' && <DollarSign className="w-5 h-5 text-green-600" />}
                            {activity.type === 'completion' && <CheckCircle className="w-5 h-5 text-purple-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString('vi-VN')}
                          </p>
                          {activity.status && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {getStatusText(activity.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Không có hoạt động gần đây</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <CourseManagement />
        )}

        {activeTab === "payments" && (
          <div className="space-y-6">
            {/* Payment Management Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quản lý thanh toán</h3>
                  <p className="text-sm text-gray-600">Duyệt và quản lý các giao dịch thanh toán</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "pending", label: "Chờ duyệt", count: stats.transactions.pending, color: "yellow" },
                    { id: "completed", label: "Đã duyệt", count: stats.transactions.approved, color: "green" },
                    { id: "rejected", label: "Từ chối", count: stats.transactions.rejected, color: "red" }
                  ].map((tab) => {
                    const getTabColors = (color, isActive) => {
                      const colors = {
                        yellow: isActive ? "border-yellow-500 text-yellow-600" : "text-yellow-600 hover:text-yellow-700 hover:border-yellow-300",
                        green: isActive ? "border-green-500 text-green-600" : "text-green-600 hover:text-green-700 hover:border-green-300",
                        red: isActive ? "border-red-500 text-red-600" : "text-red-600 hover:text-red-700 hover:border-red-300"
                      };
                      return colors[color];
                    };
                    
                    const getBadgeColors = (color, isActive) => {
                      const colors = {
                        yellow: isActive ? "bg-yellow-100 text-yellow-600" : "bg-yellow-50 text-yellow-600",
                        green: isActive ? "bg-green-100 text-green-600" : "bg-green-50 text-green-600",
                        red: isActive ? "bg-red-100 text-red-600" : "bg-red-50 text-red-600"
                      };
                      return colors[color];
                    };
                    
                    const isActive = paymentTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setPaymentTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          isActive
                            ? getTabColors(tab.color, true)
                            : `border-transparent ${getTabColors(tab.color, false)}`
                        }`}
                      >
                        {tab.label}
                        <span className={`px-2 py-1 text-xs rounded-full ${getBadgeColors(tab.color, isActive)}`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bulk Actions */}
              {paymentTab === "pending" && filteredPayments.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelectAll}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Chọn tất cả</span>
                      </label>
                      {selectedPayments.length > 0 && (
                        <span className="text-sm text-gray-600">
                          Đã chọn {selectedPayments.length} giao dịch
                        </span>
                      )}
                    </div>
                    {selectedPayments.length > 0 && (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleBulkApprove}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Chấp thuận ({selectedPayments.length})
                        </button>
                        <button
                          onClick={handleBulkReject}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Từ chối ({selectedPayments.length})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment List */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {paymentTab === "pending" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={isSelectAll}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        {paymentTab === "pending" && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedPayments.includes(payment.id)}
                              onChange={() => handleSelectPayment(payment.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                            <div className="text-sm text-gray-500">{payment.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {payment.amount.toLocaleString('vi-VN')} VNĐ
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {payment.status === "pending" && (
                              <>
                                <button 
                                  onClick={() => handleApprovePayment(payment.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Duyệt thanh toán"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleRejectPayment(payment.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Từ chối thanh toán"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
                
                {!loading && filteredPayments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Không có giao dịch nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <AdminUserManagement onBack={handleBackToDashboard} />
        )}


        {activeTab === "notifications" && (
          <AdminNotifications onBack={handleBackToDashboard} />
        )}
      </div>

      {/* Payment Detail Modal */}
      {isDetailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết giao dịch</h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Người dùng</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.user}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.amount.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                      {getStatusText(selectedPayment.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedPayment.date).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loại gói</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.planType || 'N/A'}</p>
                  </div>
                </div>

                {selectedPayment.proof && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ảnh chứng minh</label>
                    <div className="mt-2">
                      <img
                        src={selectedPayment.proof}
                        alt="Payment proof"
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'none' }} className="text-sm text-gray-500">
                        Không thể tải ảnh
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Đóng
                  </button>
                  {selectedPayment.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          handleApprovePayment(selectedPayment.id);
                          setIsDetailModalOpen(false);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                      >
                        Chấp thuận
                      </button>
                      <button
                        onClick={() => {
                          handleRejectPayment(selectedPayment.id);
                          setIsDetailModalOpen(false);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;