import React, { useState, useEffect, useCallback } from 'react';
import { 
  Award, 
  Trophy, 
  Medal, 
  Star,
  Calendar,
  Target,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Filter,
  Search,
  Download,
  Share2,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import courseService from '../../../services/firebase/courseService';

const ParentAchievements = ({ selectedChild, onBack }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'course', 'exam', 'streak'
  const [searchTerm, setSearchTerm] = useState('');

  // Load achievements
  const loadAchievements = useCallback(async () => {
    if (!selectedChild?.id) return;
    
    try {
      setLoading(true);
      const result = await courseService.getStudentAchievements(selectedChild.id);
      if (result.success) {
        setAchievements(result.achievements || []);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
      toast.error('Không thể tải thành tích');
    } finally {
      setLoading(false);
    }
  }, [selectedChild?.id]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || achievement.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Get achievement icon
  const getAchievementIcon = (type) => {
    switch (type) {
      case 'course_completion':
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'exam_completion':
        return <Medal className="w-8 h-8 text-blue-500" />;
      case 'streak':
        return <Star className="w-8 h-8 text-purple-500" />;
      default:
        return <Award className="w-8 h-8 text-gray-500" />;
    }
  };

  // Get achievement color
  const getAchievementColor = (type) => {
    switch (type) {
      case 'course_completion':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500';
      case 'exam_completion':
        return 'bg-gradient-to-br from-blue-400 to-purple-500';
      case 'streak':
        return 'bg-gradient-to-br from-purple-400 to-pink-500';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  };

  // Get achievement type label
  const getAchievementTypeLabel = (type) => {
    switch (type) {
      case 'course_completion':
        return 'Hoàn thành khóa học';
      case 'exam_completion':
        return 'Hoàn thành bài thi';
      case 'streak':
        return 'Chuỗi học tập';
      default:
        return 'Thành tích khác';
    }
  };

  // Mock data for demonstration
  const mockAchievements = [
    {
      id: 'achievement_1',
      type: 'course_completion',
      title: 'Hoàn thành khóa học Toán lớp 3',
      description: 'Đã hoàn thành tất cả bài học trong khóa học Toán lớp 3',
      courseTitle: 'Toán lớp 3',
      earnedAt: '2024-01-15T10:30:00Z',
      score: 95
    },
    {
      id: 'achievement_2',
      type: 'exam_completion',
      title: 'Xuất sắc trong bài thi Kiểm tra giữa kỳ',
      description: 'Đạt điểm cao trong bài thi Kiểm tra giữa kỳ môn Toán',
      courseTitle: 'Toán lớp 3',
      earnedAt: '2024-01-10T14:20:00Z',
      score: 88
    },
    {
      id: 'achievement_3',
      type: 'streak',
      title: 'Chuỗi học tập 7 ngày',
      description: 'Học tập liên tục trong 7 ngày',
      courseTitle: 'Tổng hợp',
      earnedAt: '2024-01-08T09:15:00Z',
      score: null
    },
    {
      id: 'achievement_4',
      type: 'course_completion',
      title: 'Hoàn thành khóa học Tiếng Việt lớp 3',
      description: 'Đã hoàn thành tất cả bài học trong khóa học Tiếng Việt lớp 3',
      courseTitle: 'Tiếng Việt lớp 3',
      earnedAt: '2024-01-05T16:45:00Z',
      score: 92
    },
    {
      id: 'achievement_5',
      type: 'exam_completion',
      title: 'Hoàn thành bài thi Cuối kỳ',
      description: 'Đã hoàn thành bài thi Cuối kỳ môn Tiếng Việt',
      courseTitle: 'Tiếng Việt lớp 3',
      earnedAt: '2024-01-03T11:30:00Z',
      score: 85
    }
  ];

  // Use mock data if no real data
  const displayAchievements = achievements.length > 0 ? filteredAchievements : mockAchievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || achievement.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thành tích...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-semibold text-gray-900">Thành tích của {selectedChild?.name}</h1>
                <p className="text-sm text-gray-600">{displayAchievements.length} thành tích</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Khóa học hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayAchievements.filter(a => a.type === 'course_completion').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Medal className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bài thi hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayAchievements.filter(a => a.type === 'exam_completion').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chuỗi học tập</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayAchievements.filter(a => a.type === 'streak').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng thành tích</p>
                <p className="text-2xl font-bold text-gray-900">{displayAchievements.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thành tích..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="md:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="course_completion">Hoàn thành khóa học</option>
                <option value="exam_completion">Hoàn thành bài thi</option>
                <option value="streak">Chuỗi học tập</option>
              </select>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        {displayAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAchievements.map((achievement, index) => (
              <div key={achievement.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Achievement Header */}
                <div className={`${getAchievementColor(achievement.type)} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getAchievementIcon(achievement.type)}
                      <div>
                        <h3 className="font-semibold text-lg">{achievement.title}</h3>
                        <p className="text-sm opacity-90">{getAchievementTypeLabel(achievement.type)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Điểm</div>
                      <div className="text-lg font-bold">
                        {achievement.score ? `${achievement.score}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm">{achievement.description}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{achievement.courseTitle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(achievement.earnedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-gray-800">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thành tích</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Thử thay đổi bộ lọc để tìm thêm thành tích'
                : 'Con bạn chưa có thành tích nào'
              }
            </p>
          </div>
        )}

        {/* Achievement Timeline */}
        {displayAchievements.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline thành tích</h3>
            
            <div className="space-y-4">
              {displayAchievements
                .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
                .map((achievement, index) => (
                <div key={achievement.id || index} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getAchievementColor(achievement.type)}`}>
                      {getAchievementIcon(achievement.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.courseTitle}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(achievement.earnedAt).toLocaleDateString('vi-VN')}
                        </div>
                        {achievement.score && (
                          <div className="text-sm font-medium text-gray-900">
                            {achievement.score} điểm
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentAchievements;
