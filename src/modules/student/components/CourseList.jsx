import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users, 
  Play, 
  Search,
  Filter,
  ChevronDown,
  Crown,
  Lock,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import courseService from '../../../services/firebase/courseService';
import { ACCESS_LEVELS, DIFFICULTY_LEVELS } from '../../../constants/educationConstants';

const CourseList = ({ userRole, subscriptionType, onEnrollCourse }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null); // Track which course is being enrolled
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load enrolled courses separately
  const loadEnrolledCourses = async () => {
    try {
        const userId = 'FewUVCMbr7QZBoW2pwVqx1NZtXm1'; // Use correct student ID
      console.log('Loading enrolled courses for user:', userId);
      const enrolledResult = await courseService.getEnrolledCourses(userId);
      console.log('Enrolled courses result:', enrolledResult);
      if (enrolledResult.success) {
        const enrolledIds = enrolledResult.courses.map(course => course.id);
        console.log('Setting enrolled courses:', enrolledIds);
        setEnrolledCourses(enrolledIds);
      }
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
    loadEnrolledCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const result = await courseService.getAllCourses();
      if (result.success) {
        setCourses(result.courses);
      } else {
        toast.error('Không thể tải danh sách khóa học', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Có lỗi xảy ra khi tải khóa học', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = !selectedLevel || course.educationLevel === selectedLevel;
    const matchesSubject = !selectedSubject || course.subject === selectedSubject;
    const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesLevel && matchesSubject && matchesDifficulty;
  });

  // Check if user can access course
  const canAccessCourse = (course) => {
    if (course.accessLevel === ACCESS_LEVELS.FREE) return true;
    if (course.accessLevel === ACCESS_LEVELS.PREMIUM && subscriptionType === 'premium') return true;
    return false;
  };

  // Handle course enrollment or navigation
  const handleEnrollCourse = async (course) => {
    console.log('handleEnrollCourse called for course:', course.id);
    console.log('Current enrolledCourses:', enrolledCourses);
    console.log('Is course enrolled?', enrolledCourses.includes(course.id));
    
    // Nếu đã enroll thì chuyển đến trang học
    if (enrolledCourses.includes(course.id)) {
      console.log('Course already enrolled, navigating to course detail');
      navigate(`/student/course/${course.id}`);
      return;
    }

    // Nếu chưa enroll thì kiểm tra quyền truy cập
    if (!canAccessCourse(course)) {
      toast.warning('Bạn cần nâng cấp lên Premium để truy cập khóa học này', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Set loading state để disable button
    setEnrollingCourseId(course.id);

    try {
      if (onEnrollCourse) {
        await onEnrollCourse(course);
        // Sau khi enroll thành công, reload enrolled courses
        console.log('Enrollment successful, reloading enrolled courses...');
        await loadEnrolledCourses();
      }
    } catch (error) {
      console.error('Error enrolling course:', error);
      toast.error('Có lỗi xảy ra khi đăng ký khóa học', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      // Clear loading state
      setEnrollingCourseId(null);
    }
  };

  // Handle course click to view details
  const handleCourseClick = (course) => {
    navigate(`/student/course/${course.id}`);
  };

  // Get unique values for filters - hiển thị tất cả options
  const educationLevels = ['primary', 'secondary', 'high'];
  const subjects = ['Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lý', 'Ngữ văn', 'Tiếng Anh', 'Khoa học', 'Tin học'];
  const difficulties = ['easy', 'medium', 'hard'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Khóa học</h2>
          <p className="text-gray-600">Khám phá và đăng ký các khóa học phù hợp</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {filteredCourses.length} khóa học
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Education Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cấp học
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả cấp học</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level}>
                      {level === 'primary' ? 'Tiểu học' : 
                       level === 'secondary' ? 'Trung học cơ sở' : 
                       level === 'high' ? 'Trung học phổ thông' : level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Môn học
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả môn học</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả độ khó</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {Object.values(DIFFICULTY_LEVELS).find(d => d.id === difficulty)?.name || difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedLevel('');
                  setSelectedSubject('');
                  setSelectedDifficulty('');
                  setSearchTerm('');
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy khóa học</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              {/* Course Thumbnail */}
              <div className="relative">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                )}
                
                {/* Access Level Badge */}
                <div className="absolute top-4 left-4">
                  {course.accessLevel === ACCESS_LEVELS.PREMIUM ? (
                    <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                      <Crown className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      <span>Miễn phí</span>
                    </div>
                  )}
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
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {course.subject} - Lớp {course.grade}
                  </p>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description || 'Không có mô tả'}
                </p>
                
                {/* Course Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrolledStudents || 0} học sinh</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Độ khó:</span>
                    <span className="font-medium">
                      {Object.values(DIFFICULTY_LEVELS).find(d => d.id === course.difficulty)?.name || course.difficulty}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnrollCourse(course);
                  }}
                  disabled={!canAccessCourse(course) || enrollingCourseId === course.id}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                    canAccessCourse(course) && enrollingCourseId !== course.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {enrollingCourseId === course.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang đăng ký...</span>
                    </>
                  ) : canAccessCourse(course) ? (
                    <>
                      <Play className="w-4 h-4" />
                      <span>{enrolledCourses.includes(course.id) ? 'Tiếp tục học' : 'Bắt đầu học'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Cần Premium</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
