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
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Sidebar - Lesson Parts */}
      <div className="relative w-80 bg-white/80 backdrop-blur-xl border-r border-white/30 shadow-xl overflow-y-auto z-10">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {lesson.title}
            </h2>
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-700">{lesson.duration} phút</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-gray-700">{lesson.parts?.length || 0} phần</span>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between text-sm font-bold text-gray-700 mb-3">
                <span>Tiến độ hoàn thành</span>
                <span className="text-green-600">
                  {completedParts.size}/{lesson.parts?.length || 0} phần
                </span>
              </div>
              <div className="w-full bg-gray-200/80 rounded-full h-3 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-500 shadow-lg relative overflow-hidden"
                  style={{ width: `${lesson.parts?.length ? (completedParts.size / lesson.parts.length) * 100 : 0}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Parts List */}
          <div className="space-y-3">
            {lesson.parts?.map((part, index) => (
              <div key={index} className="relative border border-gray-200/50 rounded-xl overflow-hidden group">
                <button
                  onClick={() => {
                    goToPart(index);
                    toggleSection(index);
                    setActiveTab('content');
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    index === currentPartIndex && activeTab === 'content'
                      ? 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 shadow-lg'
                      : 'bg-white/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:via-purple-50/50 hover:to-pink-50/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                        completedParts.has(index)
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : 'bg-gradient-to-br from-gray-300 to-gray-400'
                      }`}>
                        {completedParts.has(index) ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-white" />
                        )}
                        {completedParts.has(index) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <span className="font-bold text-sm text-gray-900">{part.title}</span>
                    </div>
                    {expandedSections.has(index) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
              </div>
            ))}
            
            {/* Tài liệu đính kèm Tab */}
            {(lesson.attachments?.files?.length > 0 || lesson.attachments?.images?.length > 0) && (
              <div className="relative border border-gray-200/50 rounded-xl overflow-hidden group">
                <button
                  onClick={() => setActiveTab('attachments')}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    activeTab === 'attachments'
                      ? 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 shadow-lg'
                      : 'bg-white/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:via-purple-50/50 hover:to-pink-50/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-sm text-gray-900">Tài liệu đính kèm</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Lesson Actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={prevPart}
              disabled={currentPartIndex === 0}
              className="relative w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-bold overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <ChevronRight className="w-5 h-5 rotate-180 relative z-10" />
              <span className="relative z-10">Phần trước</span>
            </button>
            
            <button
              onClick={nextPart}
              disabled={currentPartIndex === lesson.parts.length - 1}
              className="relative w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-bold overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Phần tiếp theo</span>
              <ChevronRight className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onExit}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                title="Thoát khỏi bài học"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-black text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentPart?.title}
                </h1>
                <p className="text-sm text-gray-600 font-semibold">
                  Phần {currentPartIndex + 1} / {lesson.parts.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isCompleted && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-md">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-green-700">Đã hoàn thành</span>
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
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 overflow-hidden group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    
                    <h3 className="relative text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                      Video: {currentPart.title}
                    </h3>
                    <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
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
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 overflow-hidden group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                  
                  <h3 className="relative text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-2 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                    {currentPart.title}
                  </h3>
                  <div 
                    className="relative prose max-w-none prose-headings:font-black prose-p:text-gray-700 prose-strong:text-gray-900"
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
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 overflow-hidden group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    
                    <h3 className="relative text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                      Tài liệu đính kèm
                    </h3>
                    <div className="relative space-y-3">
                      {lesson.attachments.files.map((file, index) => (
                        <div key={index} className="relative flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 group/item overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-purple-50/0 group-hover/item:from-blue-50/30 group-hover/item:to-purple-50/30 transition-all duration-500"></div>
                          
                          <div className="relative flex items-center gap-4 z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-600 font-medium">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="relative flex items-center gap-3 z-10">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-all duration-200 hover:scale-110"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                            <a
                              href={file.url}
                              download={file.name}
                              className="p-2 bg-purple-50 rounded-lg text-purple-600 hover:bg-purple-100 transition-all duration-200 hover:scale-110"
                            >
                              <Download className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images */}
                {lesson.attachments?.images?.length > 0 && (
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 overflow-hidden group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    
                    <h3 className="relative text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-2 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                      Hình ảnh minh họa
                    </h3>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lesson.attachments.images.map((image, index) => (
                        <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <a
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-transform duration-200"
                            >
                              <ExternalLink className="w-6 h-6 text-gray-700" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No attachments message */}
                {(!lesson.attachments?.files?.length && !lesson.attachments?.images?.length) && (
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Không có tài liệu đính kèm</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-white/30 shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={prevPart}
                disabled={currentPartIndex === 0}
                className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-bold overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                <ChevronRight className="w-5 h-5 rotate-180 relative z-10" />
                <span className="relative z-10">Phần trước</span>
              </button>
              
              <button
                onClick={nextPart}
                disabled={currentPartIndex === lesson.parts.length - 1}
                className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-bold overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">Phần tiếp theo</span>
                <ChevronRight className="w-5 h-5 relative z-10" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {activeTab === 'content' && (
                <button
                  onClick={() => markPartCompleted(currentPartIndex)}
                  disabled={completedParts.has(currentPartIndex) || isCompleted}
                  className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <CheckCircle className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{completedParts.has(currentPartIndex) ? 'Đã hoàn thành phần này' : 'Hoàn thành phần này'}</span>
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
