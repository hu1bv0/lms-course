import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Save,
  Eye,
  ChevronDown,
  ChevronRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  EDUCATION_LEVELS,
  SUBJECTS_BY_LEVEL,
  CONTENT_TYPES,
  ACCESS_LEVELS,
  DIFFICULTY_LEVELS,
  getSubjectsByLevel,
  getEducationLevel
} from '../../../constants/educationConstants';
import { uploadImageToCloudinary } from '../../../configs/cloudinary.config';

const CreateCourseModal = ({ isOpen, onClose, onSave, courseData: initialData, isEdit = false }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    educationLevel: 'primary',
    grade: '',
    subject: '',
    accessLevel: ACCESS_LEVELS.FREE,
    difficulty: DIFFICULTY_LEVELS.EASY.id,
    duration: 30, // minutes
    price: 0,
    thumbnail: '',
    tags: [],
    objectives: [],
    requirements: []
  });

  const [expandedSections, setExpandedSections] = useState(new Set(['basic']));
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  // Load initial data for edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setCourseData(initialData);
      if (initialData.thumbnail) {
        setThumbnailPreview(initialData.thumbnail);
      }
    }
  }, [isEdit, initialData]);

  // Handle thumbnail file selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh hợp lệ!', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 10MB!', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload thumbnail to Cloudinary
  const uploadThumbnail = async () => {
    if (!thumbnailFile) {
      return courseData.thumbnail; // Return existing thumbnail if no new file
    }

    setIsUploadingThumbnail(true);
    try {
      const result = await uploadImageToCloudinary(thumbnailFile);
      if (result.success) {
        return result.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Không thể upload ảnh đại diện!', {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  // Handle array fields
  const handleArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Handle save
  const handleSave = async () => {
    // Validate required fields
    if (!courseData.title || !courseData.grade || !courseData.subject) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Upload thumbnail first
      const thumbnailUrl = await uploadThumbnail();
      
      // Generate course ID
      const courseId = `course_${Date.now()}`;
      
      const courseToSave = {
        ...courseData,
        thumbnail: thumbnailUrl,
        id: courseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessons: [],
        exams: [],
        enrolledStudents: 0,
        rating: 0,
        status: 'active'
      };

      onSave(courseToSave);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      // Error message already shown in uploadThumbnail
    }
  };

  // Reset form
  const resetForm = () => {
    setCourseData({
      title: '',
      description: '',
      educationLevel: 'primary',
      grade: '',
      subject: '',
      accessLevel: ACCESS_LEVELS.FREE,
      difficulty: DIFFICULTY_LEVELS.EASY.id,
      duration: 30,
      price: 0,
      thumbnail: '',
      tags: [],
      objectives: [],
      requirements: []
    });
    setExpandedSections(new Set(['basic']));
    setActiveTab('basic');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setIsUploadingThumbnail(false);
  };

  // Close modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 mt-0">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Sửa khóa học' : 'Tạo khóa học mới'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: 'Thông tin cơ bản', icon: Eye },
              { id: 'content', label: 'Nội dung khóa học', icon: Plus },
              { id: 'settings', label: 'Cài đặt', icon: Save }
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab 1: Basic Info */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Education Level, Grade, Subject */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cấp học *
                  </label>
                  <select
                    value={courseData.educationLevel}
                    onChange={(e) => {
                      handleInputChange('educationLevel', e.target.value);
                      handleInputChange('grade', '');
                      handleInputChange('subject', '');
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(EDUCATION_LEVELS).map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lớp *
                  </label>
                  <select
                    value={courseData.grade}
                    onChange={(e) => {
                      handleInputChange('grade', e.target.value);
                      handleInputChange('subject', '');
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn lớp</option>
                    {getEducationLevel(courseData.educationLevel)?.grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Môn học *
                  </label>
                  <select
                    value={courseData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn môn</option>
                    {getSubjectsByLevel(courseData.educationLevel).map(subject => (
                      <option key={subject.id} value={subject.name}>
                        {subject.icon} {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khóa học *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tên khóa học..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả khóa học
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả ngắn gọn về khóa học..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Duration and Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    value={courseData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ khó
                  </label>
                  <select
                    value={courseData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(DIFFICULTY_LEVELS).map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Content */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Objectives */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mục tiêu khóa học
                  </label>
                  <button
                    onClick={() => addArrayItem('objectives')}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm mục tiêu
                  </button>
                </div>
                <div className="space-y-2">
                  {courseData.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                        placeholder={`Mục tiêu ${index + 1}...`}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeArrayItem('objectives', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Yêu cầu tiên quyết
                  </label>
                  <button
                    onClick={() => addArrayItem('requirements')}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm yêu cầu
                  </button>
                </div>
                <div className="space-y-2">
                  {courseData.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        placeholder={`Yêu cầu ${index + 1}...`}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeArrayItem('requirements', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <button
                    onClick={() => addArrayItem('tags')}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm tag
                  </button>
                </div>
                <div className="space-y-2">
                  {courseData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                        placeholder={`Tag ${index + 1}...`}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeArrayItem('tags', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Access Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức truy cập
                </label>
                <div className="flex space-x-4">
                  {Object.values(ACCESS_LEVELS).map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="accessLevel"
                        value={level}
                        checked={courseData.accessLevel === level}
                        onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {level === ACCESS_LEVELS.FREE ? 'Miễn phí' : 'Trả phí'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              {courseData.accessLevel === ACCESS_LEVELS.PREMIUM && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá khóa học (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>
                
                {/* File Input */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    {thumbnailPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-sm">Chọn ảnh đại diện</span>
                        <span className="text-xs text-gray-400">PNG, JPG, GIF (tối đa 10MB)</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Upload Status */}
                {isUploadingThumbnail && (
                  <div className="mt-2 flex items-center text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Đang upload ảnh...
                  </div>
                )}

                {/* Remove Button */}
                {thumbnailPreview && !isUploadingThumbnail && (
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview('');
                      handleInputChange('thumbnail', '');
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isUploadingThumbnail}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isUploadingThumbnail ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang upload...
              </>
            ) : (
              isEdit ? 'Cập nhật khóa học' : 'Tạo khóa học'
            )}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateCourseModal;
