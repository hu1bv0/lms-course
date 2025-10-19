import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  PlayCircle, 
  CheckCircle,
  ArrowLeft,
  Calendar,
  Target,
  TrendingUp,
  Award,
  FileText,
  Video,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import courseService from '../../../services/firebase/courseService';

const ParentCourseDetail = ({ selectedChild, onBack }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentProgress, setStudentProgress] = useState(null);
  const [expandedLessons, setExpandedLessons] = useState(new Set());
  const [expandedExams, setExpandedExams] = useState(new Set());

  // Load course and progress
  const loadCourse = useCallback(async () => {
    if (!courseId || !selectedChild?.id) return;
    
    try {
      setLoading(true);
      
      // Load course details
      const courseResult = await courseService.getCourseById(courseId);
      if (courseResult.success) {
        setCourse(courseResult.course);
      }
      
      // Load student progress
      const progressResult = await courseService.getStudentProgress(selectedChild.id, courseId);
      if (progressResult.success) {
        setStudentProgress(progressResult);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Không thể tải thông tin khóa học');
    } finally {
      setLoading(false);
    }
  }, [courseId, selectedChild?.id]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  // Toggle lesson expansion
  const toggleLesson = (lessonId) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  // Toggle exam expansion
  const toggleExam = (examId) => {
    const newExpanded = new Set(expandedExams);
    if (newExpanded.has(examId)) {
      newExpanded.delete(examId);
    } else {
      newExpanded.add(examId);
    }
    setExpandedExams(newExpanded);
  };

  // Get difficulty text
  const getDifficultyText = (difficulty) => {
    const difficulties = {
      'easy': 'Dễ',
      'medium': 'Trung bình',
      'hard': 'Khó'
    };
    return difficulties[difficulty] || difficulty;
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!studentProgress) return 0;
    const totalItems = (course?.lessons?.length || 0) + (course?.exams?.length || 0);
    const completedItems = (studentProgress.completedLessons?.length || 0) + (studentProgress.completedExams?.length || 0);
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Check if lesson is completed
  const isLessonCompleted = (lessonId) => {
    return studentProgress?.completedLessons?.includes(lessonId) || false;
  };

  // Check if exam is completed
  const isExamCompleted = (examId) => {
    return studentProgress?.completedExams?.includes(examId) || false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
          <p className="text-gray-600">Khóa học này không tồn tại hoặc đã bị xóa</p>
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
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">Tiến độ: {calculateProgress()}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Con: {selectedChild?.name}</p>
                <p className="text-sm text-gray-600">{selectedChild?.grade}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons?.length || 0} bài học</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{course.exams?.length || 0} bài thi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolledStudents || 0} học sinh</span>
                  </div>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Tiến độ tổng thể</span>
                  <span className="font-medium">{calculateProgress()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Course Stats */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Thống kê học tập</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bài học hoàn thành</span>
                    <span className="font-medium">{studentProgress?.completedLessons?.length || 0}/{course.lessons?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bài thi hoàn thành</span>
                    <span className="font-medium">{studentProgress?.completedExams?.length || 0}/{course.exams?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Thời gian học</span>
                    <span className="font-medium">{course.duration} phút</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Đánh giá</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{course.averageRating || 5}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin khóa học</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cấp học</span>
                    <span className="font-medium">{course.educationLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Môn học</span>
                    <span className="font-medium">{course.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Độ khó</span>
                    <span className="font-medium">{getDifficultyText(course.difficulty)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ngày đăng ký</span>
                    <span className="font-medium">{course.enrolledAt ? new Date(course.enrolledAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bài học ({course.lessons?.length || 0})
          </h3>
          
          {course.lessons?.length > 0 ? (
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isLessonCompleted(lesson.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-600">
                            {lesson.parts?.length || 0} phần • {lesson.duration} phút
                          </p>
                        </div>
                      </div>
                      {expandedLessons.has(lesson.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedLessons.has(lesson.id) && (
                    <div className="px-4 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">{lesson.description}</p>
                        </div>
                        
                        {/* Lesson Parts */}
                        {lesson.parts?.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-900">Các phần:</h5>
                            {lesson.parts.map((part, partIndex) => (
                              <div key={partIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span>{part.title}</span>
                                {part.videoUrl && (
                                  <Video className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Attachments */}
                        {lesson.attachments && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Tài liệu đính kèm:</h5>
                            <div className="space-y-1">
                              {lesson.attachments.files?.map((file, fileIndex) => (
                                <div key={fileIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                  <FileText className="w-4 h-4" />
                                  <span>{file.name}</span>
                                  <Download className="w-3 h-3 text-gray-400" />
                                </div>
                              ))}
                              {lesson.attachments.images?.map((image, imageIndex) => (
                                <div key={imageIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                  <FileText className="w-4 h-4" />
                                  <span>{image.name}</span>
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không có bài học nào</p>
            </div>
          )}
        </div>

        {/* Exams */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bài thi ({course.exams?.length || 0})
          </h3>
          
          {course.exams?.length > 0 ? (
            <div className="space-y-3">
              {course.exams.map((exam, index) => (
                <div key={exam.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleExam(exam.id)}
                    className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isExamCompleted(exam.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Target className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{exam.title}</h4>
                          <p className="text-sm text-gray-600">
                            {exam.questions?.length || 0} câu hỏi • {exam.duration} phút
                          </p>
                        </div>
                      </div>
                      {expandedExams.has(exam.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedExams.has(exam.id) && (
                    <div className="px-4 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">{exam.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Số câu hỏi:</span>
                            <span className="ml-2 font-medium">{exam.questions?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Thời gian:</span>
                            <span className="ml-2 font-medium">{exam.duration} phút</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Điểm tối đa:</span>
                            <span className="ml-2 font-medium">{exam.maxScore || 100}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className={`ml-2 font-medium ${isExamCompleted(exam.id) ? 'text-green-600' : 'text-gray-600'}`}>
                              {isExamCompleted(exam.id) ? 'Đã hoàn thành' : 'Chưa làm'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không có bài thi nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentCourseDetail;
