import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Youtube, 
  FileText, 
  Image, 
  Upload,
  Save,
  Eye,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import { toast } from 'react-toastify';
import { CONTENT_TYPES, ACCESS_LEVELS, DIFFICULTY_LEVELS, EDUCATION_LEVELS, getSubjectsByLevel, getEducationLevel } from '../../../constants/educationConstants';
import CKEditorComponent from '../../../components/ui/CKEditorComponent';
import { uploadImageToCloudinary } from '../../../configs/cloudinary.config';

const CreateLessonModal = ({ isOpen, onClose, courseId, courseData, lessonData: initialLessonData, onSave, isEdit = false }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    duration: 30,
    difficulty: DIFFICULTY_LEVELS.EASY.id,
    accessLevel: ACCESS_LEVELS.FREE,
    educationLevel: courseData?.educationLevel || 'primary',
    grade: courseData?.grade || '',
    subject: courseData?.subject || '',
    parts: [
      {
        id: 1,
        title: 'Phần 1',
        content: '',
        type: 'text'
      }
    ],
    attachments: {
      youtubeUrls: [],
      files: [],
      images: []
    }
  });

  const [expandedParts, setExpandedParts] = useState(new Set([1]));

  // Update lessonData when courseData changes
  useEffect(() => {
    if (courseData) {
      setLessonData(prev => ({
        ...prev,
        educationLevel: courseData.educationLevel,
        grade: courseData.grade,
        subject: courseData.subject
      }));
    }
  }, [courseData]);

  // Load initial data for edit mode
  useEffect(() => {
    if (isEdit && initialLessonData) {
      setLessonData(initialLessonData);
    }
  }, [isEdit, initialLessonData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setLessonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle part changes
  const handlePartChange = (partId, field, value) => {
    setLessonData(prev => ({
      ...prev,
      parts: prev.parts.map(part => 
        part.id === partId ? { ...part, [field]: value } : part
      )
    }));
  };

  // Add new part
  const addPart = () => {
    const newPartId = Math.max(...lessonData.parts.map(p => p.id)) + 1;
    setLessonData(prev => ({
      ...prev,
      parts: [
        ...prev.parts,
        {
          id: newPartId,
          title: `Phần ${prev.parts.length + 1}`,
          content: '',
          type: 'text',
          videoUrl: '' // Thêm videoUrl cho mỗi phần
        }
      ]
    }));
    setExpandedParts(prev => new Set([...prev, newPartId]));
  };

  // Remove part
  const removePart = (partId) => {
    if (lessonData.parts.length > 1) {
      setLessonData(prev => ({
        ...prev,
        parts: prev.parts.filter(part => part.id !== partId)
      }));
      setExpandedParts(prev => {
        const newSet = new Set(prev);
        newSet.delete(partId);
        return newSet;
      });
    }
  };

  // Move part up
  const movePartUp = (partId) => {
    setLessonData(prev => {
      const parts = [...prev.parts];
      const currentIndex = parts.findIndex(part => part.id === partId);
      
      if (currentIndex > 0) {
        // Swap with previous part
        [parts[currentIndex], parts[currentIndex - 1]] = [parts[currentIndex - 1], parts[currentIndex]];
      }
      
      return {
        ...prev,
        parts: parts
      };
    });
  };

  // Move part down
  const movePartDown = (partId) => {
    setLessonData(prev => {
      const parts = [...prev.parts];
      const currentIndex = parts.findIndex(part => part.id === partId);
      
      if (currentIndex < parts.length - 1) {
        // Swap with next part
        [parts[currentIndex], parts[currentIndex + 1]] = [parts[currentIndex + 1], parts[currentIndex]];
      }
      
      return {
        ...prev,
        parts: parts
      };
    });
  };

  // Toggle part expansion
  const togglePartExpansion = (partId) => {
    setExpandedParts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partId)) {
        newSet.delete(partId);
      } else {
        newSet.add(partId);
      }
      return newSet;
    });
  };

  // Handle YouTube URLs
  const addYouTubeUrl = (url) => {
    if (url.trim() && !lessonData.attachments.youtubeUrls.includes(url.trim())) {
      setLessonData(prev => ({
        ...prev,
        attachments: {
          ...prev.attachments,
          youtubeUrls: [...prev.attachments.youtubeUrls, url.trim()]
        }
      }));
    }
  };

  const removeYouTubeUrl = (index) => {
    setLessonData(prev => ({
      ...prev,
      attachments: {
        ...prev.attachments,
        youtubeUrls: prev.attachments.youtubeUrls.filter((_, i) => i !== index)
      }
    }));
  };

  // Extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    addFiles(files);
  };

  // Add files to attachments
  const addFiles = (files) => {
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (file.size > maxSize) {
        toast.error(`File ${file.name} quá lớn (tối đa 10MB)`, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} không được hỗ trợ`, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
      
      return true;
    });

    // Thêm files mới vào danh sách (giữ nguyên files cũ)
    setLessonData(prev => ({
      ...prev,
      attachments: {
        ...prev.attachments,
        files: [...prev.attachments.files, ...validFiles]
      }
    }));
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  // Remove file
  const removeFile = (index) => {
    setLessonData(prev => ({
      ...prev,
      attachments: {
        ...prev.attachments,
        files: prev.attachments.files.filter((_, i) => i !== index)
      }
    }));
  };

  // Upload files to Cloudinary
  const uploadFilesToCloudinary = async () => {
    const uploadedFiles = {
      youtubeUrls: lessonData.attachments.youtubeUrls || [],
      files: [],
      images: []
    };

    // Upload regular files - chỉ upload file mới (File objects)
    for (const file of lessonData.attachments.files) {
      if (file instanceof File) {
        // File mới - cần upload
        try {
          const response = await uploadImageToCloudinary(file);
          uploadedFiles.files.push({
            name: file.name,
            url: response.url,
            type: file.type,
            size: file.size
          });
        } catch (error) {
          console.error('Error uploading file:', file.name, error);
          throw new Error(`Không thể upload file: ${file.name}`);
        }
      } else {
        // File cũ - giữ nguyên (đã có URL)
        uploadedFiles.files.push(file);
      }
    }

    // Upload images - chỉ upload image mới (File objects)
    for (const file of lessonData.attachments.images) {
      if (file instanceof File) {
        // Image mới - cần upload
        try {
          const response = await uploadImageToCloudinary(file);
          uploadedFiles.images.push({
            name: file.name,
            url: response.url,
            type: file.type,
            size: file.size
          });
        } catch (error) {
          console.error('Error uploading image:', file.name, error);
          throw new Error(`Không thể upload hình ảnh: ${file.name}`);
        }
      } else {
        // Image cũ - giữ nguyên (đã có URL)
        uploadedFiles.images.push(file);
      }
    }

    return uploadedFiles;
  };

  // Handle save
  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Upload files to Cloudinary first
      const uploadedFiles = await uploadFilesToCloudinary();
      
      const lessonToSave = {
        ...lessonData,
        attachments: {
          ...lessonData.attachments,
          files: uploadedFiles.files,
          images: uploadedFiles.images
        },
        courseId,
        createdAt: new Date().toISOString(),
        id: `lesson_${Date.now()}`
      };
      
      onSave(lessonToSave);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Không thể upload files', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setLessonData({
      title: '',
      description: '',
      duration: 30,
      difficulty: DIFFICULTY_LEVELS.EASY.id,
      accessLevel: ACCESS_LEVELS.FREE,
      educationLevel: courseData?.educationLevel || 'primary',
      grade: courseData?.grade || '',
      subject: courseData?.subject || '',
      parts: [
        {
          id: 1,
          title: 'Phần 1',
          content: '',
          type: 'text'
        }
      ],
      attachments: {
        youtubeUrls: [],
        files: [],
        images: []
      }
    });
    setExpandedParts(new Set([1]));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 mt-0">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Sửa bài học' : 'Tạo bài học mới'}
            </h3>
            {courseData && (
              <p className="text-sm text-gray-600 mt-1">
                Cho khóa học: <span className="font-medium">{courseData.subject} - Lớp {courseData.grade}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>


        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Thông tin cơ bản', icon: FileText },
              { id: 'content', label: 'Nội dung bài học', icon: FileText },
              { id: 'attachments', label: 'Tài liệu đính kèm', icon: Upload }
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
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Education Level, Grade, Subject */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cấp học *
                  </label>
                  <select
                    value={lessonData.educationLevel}
                    onChange={(e) => {
                      handleInputChange('educationLevel', e.target.value);
                      handleInputChange('grade', '');
                      handleInputChange('subject', '');
                    }}
                    disabled={!!courseData}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      courseData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
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
                    value={lessonData.grade}
                    onChange={(e) => {
                      handleInputChange('grade', e.target.value);
                      handleInputChange('subject', '');
                    }}
                    disabled={!!courseData}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      courseData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Chọn lớp</option>
                    {getEducationLevel(lessonData.educationLevel)?.grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Môn học *
                  </label>
                  <select
                    value={lessonData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    disabled={!!courseData}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      courseData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Chọn môn</option>
                    {getSubjectsByLevel(lessonData.educationLevel).map(subject => (
                      <option key={subject.id} value={subject.name}>
                        {subject.icon} {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề bài học *
                  </label>
                  <input
                    type="text"
                    value={lessonData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Nhập tiêu đề bài học..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng (phút) *
                  </label>
                  <input
                    type="number"
                    value={lessonData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả bài học
                </label>
                <textarea
                  value={lessonData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả ngắn về nội dung bài học..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ khó
                  </label>
                  <select
                    value={lessonData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(DIFFICULTY_LEVELS).map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quyền truy cập
                  </label>
                  <select
                    value={lessonData.accessLevel}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={ACCESS_LEVELS.FREE}>Miễn phí</option>
                    <option value={ACCESS_LEVELS.PREMIUM}>Premium</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Content */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Nội dung bài học</h4>
                <button
                  onClick={addPart}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm phần
                </button>
              </div>

              {lessonData.parts.map((part, index) => (
                <div key={part.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Move up button */}
                      <button
                        onClick={() => movePartUp(part.id)}
                        disabled={index === 0}
                        className={`p-2 rounded ${
                          index === 0 
                            ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                        }`}
                        title={index === 0 ? 'Không thể di chuyển lên' : 'Di chuyển lên'}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      
                      {/* Move down button */}
                      <button
                        onClick={() => movePartDown(part.id)}
                        disabled={index === lessonData.parts.length - 1}
                        className={`p-2 rounded ${
                          index === lessonData.parts.length - 1 
                            ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                        }`}
                        title={index === lessonData.parts.length - 1 ? 'Không thể di chuyển xuống' : 'Di chuyển xuống'}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      
                      {/* Drag handle */}
                      <div className="text-gray-400 cursor-move p-1">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      
                      {/* Expand/Collapse button */}
                      <button
                        onClick={() => togglePartExpansion(part.id)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                        title={expandedParts.has(part.id) ? 'Thu gọn' : 'Mở rộng'}
                      >
                        {expandedParts.has(part.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      {/* Part title input */}
                      <input
                        type="text"
                        value={part.title}
                        onChange={(e) => handlePartChange(part.id, 'title', e.target.value)}
                        className="text-lg font-medium border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                      />
                    </div>
                    
                    {/* Delete button */}
                    {lessonData.parts.length > 1 && (
                      <button
                        onClick={() => removePart(part.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa phần"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {expandedParts.has(part.id) && (
                    <div className="space-y-4">
                      {/* Video URL cho phần này */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Youtube className="w-4 h-4 inline mr-2" />
                          Link YouTube (tùy chọn)
                        </label>
                        <input
                          type="url"
                          value={part.videoUrl || ''}
                          onChange={(e) => handlePartChange(part.id, 'videoUrl', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... (để trống nếu không có video)"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {part.videoUrl && (
                          <div className="mt-2 text-sm text-green-600">
                            ✓ Video đã được thêm cho phần này
                          </div>
                        )}
                      </div>
                      
                      {/* Nội dung text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nội dung phần {part.id}
                        </label>
                        <CKEditorComponent
                          value={part.content}
                          onChange={(content) => handlePartChange(part.id, 'content', content)}
                          placeholder="Nhập nội dung chi tiết cho phần này..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Attachments */}
          {activeTab === 'attachments' && (
            <div className="space-y-6">
              {/* YouTube URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Youtube className="w-4 h-4 inline mr-2" />
                  Link YouTube (có thể thêm nhiều)
                </label>
                
                {/* Add URL Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addYouTubeUrl(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input && input.value.trim()) {
                        addYouTubeUrl(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm
                  </button>
                </div>

                {/* YouTube URLs List */}
                {lessonData.attachments.youtubeUrls.length > 0 && (
                  <div className="space-y-3">
                    {lessonData.attachments.youtubeUrls.map((url, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Video {index + 1}
                            </p>
                            <p className="text-sm text-gray-600 break-all">{url}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeYouTubeUrl(index)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Video Preview */}
                        {getYouTubeVideoId(url) && (
                          <div className="bg-gray-100 rounded-lg p-3">
                            <h6 className="font-medium text-gray-900 mb-2">Preview:</h6>
                            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Youtube className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">YouTube Video</p>
                                <p className="text-xs text-gray-500">ID: {getYouTubeVideoId(url)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Tài liệu đính kèm
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Kéo thả file vào đây hoặc click để chọn
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, GIF (tối đa 10MB)
                    </span>
                  </label>
                </div>

                {/* File List */}
                {lessonData.attachments.files.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h6 className="text-sm font-medium text-gray-700">
                      Đã tải lên {lessonData.attachments.files.length} file
                    </h6>
                    {lessonData.attachments.files.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {/* File Icon */}
                            <div className="flex-shrink-0">
                              {file.type.startsWith('image/') ? (
                                <Image className="w-5 h-5 text-green-500" />
                              ) : file.type === 'application/pdf' ? (
                                <FileText className="w-5 h-5 text-red-500" />
                              ) : file.type.includes('word') ? (
                                <FileText className="w-5 h-5 text-blue-500" />
                              ) : file.type.includes('powerpoint') ? (
                                <FileText className="w-5 h-5 text-orange-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                            
                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                {file instanceof File ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Mới
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Đã upload
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                            title="Xóa file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Image Preview */}
                        {file.type.startsWith('image/') && (
                          <div className="mt-3">
                            <img
                              src={file instanceof File ? URL.createObjectURL(file) : file.url}
                              alt={file.name}
                              className="max-w-full h-32 object-cover rounded border"
                              onLoad={(e) => {
                                if (file instanceof File) {
                                  URL.revokeObjectURL(e.target.src);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Làm mới
          </button>
          <button
            onClick={handleSave}
            disabled={!lessonData.title.trim() || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật bài học' : 'Lưu bài học')}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateLessonModal;
