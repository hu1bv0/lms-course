import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack, 
  SkipForward,
  Settings,
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import courseService from '../../../services/firebase/courseService';

const CoursePlayer = ({ courseId, studentId, onComplete }) => {
  const [course, setCourse] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Load course data
  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const result = await courseService.getCourseById(courseId);
      if (result.success) {
        setCourse(result.course);
        
        // Load student progress
        const progressResult = await courseService.getStudentProgress(studentId, courseId);
        if (progressResult.success) {
          setCompletedLessons(new Set(progressResult.completedLessons || []));
        }
      } else {
        toast.error('Không thể tải khóa học');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Có lỗi xảy ra khi tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  const currentLesson = course?.lessons?.[currentLessonIndex];
  const currentPart = currentLesson?.parts?.[currentPartIndex];

  // Video controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Lesson navigation
  const goToLesson = (index) => {
    setCurrentLessonIndex(index);
    setCurrentPartIndex(0);
    setIsPlaying(false);
  };

  const goToPart = (index) => {
    setCurrentPartIndex(index);
  };

  const nextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      goToLesson(currentLessonIndex + 1);
    }
  };

  const prevLesson = () => {
    if (currentLessonIndex > 0) {
      goToLesson(currentLessonIndex - 1);
    }
  };

  // Mark lesson as completed
  const markLessonCompleted = async () => {
    if (!completedLessons.has(currentLesson.id)) {
      try {
        await courseService.updateProgress(studentId, courseId, currentLesson.id, 100);
        setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
        toast.success('Hoàn thành bài học!', {
          position: "top-right",
          autoClose: 2000,
        });
        
        // Auto go to next lesson
        if (currentLessonIndex < course.lessons.length - 1) {
          setTimeout(() => {
            nextLesson();
          }, 1000);
        } else {
          // Course completed
          toast.success('Chúc mừng! Bạn đã hoàn thành khóa học!', {
            position: "top-right",
            autoClose: 3000,
          });
          if (onComplete) {
            onComplete();
          }
        }
      } catch (error) {
        console.error('Error updating progress:', error);
        toast.error('Có lỗi xảy ra khi cập nhật tiến độ');
      }
    }
  };

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    markLessonCompleted();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl">Không tìm thấy khóa học</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">{course.title}</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {course.lessons.map((lesson, index) => (
              <div key={lesson.id} className="bg-gray-700 rounded-lg p-3">
                <button
                  onClick={() => goToLesson(index)}
                  className={`w-full text-left ${
                    index === currentLessonIndex 
                      ? 'text-blue-400' 
                      : completedLessons.has(lesson.id) 
                        ? 'text-green-400' 
                        : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{lesson.title}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{lesson.duration} phút</span>
                      {completedLessons.has(lesson.id) ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  
                  {/* Lesson parts */}
                  {index === currentLessonIndex && lesson.parts && (
                    <div className="ml-4 space-y-1">
                      {lesson.parts.map((part, partIndex) => (
                        <button
                          key={partIndex}
                          onClick={() => goToPart(partIndex)}
                          className={`block w-full text-left text-sm ${
                            partIndex === currentPartIndex 
                              ? 'text-blue-300' 
                              : 'text-gray-400'
                          }`}
                        >
                          {part.title}
                        </button>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Player */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="flex-1 bg-black relative" ref={playerRef}>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onClick={togglePlayPause}
          >
            {/* Video source sẽ được thêm từ YouTube URL hoặc file video */}
            <source src={currentPart?.videoUrl || ''} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay Controls */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isPlaying && (
              <button
                onClick={togglePlayPause}
                className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition"
              >
                <Play className="w-12 h-12 text-white" />
              </button>
            )}
          </div>

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-black bg-opacity-50 rounded-lg p-2 hover:bg-opacity-70 transition"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            
            <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2">
              <span className="text-white text-sm">
                {currentLessonIndex + 1} / {course.lessons.length}
              </span>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div 
                className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-200"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={prevLesson}
                  disabled={currentLessonIndex === 0}
                  className="text-white hover:text-blue-400 disabled:text-gray-500"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => skipTime(-10)}
                  className="text-white hover:text-blue-400"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
                
                <button
                  onClick={() => skipTime(10)}
                  className="text-white hover:text-blue-400"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextLesson}
                  disabled={currentLessonIndex === course.lessons.length - 1}
                  className="text-white hover:text-blue-400 disabled:text-gray-500"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white hover:text-blue-400">
                    {isMuted ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
                
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400"
                >
                  {isFullscreen ? (
                    <Minimize className="w-6 h-6" />
                  ) : (
                    <Maximize className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Info */}
        <div className="bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-semibold">
                {currentLesson?.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {currentPart?.title}
              </p>
            </div>
            
            <button
              onClick={markLessonCompleted}
              disabled={completedLessons.has(currentLesson?.id)}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition"
            >
              {completedLessons.has(currentLesson?.id) ? (
                <>
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Đã hoàn thành
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Hoàn thành bài học
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
