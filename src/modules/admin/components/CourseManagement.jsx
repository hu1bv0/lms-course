import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  FileText, 
  Users, 
  Clock, 
  Star,
  Lock,
  Unlock,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  EDUCATION_LEVELS,
  SUBJECTS_BY_LEVEL,
  CONTENT_TYPES,
  ACCESS_LEVELS,
  DIFFICULTY_LEVELS,
  getSubjectsByLevel,
  getEducationLevel,
  getAllGrades
} from '../../../constants/educationConstants';
import courseService from '../../../services/firebase/courseService';
import { toast } from 'react-toastify';
import CreateLessonModal from './CreateLessonModal';
import CreateCourseModal from './CreateCourseModal';
import CreateExamModal from './CreateExamModal';

const CourseManagement = () => {
  const [activeLevel, setActiveLevel] = useState('primary');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, lesson, exam
  const [filterAccess, setFilterAccess] = useState('all'); // all, free, premium
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState(null);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null);
  const [selectedLessonForEdit, setSelectedLessonForEdit] = useState(null);
  
  // Exam states
  const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);
  const [isEditExamModalOpen, setIsEditExamModalOpen] = useState(false);
  const [selectedCourseForExam, setSelectedCourseForExam] = useState(null);
  const [selectedExamForEdit, setSelectedExamForEdit] = useState(null);
  
  // Delete course states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCourseForDelete, setSelectedCourseForDelete] = useState(null);
  

  // Load courses from Firebase
  const loadCourses = useCallback(async () => {
    console.log('🔄 [CourseManagement] Loading courses...');
    setLoading(true);
    
    try {
      const response = await courseService.getAllCourses();
      console.log('📚 [CourseManagement] Courses loaded:', response.courses?.length || 0);
      setCourses(response.courses || []);
    } catch (error) {
      console.error('❌ [CourseManagement] Error loading courses:', error);
      toast.error('Không thể tải danh sách khóa học', {
        position: 'top-right',
        autoClose: 3000,
      });
      setCourses([]);
    } finally {
      setLoading(false);
      console.log('✅ [CourseManagement] Load courses completed');
    }
  }, []);

  // Mock data - fallback khi Firebase lỗi
  const mockCourses = [
    {
      id: '1',
      title: 'Toán cơ bản lớp 1',
      description: 'Học các phép tính cơ bản',
      type: CONTENT_TYPES.LESSON,
      accessLevel: ACCESS_LEVELS.FREE,
      difficulty: DIFFICULTY_LEVELS.EASY.id,
      grade: 'Lớp 1',
      subject: 'Toán học',
      levelId: 'primary',
      duration: 30,
      studentCount: 150,
      rating: 4.5,
      createdAt: '2024-01-15',
      lessons: [
        { id: 'l1', title: 'Số từ 1 đến 10', duration: 15, accessLevel: ACCESS_LEVELS.FREE },
        { id: 'l2', title: 'Phép cộng cơ bản', duration: 20, accessLevel: ACCESS_LEVELS.PREMIUM }
      ],
      exams: [
        { id: 'e1', title: 'Kiểm tra số học', duration: 30, accessLevel: ACCESS_LEVELS.FREE }
      ]
    },
    {
      id: '2',
      title: 'Vật lý lớp 10',
      description: 'Cơ học và nhiệt học',
      type: CONTENT_TYPES.LESSON,
      accessLevel: ACCESS_LEVELS.PREMIUM,
      difficulty: DIFFICULTY_LEVELS.HARD.id,
      grade: 'Lớp 10',
      subject: 'Vật lý',
      levelId: 'high_school',
      duration: 120,
      studentCount: 89,
      rating: 4.8,
      createdAt: '2024-01-10',
      lessons: [
        { id: 'l3', title: 'Chuyển động thẳng đều', duration: 45, accessLevel: ACCESS_LEVELS.PREMIUM },
        { id: 'l4', title: 'Định luật Newton', duration: 60, accessLevel: ACCESS_LEVELS.PREMIUM }
      ],
      exams: [
        { id: 'e2', title: 'Kiểm tra cơ học', duration: 90, accessLevel: ACCESS_LEVELS.PREMIUM }
      ]
    }
  ];

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || course.type === filterType;
    const matchesAccess = filterAccess === 'all' || course.accessLevel === filterAccess;
    const matchesLevel = !selectedGrade || course.grade === selectedGrade;
    const matchesSubject = !selectedSubject || course.subject === selectedSubject;
    
    return matchesSearch && matchesType && matchesAccess && matchesLevel && matchesSubject;
  });


  // Handle create lesson
  const handleCreateLesson = (courseId) => {
    console.log('handleCreateLesson called with courseId:', courseId);
    console.log('Available courses:', courses);
    
    const course = courses.find(c => c.id === courseId);
    console.log('Found course:', course);
    
    if (!course) {
      console.error('❌ [CourseManagement] Course not found for ID:', courseId);
      toast.error('Không tìm thấy khóa học. Vui lòng tải lại trang.');
      return;
    }
    
    if (course) {
      setSelectedCourseForLesson({
        courseId: courseId,
        courseData: {
          educationLevel: course.educationLevel,
          grade: course.grade,
          subject: course.subject
        }
      });
    } else {
      console.warn('Course not found, using courseId only');
      setSelectedCourseForLesson({ courseId: courseId, courseData: null });
    }
    setIsCreateLessonModalOpen(true);
  };

  // Handle save lesson
  const handleSaveLesson = async (lessonData) => {
    console.log('handleSaveLesson called with:', { 
      selectedCourseForLesson, 
      lessonData 
    });
    
    if (!selectedCourseForLesson?.courseId) {
      console.error('No courseId found in selectedCourseForLesson:', selectedCourseForLesson);
      toast.error('Không tìm thấy khóa học', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    
    setLoading(true);
    try {
      console.log('Calling addLessonToCourse with courseId:', selectedCourseForLesson.courseId);
      const response = await courseService.addLessonToCourse(selectedCourseForLesson.courseId, lessonData);
      if (response.success) {
        console.log('✅ [handleSaveLesson] Lesson added, reloading courses...');
        // Reload courses from Firebase
        await loadCourses();
        console.log('✅ [handleSaveLesson] Courses reloaded, closing modal');
        setIsCreateLessonModalOpen(false);
        setSelectedCourseForLesson(null);
        
        toast.success('Thêm bài học thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        throw new Error('Add lesson response indicates failure');
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error(`Không thể lưu bài học: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle create course
  const handleCreateCourse = () => {
    setIsCreateCourseModalOpen(true);
  };

  // Handle save course
  const handleSaveCourse = async (courseData) => {
    console.log('Saving course:', courseData);
    setLoading(true);
    try {
      const response = await courseService.createCourse(courseData);
      console.log('Course created successfully:', response);
      if (response.success) {
        console.log('✅ [handleSaveCourse] Course created, reloading courses...');
        // Reload courses from Firebase
        await loadCourses();
        console.log('✅ [handleSaveCourse] Courses reloaded, closing modal');
        setIsCreateCourseModalOpen(false);
        
        toast.success('Tạo khóa học thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        throw new Error('Create course response indicates failure');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(`Không thể lưu khóa học: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit course
  const handleEditCourse = (courseId) => {
    console.log('handleEditCourse called with courseId:', courseId);
    
    const course = courses.find(c => c.id === courseId);
    console.log('Found course for edit:', course);
    
    if (!course) {
      console.error('❌ [CourseManagement] Course not found for edit ID:', courseId);
      toast.error('Không tìm thấy khóa học. Vui lòng tải lại trang.');
      return;
    }
    
    if (course) {
      setSelectedCourseForEdit(course);
      setIsEditCourseModalOpen(true);
    }
  };

  // Handle update course
  const handleUpdateCourse = async (courseData) => {
    console.log('Updating course:', courseData);
    setLoading(true);
    try {
      const response = await courseService.updateCourse(selectedCourseForEdit.id, courseData);
      console.log('Course updated successfully:', response);
      if (response.success) {
        console.log('✅ [handleUpdateCourse] Course updated, reloading courses...');
        // Reload courses from Firebase
        await loadCourses();
        console.log('✅ [handleUpdateCourse] Courses reloaded, closing modal');
        setIsEditCourseModalOpen(false);
        setSelectedCourseForEdit(null);
        
        toast.success('Cập nhật khóa học thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        throw new Error('Update course response indicates failure');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(`Không thể cập nhật khóa học: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete course
  const handleDeleteCourse = (courseId) => {
    console.log('🗑️ [handleDeleteCourse] Called with courseId:', courseId);
    console.log('🗑️ [handleDeleteCourse] Available courses:', courses.map(c => ({ id: c.id, title: c.title })));
    
    const course = courses.find(c => c.id === courseId);
    console.log('🗑️ [handleDeleteCourse] Found course:', course ? { id: course.id, title: course.title } : 'NOT FOUND');
    
    if (course) {
      setSelectedCourseForDelete(course);
      setIsDeleteConfirmOpen(true);
    } else {
      console.error('❌ [handleDeleteCourse] Course not found for ID:', courseId);
      toast.error('Không tìm thấy khóa học để xóa. Vui lòng tải lại trang.');
    }
  };

  // Confirm delete course
  const confirmDeleteCourse = async () => {
    if (!selectedCourseForDelete) {
      console.warn('No course selected for deletion');
      return;
    }
    
    console.log('🗑️ [CourseManagement] Starting course deletion:', selectedCourseForDelete.id);
    setLoading(true);
    
    try {
      const response = await courseService.deleteCourse(selectedCourseForDelete.id);
      console.log('🗑️ [CourseManagement] Delete response:', response);
      
      if (response && response.success) {
        toast.success('Xóa khóa học thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        
        console.log('🔄 [CourseManagement] Reloading courses...');
        // Reload courses from Firebase
        await loadCourses();
        console.log('✅ [CourseManagement] Courses reloaded successfully');
        
        // Close modal and reset ALL states
        setIsDeleteConfirmOpen(false);
        setSelectedCourseForDelete(null);
        setSelectedCourseForEdit(null);
        setSelectedCourseForLesson(null);
        setSelectedCourseForExam(null);
        
        console.log('🧹 [CourseManagement] All selected states cleared after deletion');
      } else {
        throw new Error('Delete response indicates failure');
      }
    } catch (error) {
      console.error('❌ [CourseManagement] Error deleting course:', error);
      toast.error(`Không thể xóa khóa học: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel delete course
  const cancelDeleteCourse = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedCourseForDelete(null);
  };

  // Handle edit lesson
  const handleEditLesson = (courseId, lessonId) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const lesson = course.lessons?.find(l => l.id === lessonId);
      if (lesson) {
        setSelectedLessonForEdit({
          courseId: courseId,
          lesson: lesson,
          courseData: {
            educationLevel: course.educationLevel,
            grade: course.grade,
            subject: course.subject
          }
        });
        setIsEditLessonModalOpen(true);
      }
    }
  };

  // Handle update lesson
  const handleUpdateLesson = async (lessonData) => {
    if (!selectedLessonForEdit?.courseId || !selectedLessonForEdit?.lesson?.id) return;
    
    setLoading(true);
    try {
      const response = await courseService.updateLesson(
        selectedLessonForEdit.courseId, 
        selectedLessonForEdit.lesson.id, 
        lessonData
      );
      if (response.success) {
        // Reload courses from Firebase
        await loadCourses();
        setIsEditLessonModalOpen(false);
        setSelectedLessonForEdit(null);
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error(`Không thể cập nhật bài học: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle create exam
  const handleCreateExam = (courseId) => {
    console.log('handleCreateExam called with courseId:', courseId);
    
    const course = courses.find(c => c.id === courseId);
    console.log('Found course for exam:', course);
    
    if (!course) {
      console.error('❌ [CourseManagement] Course not found for exam ID:', courseId);
      toast.error('Không tìm thấy khóa học. Vui lòng tải lại trang.');
      return;
    }
    
    if (course) {
      setSelectedCourseForExam({
        courseId: courseId,
        courseData: {
          educationLevel: course.educationLevel,
          grade: course.grade,
          subject: course.subject
        }
      });
    } else {
      setSelectedCourseForExam({ courseId: courseId, courseData: null });
    }
    setIsCreateExamModalOpen(true);
  };

  // Handle save exam
  const handleSaveExam = async (examData) => {
    if (!selectedCourseForExam?.courseId) return;
    
    setLoading(true);
    try {
      const response = await courseService.addExamToCourse(selectedCourseForExam.courseId, examData);
      if (response.success) {
        await loadCourses();
        setIsCreateExamModalOpen(false);
        setSelectedCourseForExam(null);
      }
    } catch (error) {
      console.error('Error saving exam:', error);
      toast.error(`Không thể lưu bài thi: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit exam
  const handleEditExam = (courseId, examId) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const exam = course.exams?.find(e => e.id === examId);
      if (exam) {
        setSelectedExamForEdit({
          courseId: courseId,
          exam: exam,
          courseData: {
            educationLevel: course.educationLevel,
            grade: course.grade,
            subject: course.subject
          }
        });
        setIsEditExamModalOpen(true);
      }
    }
  };

  // Handle update exam
  const handleUpdateExam = async (examData) => {
    if (!selectedExamForEdit?.courseId || !selectedExamForEdit?.exam?.id) return;
    
    setLoading(true);
    try {
      const response = await courseService.updateExam(
        selectedExamForEdit.courseId, 
        selectedExamForEdit.exam.id, 
        examData
      );
      if (response.success) {
        await loadCourses();
        setIsEditExamModalOpen(false);
        setSelectedExamForEdit(null);
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error(`Không thể cập nhật bài thi: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle course expansion
  const toggleCourseExpansion = (courseId) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const level = Object.values(DIFFICULTY_LEVELS).find(d => d.id === difficulty);
    return level?.color || 'gray';
  };

  // Get access level icon
  const getAccessIcon = (accessLevel) => {
    return accessLevel === ACCESS_LEVELS.PREMIUM ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h2>
          <p className="text-gray-600">Quản lý khóa học, bài học và bài thi theo cấp học</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadCourses}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
            title="Tải lại danh sách khóa học"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Tải lại
          </button>
          <button 
            onClick={handleCreateCourse}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm khóa học
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cấp học</label>
            <select
              value={activeLevel}
              onChange={(e) => {
                setActiveLevel(e.target.value);
                setSelectedGrade(null);
                setSelectedSubject(null);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(EDUCATION_LEVELS).map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lớp</label>
            <select
              value={selectedGrade || ''}
              onChange={(e) => {
                setSelectedGrade(e.target.value || null);
                setSelectedSubject(null);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả lớp</option>
              {getEducationLevel(activeLevel)?.grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Môn học</label>
            <select
              value={selectedSubject || ''}
              onChange={(e) => setSelectedSubject(e.target.value || null)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả môn</option>
              {getSubjectsByLevel(activeLevel).map(subject => (
                <option key={subject.id} value={subject.name}>{subject.icon} {subject.name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm khóa học..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại</option>
              <option value={CONTENT_TYPES.LESSON}>Bài học</option>
              <option value={CONTENT_TYPES.EXAM}>Bài thi</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterAccess}
              onChange={(e) => setFilterAccess(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả quyền truy cập</option>
              <option value={ACCESS_LEVELS.FREE}>Miễn phí</option>
              <option value={ACCESS_LEVELS.PREMIUM}>Premium</option>
            </select>
          </div>
        </div>
      </div>


      {/* Courses List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {(() => {
              console.log('📋 [UI] Rendering courses:', {
                totalCourses: courses.length,
                filteredCourses: filteredCourses.length,
                courseIds: filteredCourses.map(c => ({ id: c.id, title: c.title }))
              });
              return filteredCourses;
            })().map((course) => (
              <div key={course.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.accessLevel === ACCESS_LEVELS.PREMIUM 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {course.accessLevel === ACCESS_LEVELS.PREMIUM ? 'Premium' : 'Miễn phí'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full bg-${getDifficultyColor(course.difficulty)}-100 text-${getDifficultyColor(course.difficulty)}-800`}>
                        {Object.values(DIFFICULTY_LEVELS).find(d => d.id === course.difficulty)?.name}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.subject} - {course.grade}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration} phút
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.studentCount} học sinh
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {course.rating}
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="mt-4">
                      <button
                        onClick={() => toggleCourseExpansion(course.id)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        {expandedCourses.has(course.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {course.lessons.length} bài học, {course.exams.length} bài thi
                        </span>
                      </button>

                      {expandedCourses.has(course.id) && (
                        <div className="mt-4 space-y-3">
                          {/* Lessons */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium text-gray-700">Bài học</h4>
                              <button
                                onClick={() => handleCreateLesson(course.id)}
                                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Thêm bài học
                              </button>
                            </div>
                            <div className="space-y-2">
                              {course.lessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium">{lesson.title}</span>
                                    <span className="text-xs text-gray-500">{lesson.duration} phút</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getAccessIcon(lesson.accessLevel)}
                                    <span className={`text-xs ${
                                      lesson.accessLevel === ACCESS_LEVELS.PREMIUM ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                      {lesson.accessLevel === ACCESS_LEVELS.PREMIUM ? 'Premium' : 'Miễn phí'}
                                    </span>
                                    <button 
                                      onClick={() => handleEditLesson(course.id, lesson.id)}
                                      className="text-gray-400 hover:text-gray-600"
                                      title="Sửa bài học"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Exams */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-700">Bài thi</h4>
                              <button
                                onClick={() => handleCreateExam(course.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Thêm bài thi
                              </button>
                            </div>
                            <div className="space-y-2">
                              {course.exams?.map((exam) => (
                                <div key={exam.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-red-500" />
                                    <span className="text-sm font-medium">{exam.title}</span>
                                    <span className="text-xs text-gray-500">{exam.duration} phút</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getAccessIcon(exam.accessLevel)}
                                    <span className={`text-xs ${
                                      exam.accessLevel === ACCESS_LEVELS.PREMIUM ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                      {exam.accessLevel === ACCESS_LEVELS.PREMIUM ? 'Premium' : 'Miễn phí'}
                                    </span>
                                    <button 
                                      onClick={() => handleEditExam(course.id, exam.id)}
                                      className="text-gray-400 hover:text-gray-600"
                                      title="Sửa bài thi"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => handleEditCourse(course.id)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Sửa khóa học"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        console.log('🗑️ [UI] Delete button clicked for course:', {
                          id: course.id,
                          title: course.title,
                          fullCourse: course
                        });
                        handleDeleteCourse(course.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Xóa khóa học"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không có khóa học nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Lesson Modal */}
      <CreateLessonModal
        isOpen={isCreateLessonModalOpen}
        onClose={() => {
          setIsCreateLessonModalOpen(false);
          setSelectedCourseForLesson(null);
        }}
        courseId={selectedCourseForLesson?.courseId}
        courseData={selectedCourseForLesson?.courseData}
        onSave={handleSaveLesson}
      />

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onSave={handleSaveCourse}
      />

      {/* Edit Course Modal */}
      <CreateCourseModal
        isOpen={isEditCourseModalOpen}
        onClose={() => {
          setIsEditCourseModalOpen(false);
          setSelectedCourseForEdit(null);
        }}
        onSave={handleUpdateCourse}
        courseData={selectedCourseForEdit}
        isEdit={true}
      />

      {/* Edit Lesson Modal */}
      <CreateLessonModal
        isOpen={isEditLessonModalOpen}
        onClose={() => {
          setIsEditLessonModalOpen(false);
          setSelectedLessonForEdit(null);
        }}
        courseId={selectedLessonForEdit?.courseId}
        courseData={selectedLessonForEdit?.courseData}
        lessonData={selectedLessonForEdit?.lesson}
        onSave={handleUpdateLesson}
        isEdit={true}
      />

      {/* Create Exam Modal */}
      <CreateExamModal
        isOpen={isCreateExamModalOpen}
        onClose={() => {
          setIsCreateExamModalOpen(false);
          setSelectedCourseForExam(null);
        }}
        courseId={selectedCourseForExam?.courseId}
        courseData={selectedCourseForExam?.courseData}
        onSave={handleSaveExam}
      />

      {/* Edit Exam Modal */}
      <CreateExamModal
        isOpen={isEditExamModalOpen}
        onClose={() => {
          setIsEditExamModalOpen(false);
          setSelectedExamForEdit(null);
        }}
        courseId={selectedExamForEdit?.courseId}
        courseData={selectedExamForEdit?.courseData}
        examData={selectedExamForEdit?.exam}
        onSave={handleUpdateExam}
        isEdit={true}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa khóa học</h3>
                <p className="text-sm text-gray-600">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa khóa học <strong>"{selectedCourseForDelete?.title}"</strong>?
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Tất cả bài học, bài thi và dữ liệu liên quan sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDeleteCourse}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteCourse}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Xóa khóa học
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
