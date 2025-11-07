import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { 
  GraduationCapIcon, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  Play,
  Clock,
  Star,
  MessageCircle,
  Crown,
  Target,
  Calendar,
  Award,
  User,
  ChevronDown,
  ClipboardList,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { USER_ROLES, SUBSCRIPTION_TYPES } from "../../../services/firebase";
import { toast } from 'react-toastify';
import CourseList from "../components/CourseList";
import courseService from "../../../services/firebase/courseService";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { userData, logout, role, subscriptionType } = useAuth();
  
  // Extract only what we need to prevent unnecessary re-renders
  const userId = userData?.uid;
  const displayName = userData?.displayName;
  
  // Debug: Log renders (remove after testing)
  console.log('StudentDashboard render:', { userId, role, subscriptionType });
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

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

  // Load enrolled courses
  const loadEnrolledCourses = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoadingCourses(true);
      const result = await courseService.getEnrolledCourses(userId);
      console.log('getEnrolledCourses result:', result);
      if (result.success) {
        console.log('Setting enrolled courses:', result.courses);
        console.log('First course details:', result.courses[0]);
        console.log('Course progress:', result.courses[0]?.progress);
        setEnrolledCourses(result.courses);
      }
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  }, [userId]);

  // Load recent activities
  const loadRecentActivities = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoadingActivities(true);
      const result = await courseService.getStudentRecentActivities(userId);
      if (result.success) {
        setRecentActivities(result.activities || []);
      } else {
        console.error('Error loading recent activities:', result.error);
        setRecentActivities([]);
      }
    } catch (error) {
      console.error('Error loading recent activities:', error);
      setRecentActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, [userId]);

  // Load achievements
  const loadAchievements = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoadingAchievements(true);
      const result = await courseService.getStudentAchievements(userId);
      if (result.success) {
        setAchievements(result.achievements);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoadingAchievements(false);
    }
  }, [userId]);

  // Handle course enrollment
  const handleEnrollCourse = useCallback(async (course) => {
    if (!userId) return;
    
    try {
      const result = await courseService.enrollCourse(userId, course.id);
      if (result.success) {
        // Reload enrolled courses directly
        const enrolledResult = await courseService.getEnrolledCourses(userId);
        if (enrolledResult.success) {
          setEnrolledCourses(enrolledResult.courses);
        }
        toast.success('Đăng ký khóa học thành công!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error('Có lỗi xảy ra khi đăng ký khóa học', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error enrolling course:', error);
      toast.error('Có lỗi xảy ra khi đăng ký khóa học', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [userId]);

  // Load enrolled courses on mount
  useEffect(() => {
    if (userId) {
      loadEnrolledCourses();
      loadAchievements();
      loadRecentActivities();
    }
  }, [userId, loadEnrolledCourses, loadAchievements, loadRecentActivities]);

  // Reload enrolled courses when component becomes visible (e.g., returning from course detail)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userId) {
        loadEnrolledCourses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [userId, loadEnrolledCourses]);

  // Calculate stats with real data
  const stats = {
    coursesCompleted: enrolledCourses.filter(course => course.progress === 100).length,
    totalPoints: enrolledCourses.reduce((sum, course) => sum + (course.points || 0), 0),
    streakDays: calculateLearningStreak(enrolledCourses),
    averageScore: enrolledCourses.length > 0 ? 
      Math.round(enrolledCourses.reduce((sum, course) => sum + (course.averageScore || 0), 0) / enrolledCourses.length) : 0
  };

  // Calculate learning streak from enrolled courses
  function calculateLearningStreak(courses) {
    // For now, calculate based on total completed lessons
    // In a real system, this would track daily activity logs
    const totalCompletedLessons = courses.reduce((sum, course) => {
      return sum + (Array.isArray(course.completedLessons) ? course.completedLessons.length : 0);
    }, 0);
    
    // Estimate streak based on completed lessons (1 lesson = 1 day of activity)
    const estimatedStreak = Math.min(30, Math.max(1, Math.floor(totalCompletedLessons / 2)));
    
    return estimatedStreak;
  }

  // Recent activities are now loaded from real data via loadRecentActivities()

  // Redirect if not student - REMOVED to prevent conflict with RequiredAuth
  // This logic is now handled by RequiredAuth component in routing
  // useEffect(() => {
  //   if (role && role !== USER_ROLES.STUDENT) {
  //     // Redirect to appropriate dashboard based on role
  //     switch (role) {
  //       case USER_ROLES.ADMIN:
  //         navigate(ENDPOINTS.ADMIN.DASHBOARD);
  //         break;
  //       case USER_ROLES.PARENT:
  //         navigate(ENDPOINTS.PARENT.DASHBOARD);
  //         break;
  //       default:
  //         navigate(ENDPOINTS.INDEX);
  //         break;
  //     }
  //   }
  // }, [role, navigate]);

  // RequiredAuth already handles role checking, so we can safely render
  // No need for additional role check that causes infinite loop
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/40 to-purple-50/40 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Learnly Student
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-semibold">
                      {displayName?.charAt(0) || "S"}
                    </span>
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-gray-700 font-semibold text-sm">{displayName || "Học sinh"}</span>
                    {/* Tier Display */}
                    <div className={`flex items-center gap-1 text-xs font-semibold ${
                      subscriptionType === SUBSCRIPTION_TYPES.PREMIUM 
                        ? "text-yellow-600" 
                        : "text-gray-500"
                    }`}>
                      {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM ? (
                        <>
                          <Crown className="w-3 h-3" />
                          <span>Premium</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-3 h-3" />
                          <span>Free</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
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
                    <button
                      onClick={() => {
                        navigate(ENDPOINTS.SHARED.SUBSCRIPTION);
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Quản lý gói học</span>
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
      <div className="relative bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {[
              { id: "overview", label: "Tổng quan", icon: BarChart3 },
              { id: "courses", label: "Khóa học của tôi", icon: BookOpen },
              { id: "all-courses", label: "Tất cả khóa học", icon: BookOpen },
              { id: "achievements", label: "Thành tích", icon: Trophy },
              { id: "survey", label: "Khảo sát", icon: ClipboardList },
              { id: "chatbot", label: "AI Chatbot", icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "survey") {
                    navigate(ENDPOINTS.STUDENT.SURVEY_HISTORY);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
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
                
                {/* Active dot indicator */}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                )}
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
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-10 text-white overflow-hidden shadow-2xl shadow-purple-500/30 transform hover:scale-[1.01] transition-transform duration-500">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50 animate-gradient-x"></div>
              
              {/* Decorative animated elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -ml-40 -mb-40 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
              
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="text-3xl md:text-4xl font-bold">
                      Chào mừng trở lại, {displayName || "Học sinh"}! 👋
                    </h2>
                    {/* Current Tier Badge */}
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                      subscriptionType === SUBSCRIPTION_TYPES.PREMIUM 
                        ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900" 
                        : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                    }`}>
                      {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM ? (
                        <>
                          <Crown className="w-4 h-4" />
                          <span>Premium</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4" />
                          <span>Free</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-blue-50 text-lg">
                    Hôm nay bạn muốn học gì? Hãy tiếp tục hành trình học tập của mình! 🚀
                  </p>
                </div>
                
                {/* Upgrade Button for Free Users */}
                {subscriptionType === SUBSCRIPTION_TYPES.FREE && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => navigate(ENDPOINTS.SHARED.SUBSCRIPTION)}
                      className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-yellow-900 px-6 py-3 rounded-xl font-bold hover:from-yellow-500 hover:via-orange-500 hover:to-pink-500 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 flex items-center gap-2"
                    >
                      <Crown className="w-5 h-5" />
                      <span>Nâng cấp Premium</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-white/50 hover:border-blue-300 group overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <BookOpen className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1 group-hover:text-blue-600 transition-colors">Khóa học hoàn thành</p>
                      <p className="text-4xl font-black text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.coursesCompleted}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-white/50 hover:border-green-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative p-4 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <Target className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1 group-hover:text-green-600 transition-colors">Điểm số</p>
                      <p className="text-4xl font-black text-gray-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.totalPoints}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-white/50 hover:border-purple-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative p-4 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <Calendar className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1 group-hover:text-purple-600 transition-colors">Ngày liên tiếp</p>
                      <p className="text-4xl font-black text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.streakDays}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-white/50 hover:border-yellow-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative p-4 bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-600 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <Star className="w-7 h-7 text-white fill-white relative z-10 drop-shadow-lg" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1 group-hover:text-orange-600 transition-colors">Điểm TB</p>
                      <p className="text-4xl font-black text-gray-900 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{stats.averageScore}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden group">
              {/* Animated border gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 transition-all duration-1000 rounded-2xl"></div>
              
              <div className="relative px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-purple-50/50 backdrop-blur-sm">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <div className="relative w-2 h-8 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Hoạt động gần đây
                  </span>
                </h3>
              </div>
              <div className="p-6">
                {loadingActivities ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có hoạt động nào</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id} className="relative flex items-center justify-between p-5 bg-gradient-to-r from-white/80 via-gray-50/50 to-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group/item overflow-hidden">
                        {/* Animated background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover/item:from-blue-50/50 group-hover/item:via-purple-50/50 group-hover/item:to-pink-50/50 transition-all duration-500"></div>
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000"></div>
                        
                        <div className="relative flex items-center gap-4 z-10">
                          <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300 ${
                            activity.type === "lesson_completed" ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700" :
                            activity.type === "quiz_completed" ? "bg-gradient-to-br from-green-500 via-green-600 to-emerald-700" :
                            "bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-600"
                          }`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                            {activity.type === "lesson_completed" && <BookOpen className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />}
                            {activity.type === "quiz_completed" && <Target className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />}
                            {activity.type === "achievement_earned" && <Trophy className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg group-hover/item:text-blue-600 transition-colors">{activity.title}</p>
                            {activity.course && (
                              <p className="text-sm text-gray-600 font-medium">{activity.course}</p>
                            )}
                          </div>
                        </div>
                        <div className="relative text-right z-10">
                          <p className="text-sm font-black text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-200 shadow-md group-hover/item:scale-110 transition-transform duration-300">
                            +{typeof activity.points === 'number' ? activity.points : 50} điểm
                          </p>
                          <p className="text-xs text-gray-500 mt-2 font-medium">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-6">
            {/* Courses Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Khóa học của tôi</h3>
                <p className="text-gray-600">Tiếp tục học tập và phát triển kỹ năng</p>
              </div>
              <button 
                onClick={() => setActiveTab("all-courses")}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <BookOpen className="w-5 h-5" />
                Xem tất cả khóa học
              </button>
            </div>

            {/* Enrolled Courses */}
            {loadingCourses ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải khóa học...</p>
                </div>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có khóa học nào</h3>
                <p className="text-gray-600 mb-6">Hãy khám phá và đăng ký các khóa học phù hợp</p>
                <button 
                  onClick={() => setActiveTab("all-courses")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Khám phá khóa học
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden group transform hover:-translate-y-2">
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                    
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/30 group-hover:to-pink-50/30 transition-all duration-500"></div>
                    
                    <div className="relative">
                      {course.thumbnail ? (
                        <div className="relative overflow-hidden">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Overlay gradient on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ) : (
                        <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 via-purple-400/50 to-pink-400/50 animate-pulse"></div>
                          <BookOpen className="w-20 h-20 text-white opacity-90 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xl border border-white/50 group-hover:scale-110 transition-transform duration-300">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                          <span className="text-sm font-black text-gray-900">{course.averageRating || 5}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-200/50 backdrop-blur-sm">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-700 relative overflow-hidden" 
                          style={{ width: `${course.progress || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative p-6 z-10">
                      <h4 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg text-xs font-bold shadow-sm border border-blue-200">{course.subject}</span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-xs font-bold shadow-sm border border-purple-200">Lớp {course.grade}</span>
                      </p>
                      
                      <div className="space-y-3 mb-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-700">Tiến độ học tập</span>
                          <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{course.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200/80 rounded-full h-4 overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-700 shadow-lg relative overflow-hidden" 
                            style={{ width: `${course.progress || 0}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 font-semibold">
                          <span>{Array.isArray(course.completedLessons) ? course.completedLessons.length : (course.completedLessons || 0)}/{course.totalLessons || 0} bài học</span>
                          <span>{Math.round((course.totalLessons || 0) * (100 - (course.progress || 0)) / 100)} bài còn lại</span>
                        </div>
                      </div>
                      
                      <button className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3.5 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-black text-sm overflow-hidden group/btn"
                        onClick={() => navigate(`/student/course/${course.id}`)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        <Play className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Tiếp tục học</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "all-courses" && (
          <CourseList 
            userRole={role}
            subscriptionType={subscriptionType}
            userId={userId}
            onEnrollCourse={handleEnrollCourse}
          />
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Thành tích của tôi</h3>
                <p className="text-gray-600">Khám phá và đạt được các thành tích mới</p>
              </div>
            </div>

            {loadingAchievements ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-yellow-400 hover:border-yellow-500 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:-rotate-1 overflow-hidden group">
                    {/* Animated glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                    
                    {/* Decorative animated gradients */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full -mr-20 -mt-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-200/30 to-yellow-200/30 rounded-full -ml-16 -mb-16 animate-pulse delay-1000"></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative flex items-start gap-4 mb-4 z-10">
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
                        {achievement.type === 'course_completion' ? (
                          <BookOpen className="w-10 h-10 text-white relative z-10 drop-shadow-2xl" />
                        ) : achievement.type === 'exam_completion' ? (
                          <Award className="w-10 h-10 text-white relative z-10 drop-shadow-2xl" />
                        ) : (
                          <Trophy className="w-10 h-10 text-white relative z-10 drop-shadow-2xl" />
                        )}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full animate-ping"></div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-xl mb-2 group-hover:text-yellow-600 transition-colors">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 font-medium">{achievement.description}</p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center gap-2 text-sm font-black text-green-600 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 px-4 py-2.5 rounded-xl border-2 border-green-200 shadow-md group-hover:scale-105 transition-transform duration-300 z-10">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Đã đạt được - {new Date(achievement.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có thành tích nào</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Hãy hoàn thành các khóa học và bài thi để nhận được thành tích đầu tiên!
                </p>
                <button 
                  onClick={() => setActiveTab("courses")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  Khám phá khóa học
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl border-2 border-white/50 p-12 md:p-16 overflow-hidden group">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl -ml-40 -mb-40 animate-pulse delay-1000"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
            
            <div className="relative text-center max-w-2xl mx-auto z-10">
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
                <MessageCircle className="w-16 h-16 text-white relative z-10 drop-shadow-2xl" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Chatbot
              </h3>
              <p className="text-xl text-gray-700 mb-10 font-medium leading-relaxed">
                Hỏi đáp với AI để được hỗ trợ học tập 24/7. Giải đáp mọi thắc mắc về bài học một cách nhanh chóng và chính xác.
              </p>
              <button 
                onClick={() => navigate(ENDPOINTS.SHARED.CHATBOT)}
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 font-black text-lg flex items-center gap-3 mx-auto overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                <MessageCircle className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Bắt đầu chat với AI</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
