import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useSurvey } from '../../../hooks/useSurvey';
import Loading from '../../../components/Loading';
import { getAllGrades, SUBJECTS_BY_LEVEL } from '../../../constants/educationConstants';
import { ArrowLeft, CheckCircle, Circle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../../routes/endPoints';

const UserSurvey = ({ onComplete, onSkip }) => {
  const { user } = useAuth();
  const { submitSurvey, isLoading } = useSurvey();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Danh sách câu hỏi khảo sát
  const surveyQuestions = [
    {
      id: 'grade_level',
      question: 'Bạn đang học lớp nào?',
      type: 'radio',
      options: getAllGrades().map(grade => ({
        value: `grade_${grade.gradeNumber}`,
        label: grade.grade
      })).concat([
        { value: 'university', label: 'Đại học' },
        { value: 'other', label: 'Khác' }
      ])
    },
    {
      id: 'subject_focus',
      question: 'Môn học nào bạn muốn tập trung cải thiện?',
      type: 'checkbox',
      options: [
        // Lấy tất cả môn học từ các cấp học
        ...Object.values(SUBJECTS_BY_LEVEL).flatMap(subjects => 
          subjects.map(subject => ({
            value: subject.id,
            label: `${subject.icon} ${subject.name}`
          }))
        ).filter((subject, index, self) => 
          // Loại bỏ duplicate subjects
          index === self.findIndex(s => s.value === subject.value)
        )
      ]
    },
    {
      id: 'math_level',
      question: 'Bạn đánh giá trình độ toán học hiện tại của mình như thế nào?',
      type: 'radio',
      options: [
        { value: 'beginner', label: 'Mới bắt đầu - Cần học từ cơ bản' },
        { value: 'intermediate', label: 'Trung bình - Có kiến thức cơ bản' },
        { value: 'advanced', label: 'Khá - Hiểu rõ các khái niệm' },
        { value: 'expert', label: 'Giỏi - Có thể giải bài khó' }
      ]
    },
    {
      id: 'learning_goals',
      question: 'Mục tiêu học tập chính của bạn là gì?',
      type: 'checkbox',
      options: [
        { value: 'exam_prep', label: 'Chuẩn bị cho kỳ thi' },
        { value: 'skill_improvement', label: 'Cải thiện kỹ năng giải bài' },
        { value: 'concept_understanding', label: 'Hiểu sâu các khái niệm' },
        { value: 'problem_solving', label: 'Phát triển tư duy logic' },
        { value: 'career_prep', label: 'Chuẩn bị cho nghề nghiệp' }
      ]
    },
    {
      id: 'difficulty_preference',
      question: 'Bạn thích học với mức độ khó như thế nào?',
      type: 'radio',
      options: [
        { value: 'easy', label: 'Dễ - Từ từ và chắc chắn' },
        { value: 'medium', label: 'Trung bình - Cân bằng' },
        { value: 'challenging', label: 'Khó - Thử thách bản thân' },
        { value: 'mixed', label: 'Hỗn hợp - Tùy theo tâm trạng' }
      ]
    },
    {
      id: 'learning_style',
      question: 'Phong cách học tập nào phù hợp với bạn nhất?',
      type: 'radio',
      options: [
        { value: 'visual', label: 'Hình ảnh - Thích biểu đồ, sơ đồ' },
        { value: 'auditory', label: 'Âm thanh - Thích nghe giảng' },
        { value: 'kinesthetic', label: 'Thực hành - Thích làm bài tập' },
        { value: 'reading', label: 'Đọc hiểu - Thích đọc tài liệu' }
      ]
    },
    {
      id: 'time_commitment',
      question: 'Bạn có thể dành bao nhiêu thời gian học mỗi tuần?',
      type: 'radio',
      options: [
        { value: '1-3_hours', label: '1-3 giờ/tuần' },
        { value: '4-6_hours', label: '4-6 giờ/tuần' },
        { value: '7-10_hours', label: '7-10 giờ/tuần' },
        { value: '10+_hours', label: 'Hơn 10 giờ/tuần' }
      ]
    },
    {
      id: 'weak_areas',
      question: 'Bạn cảm thấy mình cần cải thiện ở lĩnh vực nào?',
      type: 'checkbox',
      options: [
        { value: 'algebra', label: 'Đại số' },
        { value: 'geometry', label: 'Hình học' },
        { value: 'calculus', label: 'Giải tích' },
        { value: 'statistics', label: 'Thống kê' },
        { value: 'trigonometry', label: 'Lượng giác' },
        { value: 'problem_solving', label: 'Kỹ năng giải bài' },
        { value: 'time_management', label: 'Quản lý thời gian' },
        { value: 'concentration', label: 'Tập trung' }
      ]
    },
    {
      id: 'motivation_level',
      question: 'Mức độ động lực học tập của bạn hiện tại?',
      type: 'radio',
      options: [
        { value: 'very_low', label: 'Rất thấp - Khó tập trung' },
        { value: 'low', label: 'Thấp - Cần động lực' },
        { value: 'medium', label: 'Trung bình - Ổn định' },
        { value: 'high', label: 'Cao - Rất hứng thú' },
        { value: 'very_high', label: 'Rất cao - Đam mê học tập' }
      ]
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const result = await submitSurvey(answers);
      if (result.success) {
        onComplete?.(result.recommendations);
      } else {
        console.error('Survey submission failed:', result.error);
        onComplete?.(); // Still call onComplete even if submission failed
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      onComplete?.(); // Still call onComplete even if error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const handleReviewAnswers = () => {
    setShowReview(true);
  };

  const handleCloseReview = () => {
    setShowReview(false);
  };

  const getAnswerText = (questionId, answerValue) => {
    const question = surveyQuestions.find(q => q.id === questionId);
    if (!question) return answerValue;

    if (Array.isArray(answerValue)) {
      return answerValue.map(val => {
        const option = question.options.find(opt => opt.value === val);
        return option ? option.label : val;
      }).join(', ');
    } else {
      const option = question.options.find(opt => opt.value === answerValue);
      return option ? option.label : answerValue;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const currentQuestion = surveyQuestions[currentStep];
  const isLastStep = currentStep === surveyQuestions.length - 1;
  const canProceed = answers[currentQuestion.id] !== undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
                className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại Dashboard</span>
              </button>
              <div className="h-6 w-px bg-blue-300" />
              <div>
                <h2 className="text-2xl font-bold">Khảo sát học tập</h2>
                <p className="text-blue-100 mt-1">
                  Giúp chúng tôi hiểu bạn hơn để đưa ra gợi ý phù hợp
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReviewAnswers}
                className="flex items-center gap-2 bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 hover:text-white transition-colors px-3 py-2 rounded-lg border border-blue-400/30"
                title="Xem lại các câu trả lời"
              >
                <Eye className="w-5 h-5" />
                <span className="hidden sm:inline">Xem lại</span>
              </button>
              <button
                onClick={handleSkip}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Câu hỏi {currentStep + 1} / {surveyQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / surveyQuestions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / surveyQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[currentQuestion.id] === option.value ||
                  (Array.isArray(answers[currentQuestion.id]) && 
                   answers[currentQuestion.id].includes(option.value))
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type={currentQuestion.type}
                  name={currentQuestion.id}
                  value={option.value}
                  checked={
                    currentQuestion.type === 'radio'
                      ? answers[currentQuestion.id] === option.value
                      : Array.isArray(answers[currentQuestion.id]) &&
                        answers[currentQuestion.id].includes(option.value)
                  }
                  onChange={(e) => {
                    if (currentQuestion.type === 'radio') {
                      handleAnswerChange(currentQuestion.id, e.target.value);
                    } else {
                      // Checkbox
                      const currentValues = answers[currentQuestion.id] || [];
                      if (e.target.checked) {
                        handleAnswerChange(currentQuestion.id, [...currentValues, option.value]);
                      } else {
                        handleAnswerChange(
                          currentQuestion.id,
                          currentValues.filter(v => v !== option.value)
                        );
                      }
                    }
                  }}
                  className="mt-1 mr-3"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Quay lại
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                !canProceed || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !canProceed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              Tiếp theo
            </button>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Review Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Xem lại câu trả lời</h2>
                  <p className="text-green-100 mt-1">
                    Kiểm tra các lựa chọn của bạn trước khi hoàn thành
                  </p>
                </div>
                <button
                  onClick={handleCloseReview}
                  className="text-green-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Review Content */}
            <div className="p-6">
              <div className="space-y-6">
                {surveyQuestions.map((question, index) => {
                  const answer = answers[question.id];
                  if (!answer) return null;

                  return (
                    <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {question.question}
                          </h3>
                          <div className="bg-white p-3 rounded border">
                            <p className="text-gray-700">
                              {getAnswerText(question.id, answer)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {Object.keys(answers).length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <Eye className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Chưa có câu trả lời nào
                  </h3>
                  <p className="text-gray-600">
                    Hãy trả lời một số câu hỏi để xem lại
                  </p>
                </div>
              )}
            </div>

            {/* Review Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={handleCloseReview}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSurvey;