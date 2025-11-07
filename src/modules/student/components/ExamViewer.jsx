import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  FileText, 
  AlertCircle,
  Send,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Trophy,
  ArrowLeft,
  Download,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import CKEditorComponent from '../../../components/ui/CKEditorComponent';

const ExamViewer = ({ exam, onComplete, onNext, onPrev, onExit, timeLimit = null }) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60 || null); // Convert minutes to seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  // Initialize answers
  useEffect(() => {
    const initialAnswers = {};
    exam.questions?.essay?.forEach(q => {
      initialAnswers[q.id] = '';
    });
    exam.questions?.multipleChoice?.forEach(q => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);
  }, [exam]);

  // Check if exam has questions or just attachments
  const hasQuestions = (exam.questions?.essay?.length || 0) + (exam.questions?.multipleChoice?.length || 0) > 0;
  const hasAttachments = exam.attachments && exam.attachments.length > 0;
  const totalQuestions = (exam.questions?.essay?.length || 0) + (exam.questions?.multipleChoice?.length || 0);

  const currentQuestion = getCurrentQuestion();

  function getCurrentQuestion() {
    if (!hasQuestions) return null;
    
    const essayQuestions = exam.questions?.essay || [];
    const mcQuestions = exam.questions?.multipleChoice || [];
    
    if (currentQuestionIndex < essayQuestions.length) {
      return { ...essayQuestions[currentQuestionIndex], type: 'essay' };
    } else {
      const mcIndex = currentQuestionIndex - essayQuestions.length;
      return mcQuestions[mcIndex] ? { ...mcQuestions[mcIndex], type: 'multipleChoice' } : null;
    }
  }

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Navigation
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit exam
  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Calculate score first
    let totalPoints = 0;
    let earnedPoints = 0;

    // Calculate multiple choice scores
    exam.questions?.multipleChoice?.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctAnswer) {
        earnedPoints += q.points;
      }
    });

    // Essay questions are manually graded (assume full points for now)
    exam.questions?.essay?.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] && answers[q.id].trim().length > 0) {
        earnedPoints += q.points; // Assume full points for essay answers
      }
    });

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const calculatedScore = {
      earned: earnedPoints,
      total: totalPoints,
      percentage: percentage
    };
    
    setScore(calculatedScore);
    setShowResults(true);
    setIsCompleted(true);
    
    // Gọi onComplete với calculated score
    if (onComplete) {
      onComplete(calculatedScore);
    }
    
    toast.success('Nộp bài thi thành công!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Calculate score
  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    // Calculate multiple choice scores
    exam.questions?.multipleChoice?.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctAnswer) {
        earnedPoints += q.points;
      }
    });

    // Essay questions are manually graded (assume full points for now)
    exam.questions?.essay?.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] && answers[q.id].trim().length > 0) {
        earnedPoints += q.points; // Assume full points for essay answers
      }
    });

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    setScore({
      earned: earnedPoints,
      total: totalPoints,
      percentage: percentage
    });
  };

  // Reset exam
  const resetExam = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(timeLimit * 60 || null);
    setIsSubmitted(false);
    setShowResults(false);
    setScore(null);
    setIsCompleted(false);
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get question status
  const getQuestionStatus = (index) => {
    const essayQuestions = exam.questions?.essay || [];
    const mcQuestions = exam.questions?.multipleChoice || [];
    
    let question;
    if (index < essayQuestions.length) {
      question = essayQuestions[index];
    } else {
      question = mcQuestions[index - essayQuestions.length];
    }

    if (!question) return 'unanswered';

    if (answers[question.id] !== undefined && answers[question.id] !== null && answers[question.id] !== '') {
      return 'answered';
    }
    return 'unanswered';
  };

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không có bài thi nào</p>
        </div>
      </div>
    );
  }

  // If exam only has attachments and no questions, show file viewer
  if (!hasQuestions && hasAttachments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/40 to-emerald-50/40 overflow-y-auto relative">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto p-6 z-10">
          {/* Header */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-6 overflow-hidden group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            
            <div className="relative flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {exam.title}
                </h2>
                {exam.description && (
                  <p className="text-gray-700 font-medium">{exam.description}</p>
                )}
              </div>
              <button
                onClick={onExit}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                title="Thoát"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* File Attachments */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-6 overflow-hidden group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            
            <h3 className="relative text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              Tài liệu bài tập
            </h3>
            <div className="relative space-y-3">
              {exam.attachments.map((file, index) => (
                <div 
                  key={index} 
                  className="relative flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 group/item overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-purple-50/0 group-hover/item:from-blue-50/30 group-hover/item:to-purple-50/30 transition-all duration-500"></div>
                  
                  <div className="relative flex items-center gap-4 z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{file.name}</p>
                      {file.size && (
                        <p className="text-sm text-gray-600 font-medium">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold overflow-hidden group/btn z-10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    <Download className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Tải xuống</span>
                    <ExternalLink className="w-5 h-5 relative z-10" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {exam.description && (
            <div className="relative bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-md">
              <p className="text-sm font-bold text-blue-800">
                <strong>Hướng dẫn:</strong> {exam.description}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setIsCompleted(true);
                if (onComplete) {
                  onComplete({ earned: 0, total: 0, percentage: 0 });
                }
                toast.success('Đã xem tài liệu bài tập!', {
                  position: "top-right",
                  autoClose: 3000,
                });
              }}
              className="relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-black overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <CheckCircle className="w-5 h-5 inline mr-2 relative z-10" />
              <span className="relative z-10">Đã xem xong</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && score) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/40 to-emerald-50/40 overflow-y-auto relative">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto p-6 z-10">
          {/* Results Header */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12 mb-6 overflow-hidden group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
            
            <div className="relative text-center">
              <div className={`relative w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl ${
                score.percentage >= 70 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-orange-600'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
                <Trophy className={`w-12 h-12 text-white relative z-10 drop-shadow-2xl`} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"></div>
              </div>
              
              <h2 className="text-4xl font-black text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {score.percentage >= 70 ? 'Chúc mừng!' : 'Cần cố gắng thêm!'}
              </h2>
              
              <p className="text-lg text-gray-700 mb-8 font-medium">
                {score.percentage >= 70 
                  ? 'Bạn đã vượt qua bài thi!' 
                  : 'Hãy ôn tập lại và thử lại nhé!'
                }
              </p>

              <div className="relative bg-gradient-to-br from-gray-50 to-green-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50 shadow-lg">
                <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {score.percentage}%
                </div>
                <div className="text-lg font-bold text-gray-700">
                  {score.earned} / {score.total} điểm
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetExam}
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <RotateCcw className="w-5 h-5 inline mr-2 relative z-10" />
                  <span className="relative z-10">Làm lại bài thi</span>
                </button>
                
                <button
                  onClick={() => onExit && onExit()}
                  className="relative bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-8 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">Quay lại khóa học</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 overflow-hidden group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            
            <h3 className="relative text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
              Chi tiết kết quả
            </h3>
            <div className="relative space-y-4">
              {exam.questions?.multipleChoice?.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div key={question.id} className="relative bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 overflow-hidden group/item">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 to-emerald-50/0 group-hover/item:from-green-50/30 group-hover/item:to-emerald-50/30 transition-all duration-500"></div>
                    
                    <div className="relative flex items-start justify-between mb-4">
                      <h4 className="font-black text-lg text-gray-900">Câu {index + 1}</h4>
                      <div className={`px-4 py-2 rounded-xl text-sm font-black shadow-md ${
                        isCorrect ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' : 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border border-red-200'
                      }`}>
                        {isCorrect ? '✓ Đúng' : '✗ Sai'}
                      </div>
                    </div>
                    
                    <div className="relative mb-4">
                      <div 
                        className="text-gray-900 leading-relaxed font-medium"
                        dangerouslySetInnerHTML={{ __html: question.question }}
                      />
                    </div>
                    
                    <div className="relative space-y-3">
                      <div className="text-sm font-bold text-gray-700">Đáp án của bạn:</div>
                      <div className={`p-4 rounded-xl border-2 shadow-md ${
                        isCorrect ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200' : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-800 border-red-200'
                      }`}>
                        <strong className="text-lg">{String.fromCharCode(65 + userAnswer)}.</strong> {question.options?.[userAnswer] || 'N/A'}
                      </div>
                      
                      {!isCorrect && (
                        <>
                          <div className="text-sm font-bold text-gray-700">Đáp án đúng:</div>
                          <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 shadow-md">
                            <strong className="text-lg">{String.fromCharCode(65 + question.correctAnswer)}.</strong> {question.options?.[question.correctAnswer] || 'N/A'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30 flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Sidebar - Question Navigation */}
      <div className="relative w-80 bg-white/80 backdrop-blur-xl border-r border-white/30 shadow-xl overflow-y-auto z-10">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {exam.title}
            </h2>
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-gray-700">{exam.duration} phút</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-gray-700">{totalQuestions} câu hỏi</span>
              </div>
            </div>
          </div>

          {/* Timer */}
          {timeLeft !== null && (
            <div className={`relative mb-6 p-4 rounded-xl border-2 shadow-lg overflow-hidden ${
              timeLeft < 300 ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
              <div className="relative flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">Thời gian còn lại:</span>
                <span className={`text-2xl font-black ${
                  timeLeft < 300 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
              Danh sách câu hỏi
            </h3>
            {Array.from({ length: totalQuestions }, (_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`relative w-full text-left p-4 rounded-xl transition-all duration-300 overflow-hidden group ${
                    index === currentQuestionIndex
                      ? 'bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 shadow-lg'
                      : 'bg-white/50 border border-gray-200/50 hover:bg-gradient-to-r hover:from-green-50/50 hover:via-emerald-50/50 hover:to-teal-50/50 hover:shadow-md'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 via-emerald-50/0 to-teal-50/0 group-hover:from-green-50/30 group-hover:via-emerald-50/30 group-hover:to-teal-50/30 transition-all duration-500"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                        status === 'answered'
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : 'bg-gradient-to-br from-gray-300 to-gray-400'
                      }`}>
                        {status === 'answered' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-white" />
                        )}
                        {status === 'answered' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        Câu {index + 1}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="relative w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-black overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <Send className="w-5 h-5 inline mr-2 relative z-10" />
              <span className="relative z-10">Nộp bài thi</span>
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
                title="Thoát khỏi bài thi"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-black text-gray-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {totalQuestions > 0 ? `Câu ${currentQuestionIndex + 1} / ${totalQuestions}` : 'Bài thi'}
                </h1>
                <p className="text-sm text-gray-600 font-semibold">
                  {currentQuestion?.type === 'essay' ? 'Tự luận' : currentQuestion?.type === 'multipleChoice' ? 'Trắc nghiệm' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {timeLeft !== null && (
                <div className={`relative px-4 py-2 rounded-xl border-2 shadow-lg overflow-hidden ${
                  timeLeft < 300 ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300 text-red-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-700'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                  <div className="relative flex items-center gap-2 font-black">
                    <Clock className="w-5 h-5" />
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {currentQuestion ? (
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 overflow-hidden group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                
                {/* Question */}
                <div className="relative mb-8">
                  <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-2 h-6 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
                    Câu hỏi:
                  </h2>
                  <div className="prose max-w-none">
                    <div 
                      className="text-gray-900 leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                    />
                  </div>
                </div>

                {/* Answer Section */}
                {currentQuestion.type === 'multipleChoice' ? (
                  <div className="relative">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-2 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                      Chọn đáp án:
                    </h3>
                    <div className="space-y-3">
                      {(currentQuestion.options || []).map((option, index) => (
                        <label key={index} className="relative flex items-start p-5 border-2 border-gray-200/50 rounded-xl hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 cursor-pointer transition-all duration-300 group/option overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 to-emerald-50/0 group-hover/option:from-green-50/30 group-hover/option:to-emerald-50/30 transition-all duration-500"></div>
                          <input
                            type="radio"
                            name={`question_${currentQuestion.id}`}
                            value={index}
                            checked={answers[currentQuestion.id] === index}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                            className="mt-1 mr-4 w-5 h-5 text-green-600 relative z-10"
                          />
                          <div className="flex-1 relative z-10">
                            <span className="text-gray-900 leading-relaxed font-semibold">
                              <strong className="text-green-600">{String.fromCharCode(65 + index)}.</strong> {option}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-2 h-5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                      Câu trả lời của bạn:
                    </h3>
                    <div className="bg-white rounded-xl border-2 border-gray-200/50 p-4">
                      <CKEditorComponent
                        value={answers[currentQuestion.id] || ''}
                        onChange={(content) => handleAnswerChange(currentQuestion.id, content)}
                        placeholder="Nhập câu trả lời của bạn..."
                      />
                    </div>
                  </div>
                )}

                {/* Question Info */}
                <div className="relative mt-8 p-5 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl border border-gray-200/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700">Điểm: <span className="text-green-600">{currentQuestion.points}</span></span>
                    <span className="font-bold text-gray-700">Loại: <span className="text-emerald-600">{currentQuestion.type === 'essay' ? 'Tự luận' : 'Trắc nghiệm'}</span></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12">
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Không có câu hỏi nào</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-white/30 shadow-lg p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-bold overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <ChevronLeft className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Câu trước</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <span className="text-sm font-black text-gray-700">
                {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-bold overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Câu tiếp theo</span>
              <ChevronRight className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamViewer;
