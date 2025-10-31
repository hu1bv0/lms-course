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
      <div className="h-screen bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {exam.title}
                </h2>
                {exam.description && (
                  <p className="text-gray-600">{exam.description}</p>
                )}
              </div>
              <button
                onClick={onExit}
                className="text-gray-600 hover:text-gray-900 transition"
                title="Thoát"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* File Attachments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tài liệu bài tập
            </h3>
            <div className="space-y-3">
              {exam.attachments.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      {file.size && (
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {exam.description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800">
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Đã xem xong
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && score) {
    return (
      <div className="h-screen bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Results Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                score.percentage >= 70 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Trophy className={`w-8 h-8 ${
                  score.percentage >= 70 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {score.percentage >= 70 ? 'Chúc mừng!' : 'Cần cố gắng thêm!'}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {score.percentage >= 70 
                  ? 'Bạn đã vượt qua bài thi!' 
                  : 'Hãy ôn tập lại và thử lại nhé!'
                }
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {score.percentage}%
                </div>
                <div className="text-sm text-gray-600">
                  {score.earned} / {score.total} điểm
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={resetExam}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Làm lại bài thi
                </button>
                
                <button
                  onClick={() => onExit && onExit()}
                  className="bg-gray-100 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-200 transition"
                >
                  Quay lại khóa học
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết kết quả</h3>
            <div className="space-y-4">
              {exam.questions?.multipleChoice?.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Câu {index + 1}</h4>
                      <div className={`px-2 py-1 rounded text-sm font-medium ${
                        isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? 'Đúng' : 'Sai'}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div 
                        className="text-gray-900 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: question.question }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Đáp án của bạn:</div>
                      <div className={`p-2 rounded ${
                        isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        <strong>{String.fromCharCode(65 + userAnswer)}.</strong> {question.options?.[userAnswer] || 'N/A'}
                      </div>
                      
                      {!isCorrect && (
                        <>
                          <div className="text-sm text-gray-600">Đáp án đúng:</div>
                          <div className="p-2 rounded bg-green-50 text-green-800">
                            <strong>{String.fromCharCode(65 + question.correctAnswer)}.</strong> {question.options?.[question.correctAnswer] || 'N/A'}
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
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Question Navigation */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {exam.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{exam.duration} phút</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{totalQuestions} câu hỏi</span>
              </div>
            </div>
          </div>

          {/* Timer */}
          {timeLeft !== null && (
            <div className={`mb-4 p-3 rounded-lg ${
              timeLeft < 300 ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Thời gian còn lại:</span>
                <span className={`font-bold ${
                  timeLeft < 300 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Danh sách câu hỏi</h3>
            {Array.from({ length: totalQuestions }, (_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-full text-left p-2 rounded-lg transition ${
                    index === currentQuestionIndex
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Câu {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      {status === 'answered' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
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
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <Send className="w-4 h-4 inline mr-2" />
              Nộp bài thi
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
                title="Thoát khỏi bài thi"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {totalQuestions > 0 ? `Câu ${currentQuestionIndex + 1} / ${totalQuestions}` : 'Bài thi'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentQuestion?.type === 'essay' ? 'Tự luận' : currentQuestion?.type === 'multipleChoice' ? 'Trắc nghiệm' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {timeLeft !== null && (
                <div className={`px-3 py-1 rounded-lg ${
                  timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {currentQuestion ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Question */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Câu hỏi:
                  </h2>
                  <div className="prose max-w-none">
                    <div 
                      className="text-gray-900 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                    />
                  </div>
                </div>

                {/* Answer Section */}
                {currentQuestion.type === 'multipleChoice' ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Chọn đáp án:
                    </h3>
                    <div className="space-y-3">
                      {(currentQuestion.options || []).map((option, index) => (
                        <label key={index} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                          <input
                            type="radio"
                            name={`question_${currentQuestion.id}`}
                            value={index}
                            checked={answers[currentQuestion.id] === index}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                            className="mt-1 mr-3 w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <span className="text-gray-900 leading-relaxed">
                              <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Câu trả lời của bạn:
                    </h3>
                    <CKEditorComponent
                      value={answers[currentQuestion.id] || ''}
                      onChange={(content) => handleAnswerChange(currentQuestion.id, content)}
                      placeholder="Nhập câu trả lời của bạn..."
                    />
                  </div>
                )}

                {/* Question Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Điểm: {currentQuestion.points}</span>
                    <span>Loại: {currentQuestion.type === 'essay' ? 'Tự luận' : 'Trắc nghiệm'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Không có câu hỏi nào</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Câu trước
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Câu tiếp theo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamViewer;
