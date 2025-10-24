import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Play, 
  FileText, 
  Image, 
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Circle,
  X,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import courseService from '../../../services/firebase/courseService';

const LessonViewer = ({ lesson, courseId, onComplete, onNext, onPrev, onExit, isCompleted = false, completedParts: initialCompletedParts = new Set() }) => {
  const { user } = useSelector(state => state.auth);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'attachments'
  const [completedParts, setCompletedParts] = useState(initialCompletedParts); // Track completed parts

  const currentPart = lesson?.parts?.[currentPartIndex];
  
  // Debug log for UI state
  console.log('🎬 [LessonViewer] Render debug:', {
    lessonId: lesson?.id,
    lessonTitle: lesson?.title,
    completedParts: Array.from(completedParts),
    isCompleted,
    currentPartIndex,
    totalParts: lesson?.parts?.length || 0,
    partsData: lesson?.parts,
    progressPercentage: lesson?.parts?.length ? (completedParts.size / lesson.parts.length) * 100 : 0
  });

  // Sync completed parts with parent when they change
  useEffect(() => {
    console.log('🔄 [LessonViewer] Syncing with parent props:', {
      initialCompletedParts: Array.from(initialCompletedParts),
      currentCompletedParts: Array.from(completedParts),
      isCompleted,
      lessonId: lesson?.id
    });
    
    // Always sync with parent data to ensure consistency
    setCompletedParts(initialCompletedParts);
  }, [initialCompletedParts, isCompleted, lesson?.id]);

  // Mark part as completed
  const markPartCompleted = async (partIndex) => {
    console.log('🎯 [LessonViewer] markPartCompleted called:', {
      partIndex,
      currentCompletedParts: Array.from(completedParts),
      isCompleted,
      lessonId: lesson?.id
    });
    
    // Nếu lesson đã hoàn thành, không cho phép mark lại
    if (isCompleted) {
      console.log('⚠️ [LessonViewer] Lesson already completed, skipping');
      toast.info('Bài học đã hoàn thành!', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    
    // Nếu phần này đã hoàn thành, không cho phép mark lại
    if (completedParts.has(partIndex)) {
      console.log('⚠️ [LessonViewer] Part already completed, skipping');
      toast.info('Phần này đã hoàn thành!', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    
    try {
      console.log('Marking part as completed:', partIndex);
      
      // Save part completion to database
      if (user?.uid && courseId && lesson?.id) {
        const result = await courseService.updatePartCompletion(user.uid, courseId, lesson.id, partIndex);
        if (!result.success) {
          console.error('Failed to save part completion:', result.error);
          // Continue with UI update even if database save fails
        } else {
          console.log('Part completion saved successfully');
        }
      }
      
      // Mark phần này là completed
      setCompletedParts(prev => {
        const newSet = new Set([...prev, partIndex]);
        console.log('📝 [LessonViewer] Updating completedParts:', {
          previous: Array.from(prev),
          new: Array.from(newSet),
          partIndex
        });
        
        // Check if all parts are completed with the new set
        const allPartsCompleted = lesson.parts.every((_, index) => newSet.has(index));
        console.log('🔍 [LessonViewer] Checking completion:', {
          allPartsCompleted,
          totalParts: lesson.parts.length,
          completedParts: Array.from(newSet)
        });
        
        if (allPartsCompleted && !isCompleted) {
          // All parts completed, now complete the entire lesson
          console.log('🎉 [LessonViewer] All parts completed, calling onComplete...');
          setTimeout(async () => {
            if (onComplete && !isCompleted) {
              console.log('📞 [LessonViewer] Calling onComplete callback');
              await onComplete();
              toast.success('Chúc mừng! Bạn đã hoàn thành toàn bộ bài học!', {
                position: "top-right",
                autoClose: 3000,
              });
            }
          }, 1000);
        }
        
        return newSet;
      });
      
      toast.success('Hoàn thành phần này!', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error completing part:', error);
      toast.error('Có lỗi xảy ra khi hoàn thành phần này', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Toggle section expansion
  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  // Navigation
  const goToPart = (index) => {
    setCurrentPartIndex(index);
  };

  const nextPart = () => {
    if (currentPartIndex < lesson.parts.length - 1) {
      goToPart(currentPartIndex + 1);
    }
  };

  const prevPart = () => {
    if (currentPartIndex > 0) {
      goToPart(currentPartIndex - 1);
    }
  };

  // Handle YouTube video
  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không có bài học nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Lesson Parts */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {lesson.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration} phút</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{lesson.parts?.length || 0} phần</span>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Tiến độ hoàn thành</span>
                <span className="text-green-600 font-medium">
                  {completedParts.size}/{lesson.parts?.length || 0} phần
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${lesson.parts?.length ? (completedParts.size / lesson.parts.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Parts List */}
          <div className="space-y-2">
            {lesson.parts?.map((part, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => {
                    goToPart(index);
                    toggleSection(index);
                    setActiveTab('content');
                  }}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    index === currentPartIndex && activeTab === 'content'
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {completedParts.has(index) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-medium text-sm">{part.title}</span>
                    </div>
                    {expandedSections.has(index) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
              </div>
            ))}
            
            {/* Tài liệu đính kèm Tab */}
            {(lesson.attachments?.files?.length > 0 || lesson.attachments?.images?.length > 0) && (
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setActiveTab('attachments')}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeTab === 'attachments'
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">Tài liệu đính kèm</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Lesson Actions */}
          <div className="mt-6 space-y-2">
            <button
              onClick={prevPart}
              disabled={currentPartIndex === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Phần trước
            </button>
            
            <button
              onClick={nextPart}
              disabled={currentPartIndex === lesson.parts.length - 1}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Phần tiếp theo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onExit}
                className="text-gray-600 hover:text-gray-900 transition"
                title="Thoát khỏi bài học"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentPart?.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Phần {currentPartIndex + 1} / {lesson.parts.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isCompleted && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Đã hoàn thành</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Content Tab */}
            {activeTab === 'content' && currentPart && (
              <>
                {/* Video của phần hiện tại */}
                {currentPart.videoUrl && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Video: {currentPart.title}
                    </h3>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={getYouTubeEmbedUrl(currentPart.videoUrl)}
                        title={currentPart.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Nội dung text của phần */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {currentPart.title}
                  </h3>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentPart.content }}
                  />
                </div>
              </>
            )}

            {/* Attachments Tab */}
            {activeTab === 'attachments' && (
              <div className="space-y-6">
                {/* Files */}
                {lesson.attachments?.files?.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Tài liệu đính kèm
                    </h3>
                    <div className="space-y-3">
                      {lesson.attachments.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-600">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                              href={file.url}
                              download={file.name}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images */}
                {lesson.attachments?.images?.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Hình ảnh minh họa
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lesson.attachments.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <button className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 rounded-full p-2 transition-all duration-200">
                              <ExternalLink className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No attachments message */}
                {(!lesson.attachments?.files?.length && !lesson.attachments?.images?.length) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Không có tài liệu đính kèm</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={prevPart}
                disabled={currentPartIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Phần trước
              </button>
              
              <button
                onClick={nextPart}
                disabled={currentPartIndex === lesson.parts.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Phần tiếp theo
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {activeTab === 'content' && (
                <button
                  onClick={() => markPartCompleted(currentPartIndex)}
                  disabled={completedParts.has(currentPartIndex) || isCompleted}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  {completedParts.has(currentPartIndex) ? 'Đã hoàn thành phần này' : 'Hoàn thành phần này'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
