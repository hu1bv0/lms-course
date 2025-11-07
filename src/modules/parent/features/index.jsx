import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  Star,
  Calendar,
  BarChart3,
  Target,
  CheckCircle,
  PlayCircle,
  FileText,
  Trophy,
  Medal,
  ChevronRight,
  Eye,
  UserCheck,
  User,
  LogOut
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import courseService from '../../../services/firebase/courseService';
import { parentService, authService } from '../../../services/firebase';
import ParentCourseList from '../components/CourseList';
import ParentCourseDetail from '../components/CourseDetail';
import ParentProgressTracking from '../components/ProgressTracking';
import ParentAchievements from '../components/Achievements';
import ParentProfile from '../components/ParentProfile';
import NotificationDropdown from '../../../components/NotificationDropdown';

const ParentDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'courses', 'course-detail', 'profile'
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childCourses, setChildCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [childAchievements, setChildAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Load children data from Firebase
  const loadChildren = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoadingChildren(true);
      const result = await parentService.getParentChildren(user.uid);
      
      if (result.success) {
        setChildren(result.children);
        if (result.children.length > 0 && !selectedChild) {
          setSelectedChild(result.children[0]);
        }
      } else {
        console.error('Error loading children:', result.error);
        toast.error('Không thể tải danh sách con cái');
      }
    } catch (error) {
      console.error('Error loading children:', error);
      toast.error('Không thể tải danh sách con cái');
    } finally {
      setLoadingChildren(false);
    }
  }, [user?.uid, selectedChild]);

  // Load child courses
  const loadChildCourses = useCallback(async (childId) => {
    if (!childId) return;
    
    try {
      setLoadingCourses(true);
      const result = await parentService.getChildCourses(childId);
      if (result.success) {
        setChildCourses(result.courses || []);
      }
    } catch (error) {
      console.error('Error loading child courses:', error);
      toast.error('Không thể tải khóa học của con');
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  // Load child achievements
  const loadChildAchievements = useCallback(async (childId) => {
    if (!childId) return;
    
    try {
      setLoadingAchievements(true);
      const result = await parentService.getChildAchievements(childId);
      if (result.success) {
        setChildAchievements(result.achievements || []);
      }
    } catch (error) {
      console.error('Error loading child achievements:', error);
      toast.error('Không thể tải thành tích của con');
    } finally {
      setLoadingAchievements(false);
    }
  }, []);

  // Load recent activities
  const loadRecentActivities = useCallback(async (childId) => {
    if (!childId) return;
    
    try {
      setLoadingActivities(true);
      const result = await parentService.getChildRecentActivities(childId);
      if (result.success) {
        setRecentActivities(result.activities || []);
      }
    } catch (error) {
      console.error('Error loading recent activities:', error);
      toast.error('Không thể tải hoạt động gần đây');
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  useEffect(() => {
    if (selectedChild) {
      loadChildCourses(selectedChild.id);
      loadChildAchievements(selectedChild.id);
      loadRecentActivities(selectedChild.id);
    }
  }, [selectedChild, loadChildCourses, loadChildAchievements, loadRecentActivities]);

  // Navigation handlers
  const handleViewCourses = () => {
    setCurrentView('courses');
    setActiveTab('courses');
  };

  const handleViewCourseDetail = (courseId) => {
    setSelectedCourseId(courseId);
    setCurrentView('course-detail');
  };

  const handleBackToCourses = () => {
    setCurrentView('courses');
    setSelectedCourseId(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCourseId(null);
    setActiveTab('overview');
  };

  const handleViewProfile = () => {
    setCurrentView('profile');
  };

  const handleLogout = async () => {
    try {
      // Firebase Auth logout
      await authService.logout();
      
      // Clear Redux state
      dispatch(clearUser());
      
      toast.success('Đăng xuất thành công!', {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Có lỗi xảy ra khi đăng xuất', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleBackFromProfile = () => {
    setCurrentView('dashboard');
    loadChildren(); // Reload children after potential changes
  };

  // Calculate stats
  const stats = {
    totalChildren: children.length,
    totalEnrolledCourses: childCourses.length,
    totalCompletedCourses: childCourses.filter(course => course.progress >= 100).length,
    totalStudyTime: childCourses.reduce((sum, course) => sum + (course.duration || 0), 0),
    averageRating: childCourses.length > 0 
      ? (childCourses.reduce((sum, course) => sum + (course.averageRating || 5), 0) / childCourses.length).toFixed(1)
      : 5
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'courses', label: 'Khóa học', icon: BookOpen },
    { id: 'progress', label: 'Tiến độ', icon: TrendingUp },
    { id: 'achievements', label: 'Thành tích', icon: Award }
  ];

  // Render different views
  if (currentView === 'courses') {
    return (
      <ParentCourseList 
        selectedChild={selectedChild}
        onBack={handleBackToDashboard}
        onCourseClick={handleViewCourseDetail}
      />
    );
  }

  if (currentView === 'course-detail') {
    return (
      <ParentCourseDetail 
        selectedChild={selectedChild}
        onBack={handleBackToCourses}
      />
    );
  }

  if (currentView === 'progress-tracking') {
    return (
      <ParentProgressTracking 
        selectedChild={selectedChild}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'achievements-view') {
    return (
      <ParentAchievements 
        selectedChild={selectedChild}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Render profile view
  if (currentView === 'profile') {
    return <ParentProfile onBack={handleBackFromProfile} />;
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
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard Phụ huynh</h1>
                <p className="text-sm text-gray-600 font-medium">Theo dõi việc học tập của con cái</p>
              </div>
            </div>
            
            {/* Children Selector, Notifications and Profile */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 font-semibold">Con:</span>
              <select 
                value={selectedChild?.id || ''} 
                onChange={(e) => {
                  const child = children.find(c => c.id === e.target.value);
                  setSelectedChild(child);
                }}
                className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 font-medium"
              >
                <option value="" disabled>
                  {loadingChildren ? 'Đang tải...' : children.length === 0 ? 'Chưa thêm con' : 'Chọn con'}
                </option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} (Lớp {child.grade})
                  </option>
                ))}
              </select>
              
              {/* Notification Bell */}
              <NotificationDropdown userRole="parent" />
              
              <button
                onClick={handleViewProfile}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-sm hover:shadow-md font-semibold"
                title="Thông tin cá nhân"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Thông tin cá nhân</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md font-semibold"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Tổng số con</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.totalChildren}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Khóa học đã đăng ký</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.totalEnrolledCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Khóa học hoàn thành</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalCompletedCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Thời gian học (phút)</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.totalStudyTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Đánh giá trung bình</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">{stats.averageRating}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4 shadow-lg">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có con nào</h3>
              <p className="text-gray-600 mb-6 font-medium">Bạn cần thêm thông tin con cái để sử dụng tính năng này</p>
              <button
                onClick={handleViewProfile}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 font-semibold"
              >
                Thêm thông tin con
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        {children.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 mb-6 overflow-hidden">
          <div className="border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/30">
            <nav className="flex space-x-2 px-6 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-4 px-5 border-b-2 font-bold text-sm flex items-center gap-2 transition-all duration-300 whitespace-nowrap group ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {/* Active indicator background */}
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-t-xl"></div>
                    )}
                    
                    {/* Hover background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50/0 via-blue-50/0 to-purple-50/0 group-hover:from-gray-50/50 group-hover:via-blue-50/50 group-hover:to-purple-50/50 rounded-t-xl transition-all duration-300"></div>
                    
                    <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${activeTab === tab.id ? 'text-blue-600 scale-110' : 'group-hover:scale-110'}`} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
                      </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {loadingChildren ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Đang tải thông tin...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Children Overview */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Thông tin con cái</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {children.map(child => (
                          <div key={child.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                  <UserCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-lg">{child.name}</h4>
                                  <p className="text-sm text-gray-600 font-medium">Lớp {child.grade}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-xl shadow-md">
                                <Star className="w-4 h-4 text-white fill-current" />
                                <span className="text-sm font-bold text-white">{child.averageRating || 5}</span>
                              </div>
              </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-xl border border-blue-200/50">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-700">{child.enrolledCourses || 0} khóa</span>
                              </div>
                              <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200/50">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-gray-700">{child.completedCourses || 0} hoàn thành</span>
                              </div>
                              <div className="flex items-center gap-2 bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-xl border border-orange-200/50">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-semibold text-gray-700">{child.totalStudyTime || 0} phút</span>
                              </div>
                              <div className="flex items-center gap-2 bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200/50">
                                <TrendingUp className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-semibold text-gray-700">{Math.round(((child.completedCourses || 0) / (child.enrolledCourses || 1)) * 100)}%</span>
                              </div>
                            </div>
                          </div>
                  ))}
                </div>
              </div>

                    {/* Recent Activity */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Hoạt động gần đây</h3>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-lg">
                        {loadingActivities ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              <p className="text-sm text-gray-600 font-medium">Đang tải hoạt động...</p>
                            </div>
                          </div>
                        ) : recentActivities.length > 0 ? (
                          <div className="space-y-3">
                            {recentActivities.map((activity, index) => (
                              <div key={index} className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                                  activity.type === 'course_completion' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                                  activity.type === 'lesson_start' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                                  activity.type === 'achievement' ? 'bg-gradient-to-br from-yellow-400 to-orange-400' :
                                  'bg-gradient-to-br from-gray-400 to-gray-500'
                                }`}>
                                  {activity.type === 'course_completion' ? (
                                    <CheckCircle className="w-6 h-6 text-white" />
                                  ) : activity.type === 'lesson_start' ? (
                                    <PlayCircle className="w-6 h-6 text-white" />
                                  ) : activity.type === 'achievement' ? (
                                    <Award className="w-6 h-6 text-white" />
                                  ) : (
                                    <Clock className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900">
                                    {activity.description}
                                  </p>
                                  <p className="text-xs text-gray-500 font-medium mt-1">{activity.timeAgo}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-lg">
                              <Clock className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">Chưa có hoạt động</h4>
                            <p className="text-sm text-gray-600 font-medium">Con bạn chưa có hoạt động nào gần đây</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                    </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Khóa học của {selectedChild?.name} ({childCourses.length})
                  </h3>
                  <button
                    onClick={handleViewCourses}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    Xem tất cả khóa học
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                {loadingCourses ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Đang tải khóa học...</p>
                    </div>
                  </div>
                ) : childCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {childCourses.map(course => (
                      <div key={course.id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                              <p className="text-sm text-gray-600 mb-3 font-medium">{course.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 bg-gradient-to-br from-blue-50 to-purple-50 px-3 py-1.5 rounded-lg border border-blue-200/50">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="font-semibold text-gray-700">{course.duration} phút</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-1.5 rounded-lg border border-green-200/50">
                                  <BookOpen className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold text-gray-700">{course.totalLessons || 0} bài học</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-xl shadow-md">
                              <Star className="w-4 h-4 text-white fill-current" />
                              <span className="text-sm font-bold text-white">{course.averageRating || 5}</span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600 font-semibold">Tiến độ</span>
                              <span className="font-bold text-gray-900">{course.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-md"
                                style={{ width: `${course.progress || 0}%` }}
                              ></div>
                    </div>
                  </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                            <div className="text-sm text-gray-600 font-semibold">
                              {Array.isArray(course.completedLessons) ? course.completedLessons.length : (course.completedLessons || 0)}/{course.totalLessons || 0} bài học
                            </div>
                            <button 
                              onClick={() => handleViewCourseDetail(course.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm font-semibold"
                            >
                              <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                          </div>
                  </div>
                </div>
              ))}
            </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học</h3>
                    <p className="text-gray-600">Con bạn chưa đăng ký khóa học nào</p>
                  </div>
                )}
          </div>
        )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tiến độ học tập</h3>
                  <button
                    onClick={() => setCurrentView('progress-tracking')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    Xem chi tiết
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Biểu đồ tiến độ</h3>
                    <p className="text-gray-600 mb-4">Xem chi tiết tiến độ học tập của con</p>
                    <button
                      onClick={() => setCurrentView('progress-tracking')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Xem báo cáo chi tiết
              </button>
                  </div>
            </div>
          </div>
        )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Thành tích của {selectedChild?.name}</h3>
                  <button
                    onClick={() => setCurrentView('achievements-view')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    Xem tất cả
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {loadingAchievements ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Đang tải thành tích...</p>
                    </div>
                  </div>
                ) : childAchievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {childAchievements.map((achievement, index) => (
                      <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {achievement.type === 'course_completion' ? (
                              <Trophy className="w-7 h-7 text-white" />
                            ) : (
                              <Medal className="w-7 h-7 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{achievement.title}</h3>
                            <p className="text-sm text-gray-600 font-medium">{achievement.description}</p>
                </div>
              </div>

                        <div className="space-y-2 pt-4 border-t border-gray-200/50">
                          <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-purple-50 p-2 rounded-lg border border-blue-200/50">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-700">{new Date(achievement.earnedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-emerald-50 p-2 rounded-lg border border-green-200/50">
                            <Target className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-700">{achievement.courseTitle}</span>
                </div>
              </div>
            </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thành tích</h3>
                    <p className="text-gray-600">Con bạn chưa có thành tích nào</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;