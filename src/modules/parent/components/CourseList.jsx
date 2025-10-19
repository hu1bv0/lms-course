import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  PlayCircle, 
  CheckCircle,
  Eye,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import courseService from '../../../services/firebase/courseService';

const ParentCourseList = ({ selectedChild, onBack }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const educationLevels = [
    { id: 'primary', label: 'Tiểu học' },
    { id: 'secondary', label: 'Trung học cơ sở' },
    { id: 'high', label: 'Trung học phổ thông' }
  ];

  const subjects = [
    'Toán học', 'Ngữ văn', 'Tiếng Anh', 'Khoa học', 'Lịch sử', 'Địa lý', 'Vật lý', 'Hóa học', 'Sinh học'
  ];

  const difficulties = [
    { id: 'easy', label: 'Dễ' },
    { id: 'medium', label: 'Trung bình' },
    { id: 'hard', label: 'Khó' }
  ];

  // Load courses
  const loadCourses = useCallback(async () => {
    if (!selectedChild?.id) return;
    
    try {
      setLoading(true);
      const result = await courseService.getEnrolledCourses(selectedChild.id);
      if (result.success) {
        setCourses(result.courses || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  }, [selectedChild?.id]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || course.educationLevel === selectedLevel;
    const matchesSubject = !selectedSubject || course.subject === selectedSubject;
    const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesLevel && matchesSubject && matchesDifficulty;
  });

  // Handle course click
  const handleCourseClick = (courseId) => {
    navigate(`/parent/course/${courseId}`);
  };

  // Get difficulty text
  const getDifficultyText = (difficulty) => {
    const diff = difficulties.find(d => d.id === difficulty);
    return diff ? diff.label : difficulty;
  };

  // Get progress color
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
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
                <h1 className="text-xl font-semibold text-gray-900">Khóa học của {selectedChild?.name}</h1>
                <p className="text-sm text-gray-600">{filteredCourses.length} khóa học</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cấp học</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả cấp học</option>
                  {educationLevels.map(level => (
                    <option key={level.id} value={level.id}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Môn học</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả môn học</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Độ khó</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả độ khó</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty.id} value={difficulty.id}>{difficulty.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Course Image */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white opacity-80" />
                  </div>
                  
                  {/* Progress Badge */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{course.progress || 0}%</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{course.averageRating || 5}</span>
                    </div>
                  </div>
                </div>
                
                {/* Course Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  </div>
                  
                  {/* Course Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.totalLessons || 0} bài học</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolledStudents || 0} học sinh</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {getDifficultyText(course.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Tiến độ học tập</span>
                      <span className="font-medium">{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress || 0)}`}
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Array.isArray(course.completedLessons) ? course.completedLessons.length : (course.completedLessons || 0)}/{course.totalLessons || 0} bài học hoàn thành
                    </div>
                  </div>
                  
                  {/* Last Accessed */}
                  {course.lastAccessedAt && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Truy cập lần cuối: {new Date(course.lastAccessedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {course.progress === 100 ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Hoàn thành</span>
                        </div>
                      ) : course.progress > 0 ? (
                        <div className="flex items-center gap-1 text-blue-600">
                          <PlayCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Đang học</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm font-medium">Chưa bắt đầu</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleCourseClick(course.id)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
            <p className="text-gray-600">
              {searchTerm || selectedLevel || selectedSubject || selectedDifficulty 
                ? 'Thử thay đổi bộ lọc để tìm thêm khóa học'
                : 'Con bạn chưa đăng ký khóa học nào'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentCourseList;
