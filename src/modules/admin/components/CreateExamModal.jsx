import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Upload, Download, ArrowUp, ArrowDown, GripVertical,
  FileText, Image, Save, Eye, ChevronDown, ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { CONTENT_TYPES, ACCESS_LEVELS, DIFFICULTY_LEVELS, EDUCATION_LEVELS, getSubjectsByLevel, getEducationLevel } from '../../../constants/educationConstants';
import CKEditorComponent from '../../../components/ui/CKEditorComponent';
import { uploadImageToCloudinary } from '../../../configs/cloudinary.config';

const CreateExamModal = ({ isOpen, onClose, courseId, courseData, examData: initialExamData, onSave, isEdit = false }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    difficulty: DIFFICULTY_LEVELS.MEDIUM.id,
    accessLevel: ACCESS_LEVELS.FREE,
    educationLevel: courseData?.educationLevel || 'primary',
    grade: courseData?.grade || '',
    subject: courseData?.subject || '',
    type: 'mixed', // essay, multiple_choice, mixed
    questions: {
      essay: [],
      multipleChoice: []
    },
    attachments: []
  });

  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  // Load initial data for edit mode
  useEffect(() => {
    if (isEdit && initialExamData) {
      setExamData(initialExamData);
    }
  }, [isEdit, initialExamData]);

  // Update examData when courseData changes
  useEffect(() => {
    if (courseData) {
      setExamData(prev => ({
        ...prev,
        educationLevel: courseData.educationLevel,
        grade: courseData.grade,
        subject: courseData.subject
      }));
    }
  }, [courseData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle question changes
  const handleQuestionChange = (type, questionId, field, value) => {
    setExamData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [type]: prev.questions[type].map(q => 
          q.id === questionId ? { ...q, [field]: value } : q
        )
      }
    }));
  };

  // Add essay question
  const addEssayQuestion = () => {
    const newQuestion = {
      id: `essay_${Date.now()}`,
      question: '',
      points: 10,
      attachments: []
    };
    setExamData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        essay: [...prev.questions.essay, newQuestion]
      }
    }));
  };

  // Add multiple choice question
  const addMultipleChoiceQuestion = () => {
    const newQuestion = {
      id: `mc_${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 5
    };
    setExamData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        multipleChoice: [...prev.questions.multipleChoice, newQuestion]
      }
    }));
  };

  // Remove question
  const removeQuestion = (type, questionId) => {
    setExamData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [type]: prev.questions[type].filter(q => q.id !== questionId)
      }
    }));
  };

  // Move question up
  const moveQuestionUp = (type, questionId) => {
    setExamData(prev => {
      const questions = [...prev.questions[type]];
      const currentIndex = questions.findIndex(q => q.id === questionId);
      
      if (currentIndex > 0) {
        [questions[currentIndex], questions[currentIndex - 1]] = [questions[currentIndex - 1], questions[currentIndex]];
      }
      
      return {
        ...prev,
        questions: {
          ...prev.questions,
          [type]: questions
        }
      };
    });
  };

  // Move question down
  const moveQuestionDown = (type, questionId) => {
    setExamData(prev => {
      const questions = [...prev.questions[type]];
      const currentIndex = questions.findIndex(q => q.id === questionId);
      
      if (currentIndex < questions.length - 1) {
        [questions[currentIndex], questions[currentIndex + 1]] = [questions[currentIndex + 1], questions[currentIndex]];
      }
      
      return {
        ...prev,
        questions: {
          ...prev.questions,
          [type]: questions
        }
      };
    });
  };

  // Toggle question expansion
  const toggleQuestionExpansion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  // Handle option change for multiple choice
  const handleOptionChange = (questionId, optionIndex, value) => {
    setExamData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        multipleChoice: prev.questions.multipleChoice.map(q => 
          q.id === questionId 
            ? { ...q, options: q.options.map((opt, i) => i === optionIndex ? value : opt) }
            : q
        )
      }
    }));
  };

  // Add option to multiple choice question
  const addOption = (questionId) => {
    setExamData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        multipleChoice: prev.questions.multipleChoice.map(q => 
          q.id === questionId 
            ? { ...q, options: [...q.options, ''] }
            : q
        )
      }
    }));
  };

  // Remove option from multiple choice question
  const removeOption = (questionId, optionIndex) => {
    setExamData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        multipleChoice: prev.questions.multipleChoice.map(q => 
          q.id === questionId 
            ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
            : q
        )
      }
    }));
  };

  // Handle file upload for attachments
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  // Add files
  const addFiles = (files) => {
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      
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

    setExamData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  // Remove file
  const removeFile = (index) => {
    setExamData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Upload files to Cloudinary
  const uploadFilesToCloudinary = async () => {
    const uploadedFiles = [];

    for (const file of examData.attachments) {
      if (file instanceof File) {
        // File mới - cần upload
        try {
          const response = await uploadImageToCloudinary(file);
          uploadedFiles.push({
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
        uploadedFiles.push(file);
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
      
      const examToSave = {
        ...examData,
        attachments: uploadedFiles,
        courseId,
        createdAt: new Date().toISOString(),
        id: `exam_${Date.now()}`
      };
      
      onSave(examToSave);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Không thể upload files', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setExamData({
      title: '',
      description: '',
      duration: 60,
      difficulty: DIFFICULTY_LEVELS.MEDIUM.id,
      accessLevel: ACCESS_LEVELS.FREE,
      educationLevel: courseData?.educationLevel || 'primary',
      grade: courseData?.grade || '',
      subject: courseData?.subject || '',
      type: 'mixed',
      questions: {
        essay: [],
        multipleChoice: []
      },
      attachments: []
    });
    setExpandedQuestions(new Set());
    // Clear any previous errors - using toast instead
  };

  // Download Excel template
  const downloadExcelTemplate = () => {
    const templateData = [
      ['Câu hỏi', 'Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D', 'Đáp án đúng', 'Điểm'],
      ['Ví dụ: 2 + 2 = ?', '3', '4', '5', '6', 'B', '5'],
      ['Ví dụ: Thủ đô của Việt Nam là?', 'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Huế', 'A', '5'],
      ['Ví dụ: Câu hỏi chỉ có 2 lựa chọn', 'Đúng', 'Sai', '', '', 'A', '3'],
      ['Ví dụ: Câu hỏi có 3 lựa chọn', 'A', 'B', 'C', '', 'B', '4']
    ];

    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'exam_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Excel upload
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n');
      const questions = [];

      for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(',');
        if (columns.length >= 7) {
          // Lấy các options và loại bỏ những cái trống
          const rawOptions = [columns[1], columns[2], columns[3], columns[4]];
          const validOptions = rawOptions.filter(option => option && option.trim() !== '');
          
          // Chỉ tạo question nếu có ít nhất 2 options
          if (validOptions.length >= 2) {
            // Map correct answer từ A,B,C,D sang index của validOptions
            const correctAnswerLetter = columns[5].toUpperCase();
            const correctAnswerIndex = correctAnswerLetter === 'A' ? 0 : 
                                     correctAnswerLetter === 'B' ? 1 : 
                                     correctAnswerLetter === 'C' ? 2 : 
                                     correctAnswerLetter === 'D' ? 3 : 0;
            
            // Kiểm tra xem correct answer có tồn tại trong validOptions không
            let mappedCorrectAnswer = 0;
            if (correctAnswerIndex < validOptions.length) {
              mappedCorrectAnswer = correctAnswerIndex;
            } else {
              // Nếu correct answer không tồn tại, chọn option đầu tiên
              console.warn(`Correct answer ${correctAnswerLetter} không tồn tại trong options hợp lệ. Chọn option đầu tiên.`);
            }

            const question = {
              id: `mc_upload_${Date.now()}_${i}`,
              question: columns[0],
              options: validOptions,
              correctAnswer: mappedCorrectAnswer,
              points: parseInt(columns[6]) || 5
            };
            questions.push(question);
          } else {
            console.warn(`Câu hỏi ${i}: Cần ít nhất 2 options hợp lệ. Bỏ qua câu này.`);
          }
        }
      }

      if (questions.length > 0) {
        setExamData(prev => ({
          ...prev,
          questions: {
            ...prev.questions,
            multipleChoice: [...prev.questions.multipleChoice, ...questions]
          }
        }));
        toast.success(`Đã import thành công ${questions.length} câu hỏi!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error('Không có câu hỏi hợp lệ nào được import. Vui lòng kiểm tra lại file Excel.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Sửa bài thi' : 'Tạo bài thi mới'}
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
              { id: 'questions', label: 'Câu hỏi', icon: FileText },
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên bài thi *
                  </label>
                  <input
                    type="text"
                    value={examData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên bài thi..."
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả bài thi
                  </label>
                  <textarea
                    value={examData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả ngắn gọn về bài thi..."
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng (phút) *
                  </label>
                  <input
                    type="number"
                    value={examData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ khó *
                  </label>
                  <select
                    value={examData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.values(DIFFICULTY_LEVELS).map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>

                {/* Access Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quyền truy cập *
                  </label>
                  <select
                    value={examData.accessLevel}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={ACCESS_LEVELS.FREE}>Miễn phí</option>
                    <option value={ACCESS_LEVELS.PREMIUM}>Premium</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại bài thi *
                  </label>
                  <select
                    value={examData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="essay">Tự luận</option>
                    <option value="multiple_choice">Trắc nghiệm</option>
                    <option value="mixed">Hỗn hợp</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Questions */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Question Type Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={addEssayQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm câu tự luận
                </button>
                <button
                  onClick={addMultipleChoiceQuestion}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm câu trắc nghiệm
                </button>
                <button
                  onClick={downloadExcelTemplate}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tải mẫu Excel
                </button>
                <label className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Excel
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Essay Questions */}
              {examData.questions.essay.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Câu tự luận</h4>
                  <div className="space-y-4">
                    {examData.questions.essay.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {/* Move up button */}
                            <button
                              onClick={() => moveQuestionUp('essay', question.id)}
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
                              onClick={() => moveQuestionDown('essay', question.id)}
                              disabled={index === examData.questions.essay.length - 1}
                              className={`p-2 rounded ${
                                index === examData.questions.essay.length - 1 
                                  ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                              }`}
                              title={index === examData.questions.essay.length - 1 ? 'Không thể di chuyển xuống' : 'Di chuyển xuống'}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            
                            {/* Drag handle */}
                            <div className="text-gray-400 cursor-move p-1">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            
                            {/* Expand/Collapse button */}
                            <button
                              onClick={() => toggleQuestionExpansion(question.id)}
                              className="text-gray-500 hover:text-gray-700 p-1"
                              title={expandedQuestions.has(question.id) ? 'Thu gọn' : 'Mở rộng'}
                            >
                              {expandedQuestions.has(question.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            
                            <span className="text-sm font-medium text-gray-600">Câu {index + 1}</span>
                          </div>
                          
                          {/* Delete button */}
                          <button
                            onClick={() => removeQuestion('essay', question.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa câu hỏi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {expandedQuestions.has(question.id) && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Câu hỏi *
                              </label>
                              <CKEditorComponent
                                value={question.question}
                                onChange={(content) => handleQuestionChange('essay', question.id, 'question', content)}
                                placeholder="Nhập câu hỏi..."
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Điểm *
                                </label>
                                <input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => handleQuestionChange('essay', question.id, 'points', parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  min="1"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multiple Choice Questions */}
              {examData.questions.multipleChoice.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Câu trắc nghiệm</h4>
                  <div className="space-y-4">
                    {examData.questions.multipleChoice.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {/* Move up button */}
                            <button
                              onClick={() => moveQuestionUp('multipleChoice', question.id)}
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
                              onClick={() => moveQuestionDown('multipleChoice', question.id)}
                              disabled={index === examData.questions.multipleChoice.length - 1}
                              className={`p-2 rounded ${
                                index === examData.questions.multipleChoice.length - 1 
                                  ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                              }`}
                              title={index === examData.questions.multipleChoice.length - 1 ? 'Không thể di chuyển xuống' : 'Di chuyển xuống'}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            
                            {/* Drag handle */}
                            <div className="text-gray-400 cursor-move p-1">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            
                            {/* Expand/Collapse button */}
                            <button
                              onClick={() => toggleQuestionExpansion(question.id)}
                              className="text-gray-500 hover:text-gray-700 p-1"
                              title={expandedQuestions.has(question.id) ? 'Thu gọn' : 'Mở rộng'}
                            >
                              {expandedQuestions.has(question.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            
                            <span className="text-sm font-medium text-gray-600">Câu {index + 1}</span>
                          </div>
                          
                          {/* Delete button */}
                          <button
                            onClick={() => removeQuestion('multipleChoice', question.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa câu hỏi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {expandedQuestions.has(question.id) && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Câu hỏi *
                              </label>
                              <CKEditorComponent
                                value={question.question}
                                onChange={(content) => handleQuestionChange('multipleChoice', question.id, 'question', content)}
                                placeholder="Nhập câu hỏi..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Các lựa chọn *
                              </label>
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600 w-6">
                                      {String.fromCharCode(65 + optionIndex)}.
                                    </span>
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder={`Lựa chọn ${String.fromCharCode(65 + optionIndex)}`}
                                    />
                                    <button
                                      onClick={() => removeOption(question.id, optionIndex)}
                                      className="text-red-600 hover:text-red-800 p-1"
                                      disabled={question.options.length <= 2}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                {question.options.length < 6 && (
                                  <button
                                    onClick={() => addOption(question.id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Thêm lựa chọn
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Đáp án đúng *
                                </label>
                                <select
                                  value={question.correctAnswer}
                                  onChange={(e) => handleQuestionChange('multipleChoice', question.id, 'correctAnswer', parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {question.options.map((_, optionIndex) => (
                                    <option key={optionIndex} value={optionIndex}>
                                      {String.fromCharCode(65 + optionIndex)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Điểm *
                                </label>
                                <input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => handleQuestionChange('multipleChoice', question.id, 'points', parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  min="1"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Attachments */}
          {activeTab === 'attachments' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tài liệu đính kèm
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Kéo thả file vào đây hoặc click để chọn</p>
                  <p className="text-sm text-gray-500 mb-4">Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    Chọn file
                  </label>
                </div>
              </div>

              {/* File List */}
              {examData.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Danh sách file</h4>
                  <div className="space-y-2">
                    {examData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Làm mới
          </button>
          <button
            onClick={handleSave}
            disabled={!examData.title.trim() || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật bài thi' : 'Tạo bài thi')}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateExamModal;
