import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  BookOpen, 
  FileText, 
  Clock, 
  Users, 
  Star, 
  ChevronRight,
  CheckCircle,
  Circle,
  Lock,
  Crown,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth';
import courseService from '../../../services/firebase/courseService';
import RatingModal from './RatingModal';
import CoursePlayer from './CoursePlayer';
import LessonViewer from './LessonViewer';
import ExamViewer from './ExamViewer';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const studentId = userData?.uid;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('overview'); // overview, lesson, exam
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [completedExams, setCompletedExams] = useState(new Set());
  const [completedParts, setCompletedParts] = useState(new Map()); // Map lessonId -> Set of completed parts
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [studentRating, setStudentRating] = useState(null);

  const loadCourse = useCallback(async () => {
    console.log('loadCourse called with:', { studentId, courseId });
    if (!studentId || !courseId) {
      console.log('Missing studentId or courseId, aborting load');
      return;
    }
    try {
      setLoading(true);
      console.log('Calling getCourseById for:', courseId);
      const result = await courseService.getCourseById(courseId);
      console.log('🎯 CourseDetail - RAW result:', JSON.parse(JSON.stringify(result)));
      console.log('🎯 CourseDetail - result.course keys:', Object.keys(result.course || {}));
      
      // FIX: Handle both old and new courseService structure
      let courseData = result.course;
      if (courseData && courseData.data) {
        // Old structure: { success, course: { success, data, id } }
        console.log('⚠️ Detected old courseService structure, using course.data');
        courseData = courseData.data;
      }
      
      console.log('🎯 CourseDetail - courseData.lessons:', courseData?.lessons);
      console.log('🎯 CourseDetail - courseData.exams:', courseData?.exams);
      console.log('🎯 CourseDetail - typeof lessons:', typeof courseData?.lessons);
      console.log('🎯 CourseDetail - typeof exams:', typeof courseData?.exams);
      if (result.success) {
        setCourse(courseData);
        
        // Kiểm tra và tự động enroll nếu chưa có
        console.log('Checking enrollment for:', studentId, 'course:', courseId);
        const enrollmentResult = await courseService.getStudentProgress(studentId, courseId);
        console.log('Enrollment check result:', enrollmentResult);
        
        if (!enrollmentResult.success && enrollmentResult.message === 'Enrollment not found') {
          // Chưa enroll, tự động enroll
          console.log('Auto-enrolling student:', studentId, 'to course:', courseId);
          const enrollResult = await courseService.enrollCourse(studentId, courseId);
          if (enrollResult.success) {
            toast.success('Đã tự động đăng ký khóa học!', {
              position: "top-right",
              autoClose: 2000,
            });
          }
        } else if (enrollmentResult.success) {
          console.log('Student already enrolled, loading progress...');
        } else {
          console.log('Unexpected enrollment result:', enrollmentResult);
        }
        
        // Load student progress sau khi enroll
        const progressResult = await courseService.getStudentProgress(studentId, courseId);
        console.log('getStudentProgress result:', progressResult);
        if (progressResult.success) {
          console.log('Setting completed lessons:', progressResult.completedLessons);
          setCompletedLessons(new Set(progressResult.completedLessons || []));
          setCompletedExams(new Set(progressResult.completedExams || []));
          
          // Load completed parts for all lessons
          if (courseData?.lessons) {
            console.log('🔄 [CourseDetail] Loading completed parts for all lessons...');
            const initialCompletedParts = new Map();
            
            for (const lesson of courseData.lessons) {
              try {
                const partsResult = await courseService.getCompletedParts(studentId, courseId, lesson.id);
                if (partsResult.success) {
                  initialCompletedParts.set(lesson.id, partsResult.completedParts);
                  console.log(`✅ [CourseDetail] Loaded parts for lesson ${lesson.title}:`, Array.from(partsResult.completedParts));
                }
              } catch (error) {
                console.error(`❌ [CourseDetail] Error loading parts for lesson ${lesson.id}:`, error);
              }
            }
            
            setCompletedParts(initialCompletedParts);
            console.log('🗺️ [CourseDetail] Initial completedParts map:', {
              totalLessons: initialCompletedParts.size,
              lessonIds: Array.from(initialCompletedParts.keys())
            });
            
            // Check and sync lesson completion after loading all data
            setTimeout(async () => {
              // First cleanup any duplicate data
              try {
                const duplicateResult = await courseService.cleanupDuplicatePartCompletions(studentId, courseId);
                if (duplicateResult.cleanedCount > 0) {
                  console.log('🧹 [CourseDetail] Auto-cleaned duplicates:', duplicateResult.cleanedCount);
                  toast.info(`Đã tự động dọn dẹp ${duplicateResult.cleanedCount} dữ liệu trùng lặp`, {
                    position: "top-right",
                    autoClose: 3000,
                  });
                }
              } catch (error) {
                console.error('❌ [CourseDetail] Error auto-cleaning duplicates:', error);
              }
              
              // Then check and sync lesson completion (delay to ensure completedParts is loaded)
              setTimeout(() => {
                try {
                  checkAndSyncLessonCompletion(courseData, progressResult.completedLessons || [], initialCompletedParts);
                } catch (error) {
                  console.error('❌ [CourseDetail] Error calling checkAndSyncLessonCompletion:', error);
                }
              }, 2000);
            }, 1000);
          }
        }

        // Load student rating
        const ratingResult = await courseService.getStudentRating(studentId, courseId);
        if (ratingResult.success) {
          setStudentRating(ratingResult.rating);
        }
      } else {
        toast.error('Không thể tải khóa học');
        navigate('/student');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Có lỗi xảy ra khi tải khóa học');
      navigate('/student');
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId, navigate]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const loadCompletedParts = useCallback(async (lessonId) => {
    if (!studentId || !courseId) return;
    try {
      console.log('🔄 [CourseDetail] loadCompletedParts called:', { lessonId, studentId, courseId });
      
      const result = await courseService.getCompletedParts(studentId, courseId, lessonId);
      console.log('📋 [CourseDetail] getCompletedParts result:', result);
      
      if (result.success) {
        console.log('✅ [CourseDetail] Setting completedParts for lesson:', {
          lessonId,
          completedParts: Array.from(result.completedParts)
        });
        
        // Show notification if auto-cleanup occurred
        if (result.autoCleaned && result.cleanedCount > 0) {
          toast.info(`Đã tự động dọn dẹp ${result.cleanedCount} dữ liệu không nhất quán`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
        
        setCompletedParts(prev => {
          const newMap = new Map(prev);
          newMap.set(lessonId, result.completedParts);
          console.log('🗺️ [CourseDetail] Updated completedParts map:', {
            lessonId,
            newParts: Array.from(result.completedParts),
            allLessons: Array.from(newMap.keys())
          });
          return newMap;
        });
      }
    } catch (error) {
      console.error('❌ [CourseDetail] Error loading completed parts:', error);
    }
  }, [studentId, courseId]);

  const handleStartLesson = (lessonIndex) => {
    console.log('🎯 [CourseDetail] handleStartLesson called:', {
      lessonIndex,
      lessonId: course.lessons[lessonIndex].id,
      lessonTitle: course.lessons[lessonIndex].title,
      completedLessons: Array.from(completedLessons),
      isLessonCompleted: completedLessons.has(course.lessons[lessonIndex].id)
    });
    
    setCurrentLessonIndex(lessonIndex);
    setCurrentView('lesson');
    
    // Load completed parts for this lesson
    const lessonId = course.lessons[lessonIndex].id;
    loadCompletedParts(lessonId);
  };

  // Load completed parts when lesson view is active
  useEffect(() => {
    if (currentView === 'lesson' && course?.lessons?.[currentLessonIndex]) {
      const lessonId = course.lessons[currentLessonIndex].id;
      console.log('🔄 [CourseDetail] Loading completed parts for lesson:', {
        lessonId,
        lessonTitle: course.lessons[currentLessonIndex].title,
        isCompleted: completedLessons.has(lessonId)
      });
      loadCompletedParts(lessonId);
    }
  }, [currentView, currentLessonIndex, course, loadCompletedParts, completedLessons]);

  const handleStartExam = (examIndex) => {
    setCurrentExamIndex(examIndex);
    setCurrentView('exam');
  };

  // Function to reload progress data
  const reloadProgress = useCallback(async () => {
    if (!studentId || !courseId) return;
    
    try {
      console.log('🔄 [CourseDetail] Reloading progress data...');
      const progressResult = await courseService.getStudentProgress(studentId, courseId);
      console.log('📊 [CourseDetail] Progress reload result:', progressResult);
      
      if (progressResult.success) {
        const newCompletedLessons = new Set(progressResult.completedLessons || []);
        const newCompletedExams = new Set(progressResult.completedExams || []);
        
        console.log('✅ [CourseDetail] Updated progress state:', {
          completedLessons: Array.from(newCompletedLessons),
          completedExams: Array.from(newCompletedExams)
        });
        
        setCompletedLessons(newCompletedLessons);
        setCompletedExams(newCompletedExams);
        
        // Reload completed parts for all lessons
        if (course?.lessons) {
          console.log('🔄 [CourseDetail] Reloading completed parts for all lessons...');
          const newCompletedParts = new Map();
          
          for (const lesson of course.lessons) {
            try {
              const partsResult = await courseService.getCompletedParts(studentId, courseId, lesson.id);
              if (partsResult.success) {
                newCompletedParts.set(lesson.id, partsResult.completedParts);
                console.log(`✅ [CourseDetail] Loaded parts for lesson ${lesson.title}:`, Array.from(partsResult.completedParts));
              }
            } catch (error) {
              console.error(`❌ [CourseDetail] Error loading parts for lesson ${lesson.id}:`, error);
            }
          }
          
          setCompletedParts(newCompletedParts);
          console.log('🗺️ [CourseDetail] Updated completedParts map:', {
            totalLessons: newCompletedParts.size,
            lessonIds: Array.from(newCompletedParts.keys())
          });
        }
      }
    } catch (error) {
      console.error('❌ [CourseDetail] Error reloading progress:', error);
    }
  }, [studentId, courseId, course]);

  // Function to check and sync lesson completion based on completed parts
  const checkAndSyncLessonCompletion = useCallback(async (courseDataParam = null, completedLessonsParam = null, completedPartsParam = null) => {
    const courseToUse = courseDataParam || course;
    const completedLessonsToUse = completedLessonsParam ? new Set(completedLessonsParam) : completedLessons;
    const completedPartsToUse = completedPartsParam || completedParts;
    
    if (!courseToUse?.lessons) {
      return;
    }
    let hasChanges = false;
    
    for (const lesson of courseToUse.lessons) {
      const lessonCompletedParts = completedPartsToUse.get(lesson.id) || new Set();
      const isLessonCompleted = completedLessonsToUse.has(lesson.id);
      const allPartsCompleted = lesson.parts?.every((_, index) => lessonCompletedParts.has(index)) || false;
      
      // If all parts are completed but lesson is not marked as completed
      if (allPartsCompleted && !isLessonCompleted) {
        try {
          const result = await courseService.updateProgress(studentId, courseId, lesson.id, 100);
          if (result.success) {
            hasChanges = true;
          }
        } catch (error) {
          console.error(`❌ [CourseDetail] Error auto-completing lesson ${lesson.title}:`, error);
        }
      }
    }
    
    // Reload progress after sync if there were changes
    if (hasChanges) {
      await reloadProgress();
    }
  }, [course, completedParts, completedLessons, studentId, courseId, reloadProgress]);

  const handleLessonComplete = async (lessonId) => {
    try {
      console.log('🎯 [CourseDetail] handleLessonComplete called with lessonId:', lessonId);
      
      // Check if lesson is already completed to avoid duplicate calls
      if (completedLessons.has(lessonId)) {
        console.log('⚠️ [CourseDetail] Lesson already completed, skipping:', lessonId);
        return;
      }
      
      // Always update progress - don't check if already completed
      // because this function is called when all parts are completed
      console.log('📝 [CourseDetail] Updating progress for lesson:', lessonId);
      const result = await courseService.updateProgress(studentId, courseId, lessonId, 100);
      
      if (result.success) {
        console.log('✅ [CourseDetail] Lesson completed successfully:', lessonId);
        
        // Reload progress to ensure UI is in sync
        await reloadProgress();
        
        toast.success('Hoàn thành bài học!', {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        console.error('❌ [CourseDetail] Failed to update progress:', result);
        toast.error('Có lỗi xảy ra khi cập nhật tiến độ');
      }
    } catch (error) {
      console.error('❌ [CourseDetail] Error updating progress:', error);
      toast.error('Có lỗi xảy ra khi cập nhật tiến độ');
    }
  };

  const handleExamComplete = async (examId, score) => {
    try {
      await courseService.updateExamResult(studentId, courseId, examId, score);
      setCompletedExams(prev => new Set([...prev, examId]));
      toast.success('Hoàn thành bài thi!', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error updating exam result:', error);
      toast.error('Có lỗi xảy ra khi cập nhật kết quả bài thi');
    }
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    // Reload progress when returning to overview to ensure UI is in sync
    reloadProgress();
  };

  const getDifficultyText = (difficulty) => {
    const difficultyMap = {
      'easy': 'Dễ',
      'medium': 'Trung bình',
      'hard': 'Khó',
      'beginner': 'Cơ bản',
      'intermediate': 'Trung cấp',
      'advanced': 'Nâng cao'
    };
    return difficultyMap[difficulty] || difficulty;
  };

  const handleRatingSubmit = async (rating, comment) => {
    try {
      const result = await courseService.rateCourse(studentId, courseId, rating, comment);
      if (result.success) {
        setStudentRating({ rating, comment, createdAt: new Date().toISOString() });
        // Reload course để cập nhật average rating
        await loadCourse();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  };

  // Clean up inconsistent data
  const handleCleanupData = async () => {
    try {
      console.log('🧹 [CourseDetail] Starting comprehensive data cleanup...');
      
      // First cleanup duplicates
      const duplicateResult = await courseService.cleanupDuplicatePartCompletions(studentId, courseId);
      console.log('🔄 [CourseDetail] Duplicate cleanup result:', duplicateResult);
      
      // Then cleanup inconsistent data
      const inconsistentResult = await courseService.cleanupInconsistentPartCompletions(studentId, courseId);
      console.log('🔄 [CourseDetail] Inconsistent cleanup result:', inconsistentResult);
      
      const totalCleaned = (duplicateResult.cleanedCount || 0) + (inconsistentResult.cleanedCount || 0);
      
      if (totalCleaned > 0) {
        console.log('✅ [CourseDetail] Cleanup completed:', `Cleaned ${totalCleaned} items`);
        toast.success(`Đã dọn dẹp ${totalCleaned} dữ liệu không nhất quán`, {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Reload course data
        await loadCourse();
      } else {
        toast.info('Không có dữ liệu cần dọn dẹp', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error('❌ [CourseDetail] Error during cleanup:', error);
      toast.error('Có lỗi xảy ra khi dọn dẹp dữ liệu', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };


  const calculateProgress = () => {
    const totalItems = (course?.lessons?.length || 0) + (course?.exams?.length || 0);
    const completedItems = completedLessons.size + completedExams.size;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy khóa học</p>
        </div>
      </div>
    );
  }

  // Render different views
  if (currentView === 'lesson') {
    const currentLesson = course.lessons[currentLessonIndex];
    const isLessonCompleted = completedLessons.has(currentLesson.id);
    const lessonCompletedParts = completedParts.get(currentLesson.id) || new Set();
    
    console.log('🎬 [CourseDetail] Rendering LessonViewer with props:', {
      lessonId: currentLesson.id,
      lessonTitle: currentLesson.title,
      isCompleted: isLessonCompleted,
      completedParts: Array.from(lessonCompletedParts),
      completedLessons: Array.from(completedLessons),
      allCompletedParts: Array.from(completedParts.keys()),
      totalParts: currentLesson.parts?.length || 0,
      allPartsCompleted: currentLesson.parts?.every((_, index) => lessonCompletedParts.has(index)) || false,
      lessonPartsData: currentLesson.parts,
      progressPercentage: currentLesson.parts?.length ? (lessonCompletedParts.size / currentLesson.parts.length) * 100 : 0
    });
    
    return (
      <LessonViewer
        lesson={currentLesson}
        courseId={courseId}
        onComplete={() => handleLessonComplete(currentLesson.id)}
        onNext={() => {
          if (currentLessonIndex < course.lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
          } else {
            handleBackToOverview();
          }
        }}
        onPrev={() => {
          if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
          } else {
            handleBackToOverview();
          }
        }}
        onExit={handleBackToOverview}
        isCompleted={isLessonCompleted}
        completedParts={lessonCompletedParts}
      />
    );
  }

  if (currentView === 'exam') {
    return (
      <ExamViewer
        exam={course.exams[currentExamIndex]}
        onComplete={(score) => handleExamComplete(course.exams[currentExamIndex].id, score)}
        onNext={() => {
          if (currentExamIndex < course.exams.length - 1) {
            setCurrentExamIndex(currentExamIndex + 1);
          } else {
            handleBackToOverview();
          }
        }}
        onPrev={() => {
          if (currentExamIndex > 0) {
            setCurrentExamIndex(currentExamIndex - 1);
          } else {
            handleBackToOverview();
          }
        }}
        onExit={handleBackToOverview}
        timeLimit={course.exams[currentExamIndex].duration}
      />
    );
  }

  // Overview view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">{course.subject} - Lớp {course.grade}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Tiến độ: {calculateProgress()}%
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start gap-4">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                    {course.accessLevel === 'premium' && (
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrolledStudents || 0} học sinh</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{course.averageRating || 5}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bài học ({course.lessons?.length || 0})
                </h3>
              </div>
              
              {course.lessons?.length > 0 ? (
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => {
                    const isLessonCompleted = completedLessons.has(lesson.id);
                    console.log(`📚 [CourseDetail] Lesson ${index}: ${lesson.title} - Completed: ${isLessonCompleted}`);
                    
                    return (
                      <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isLessonCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                              <p className="text-sm text-gray-600">
                                {lesson.parts?.length || 0} phần • {lesson.duration} phút
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleStartLesson(index)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <Play className="w-4 h-4" />
                            {isLessonCompleted ? 'Xem lại' : 'Bắt đầu'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2" />
                  <p>Chưa có bài học nào</p>
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
                    <div key={exam.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {completedExams.has(exam.id) ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{exam.title}</h4>
                            <p className="text-sm text-gray-600">
                              {(exam.questions?.essay?.length || 0) + (exam.questions?.multipleChoice?.length || 0)} câu hỏi • {exam.duration} phút
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleStartExam(index)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <FileText className="w-4 h-4" />
                          {completedExams.has(exam.id) ? 'Làm lại' : 'Bắt đầu thi'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p>Chưa có bài thi nào</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiến độ học tập</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Hoàn thành</span>
                    <span>{completedLessons.size + completedExams.size} / {(course.lessons?.length || 0) + (course.exams?.length || 0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{completedLessons.size}</div>
                    <div className="text-sm text-green-700">Bài học</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{completedExams.size}</div>
                    <div className="text-sm text-blue-700">Bài thi</div>
                  </div>
                </div>

                {/* Rating Section - chỉ hiển thị khi hoàn thành 100% */}
                {calculateProgress() === 100 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-medium text-gray-900">Đánh giá khóa học</h4>
                      {studentRating ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= studentRating.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            Đã đánh giá
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowRatingModal(true)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          Đánh giá ngay
                        </button>
                      )}
                    </div>
                    
                    {studentRating && studentRating.comment && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        "{studentRating.comment}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng thời gian:</span>
                  <span className="font-medium">{course.duration} phút</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số bài học:</span>
                  <span className="font-medium">{course.lessons?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số bài thi:</span>
                  <span className="font-medium">{course.exams?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Độ khó:</span>
                  <span className="font-medium">{getDifficultyText(course.difficulty)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        courseTitle={course?.title}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default CourseDetail;
