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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCapIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learnly Admin</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 hover:shadow-md">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-white/80 backdrop-blur-sm rounded-xl p-2 transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-semibold">
                      {userData?.displayName?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-gray-700 font-semibold text-sm">{userData?.displayName || "Admin"}</span>
                    <span className="text-xs text-gray-500 font-medium">Administrator</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 py-2 z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        navigate(ENDPOINTS.SHARED.PROFILE);
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Hồ sơ cá nhân</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate(ENDPOINTS.AUTH.CHANGE_PASSWORD);
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Đổi mật khẩu</span>
                    </button>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
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
                className={`relative flex items-center gap-2 py-4 px-5 border-b-2 font-black text-sm transition-all duration-300 whitespace-nowrap group ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
              >
                {/* Active indicator background */}
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-t-xl"></div>
                )}
                
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/0 via-blue-50/0 to-purple-50/0 group-hover:from-gray-50/50 group-hover:via-blue-50/50 group-hover:to-purple-50/50 rounded-t-xl transition-all duration-300"></div>
                
                <tab.icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${activeTab === tab.id ? 'text-blue-600 scale-110' : 'group-hover:scale-110'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl font-bold">
                      Chào mừng trở lại, {userData?.displayName || "Admin"}! 👋
                    </h2>
                  </div>
                  <p className="text-blue-100 text-lg font-medium">
                    Hôm nay bạn sẽ quản lý gì? Hãy tiếp tục phát triển nền tảng học tập!
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Tổng người dùng</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {statsLoading ? '...' : stats.users.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Tổng khóa học</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {statsLoading ? '...' : stats.courses.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Tổng đăng ký</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {statsLoading ? '...' : stats.enrollments.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Doanh thu</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      {statsLoading ? '...' : stats.transactions.totalRevenue.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Học sinh</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {statsLoading ? '...' : stats.users.byRole.student || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <GraduationCapIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Giáo viên</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {statsLoading ? '...' : stats.users.byRole.teacher || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Chờ duyệt</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                      {statsLoading ? '...' : stats.transactions.pending}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Tiến độ TB</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      {statsLoading ? '...' : `${stats.enrollments.averageProgress}%`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50">
              <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Hoạt động gần đây</h3>
                  </div>
                  <button
                    onClick={handleViewReports}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm font-semibold"
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
                      <div key={activity.id} className="flex items-center justify-between p-5 bg-gradient-to-br from-gray-50/80 to-blue-50/50 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                            activity.type === 'enrollment' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                            activity.type === 'transaction' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                            activity.type === 'completion' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                          }`}>
                            {activity.type === 'enrollment' && <UserPlus className="w-6 h-6 text-white" />}
                            {activity.type === 'transaction' && <DollarSign className="w-6 h-6 text-white" />}
                            {activity.type === 'completion' && <CheckCircle className="w-6 h-6 text-white" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{activity.title}</p>
                            <p className="text-sm text-gray-600 font-medium">{activity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 font-medium mb-2">
                            {new Date(activity.timestamp).toLocaleDateString('vi-VN')}
                          </p>
                          {activity.status && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold shadow-md ${
                              activity.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                              activity.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                              activity.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                              'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                            }`}>
                              {getStatusText(activity.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-lg">
                      <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold text-lg">Không có hoạt động gần đây</p>
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
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Quản lý thanh toán</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Duyệt và quản lý các giao dịch thanh toán</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Tabs */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/30">
                <nav className="flex space-x-2 px-6 overflow-x-auto scrollbar-hide">
                  {[
                    { id: "pending", label: "Chờ duyệt", count: stats.transactions.pending, color: "yellow" },
                    { id: "completed", label: "Đã duyệt", count: stats.transactions.approved, color: "green" },
                    { id: "rejected", label: "Từ chối", count: stats.transactions.rejected, color: "red" }
                  ].map((tab) => {
                    const isActive = paymentTab === tab.id;
                    
                    const getTabClasses = () => {
                      if (tab.color === 'yellow') {
                        return isActive 
                          ? 'border-yellow-600 text-yellow-600' 
                          : 'border-transparent text-yellow-600 hover:text-yellow-700';
                      } else if (tab.color === 'green') {
                        return isActive 
                          ? 'border-green-600 text-green-600' 
                          : 'border-transparent text-green-600 hover:text-green-700';
                      } else {
                        return isActive 
                          ? 'border-red-600 text-red-600' 
                          : 'border-transparent text-red-600 hover:text-red-700';
                      }
                    };
                    
                    const getActiveBackground = () => {
                      if (tab.color === 'yellow') {
                        return 'bg-gradient-to-r from-yellow-50 via-yellow-50/80 to-yellow-50';
                      } else if (tab.color === 'green') {
                        return 'bg-gradient-to-r from-green-50 via-green-50/80 to-green-50';
                      } else {
                        return 'bg-gradient-to-r from-red-50 via-red-50/80 to-red-50';
                      }
                    };
                    
                    const getHoverBackground = () => {
                      if (tab.color === 'yellow') {
                        return 'bg-gradient-to-r from-gray-50/0 via-yellow-50/0 to-yellow-50/0 group-hover:from-gray-50/50 group-hover:via-yellow-50/50 group-hover:to-yellow-50/50';
                      } else if (tab.color === 'green') {
                        return 'bg-gradient-to-r from-gray-50/0 via-green-50/0 to-green-50/0 group-hover:from-gray-50/50 group-hover:via-green-50/50 group-hover:to-green-50/50';
                      } else {
                        return 'bg-gradient-to-r from-gray-50/0 via-red-50/0 to-red-50/0 group-hover:from-gray-50/50 group-hover:via-red-50/50 group-hover:to-red-50/50';
                      }
                    };
                    
                    const getBadgeClasses = () => {
                      if (tab.color === 'yellow') {
                        return isActive 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-yellow-50 text-yellow-600';
                      } else if (tab.color === 'green') {
                        return isActive 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-green-50 text-green-600';
                      } else {
                        return isActive 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-red-50 text-red-600';
                      }
                    };
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setPaymentTab(tab.id)}
                        className={`relative flex items-center gap-2 py-4 px-5 border-b-2 font-bold text-sm transition-all duration-300 whitespace-nowrap group ${getTabClasses()}`}
                      >
                        {/* Active indicator background */}
                        {isActive && (
                          <div className={`absolute inset-0 ${getActiveBackground()} rounded-t-xl`}></div>
                        )}
                        
                        {/* Hover background */}
                        <div className={`absolute inset-0 ${getHoverBackground()} rounded-t-xl transition-all duration-300`}></div>
                        
                        <span className="relative z-10">{tab.label}</span>
                        <span className={`relative z-10 px-3 py-1 text-xs rounded-xl font-semibold shadow-md ${getBadgeClasses()}`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bulk Actions */}
              {paymentTab === "pending" && filteredPayments.length > 0 && (
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-blue-50/50 backdrop-blur-sm border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelectAll}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                        />
                        <span className="ml-2 text-sm text-gray-700 font-semibold">Chọn tất cả</span>
                      </label>
                      {selectedPayments.length > 0 && (
                        <span className="text-sm text-gray-600 font-semibold">
                          Đã chọn {selectedPayments.length} giao dịch
                        </span>
                      )}
                    </div>
                    {selectedPayments.length > 0 && (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleBulkApprove}
                          className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 border border-transparent rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          Chấp thuận ({selectedPayments.length})
                        </button>
                        <button
                          onClick={handleBulkReject}
                          className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 border border-transparent rounded-xl hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          Từ chối ({selectedPayments.length})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment List */}
              <div className="overflow-x-auto p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 backdrop-blur-sm">
                    <tr>
                      {paymentTab === "pending" && (
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={isSelectAll}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                          />
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-200/50">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-white/80 backdrop-blur-sm transition-all duration-300">
                        {paymentTab === "pending" && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedPayments.includes(payment.id)}
                              onChange={() => handleSelectPayment(payment.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-bold text-gray-900">{payment.user}</div>
                            <div className="text-sm text-gray-500 font-medium">{payment.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {payment.amount.toLocaleString('vi-VN')} VNĐ
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md ${
                            payment.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                            payment.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                            payment.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                            'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                          }`}>
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {new Date(payment.date).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110"
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
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-xl transition-all duration-300 hover:scale-110"
                                  title="Duyệt thanh toán"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleRejectPayment(payment.id)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-lg">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold text-lg">Không có giao dịch nào</p>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Chi tiết giao dịch</h3>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Người dùng</label>
                    <p className="text-sm text-gray-900 font-bold">{selectedPayment.user}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <p className="text-sm text-gray-900 font-bold">{selectedPayment.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền</label>
                    <p className="text-lg font-bold text-gray-900">{selectedPayment.amount.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md ${
                      selectedPayment.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                      selectedPayment.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                      selectedPayment.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                      'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                    }`}>
                      {getStatusText(selectedPayment.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày tạo</label>
                    <p className="text-sm text-gray-900 font-bold">{new Date(selectedPayment.date).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Loại gói</label>
                    <p className="text-sm text-gray-900 font-bold">{selectedPayment.planType || 'N/A'}</p>
                  </div>
                </div>

                {selectedPayment.proof && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Ảnh chứng minh</label>
                    <div className="mt-2 bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200/50">
                      <img
                        src={selectedPayment.proof}
                        alt="Payment proof"
                        className="max-w-full h-auto rounded-xl border-2 border-gray-200 shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'none' }} className="text-sm text-gray-500 font-medium">
                        Không thể tải ảnh
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200/50">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
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
                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 border border-transparent rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Chấp thuận
                      </button>
                      <button
                        onClick={() => {
                          handleRejectPayment(selectedPayment.id);
                          setIsDetailModalOpen(false);
                        }}
                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 border border-transparent rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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