import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useSurvey } from '../../../hooks/useSurvey';
import Loading from '../../../components/Loading';
import UserSurvey from './UserSurvey';
import CourseRecommendations from './CourseRecommendations';
import { getAllGrades, SUBJECTS_BY_LEVEL } from '../../../constants/educationConstants';
import { ENDPOINTS } from '../../../routes/endPoints';
import { ArrowLeft, ClipboardList, Calendar, BookOpen, Target, Plus, RefreshCw, Download, Eye } from 'lucide-react';

const SurveyHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getSurveyHistory, getAllRecommendations, isLoading } = useSurvey();
  const [surveyHistory, setSurveyHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [surveyRecommendations, setSurveyRecommendations] = useState(null);

  // Danh sách câu hỏi khảo sát (giống như trong UserSurvey)
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
        ...Object.values(SUBJECTS_BY_LEVEL).flatMap(subjects => 
          subjects.map(subject => ({
            value: subject.id,
            label: `${subject.icon} ${subject.name}`
          }))
        ).filter((subject, index, self) => 
          index === self.findIndex(s => s.value === subject.value)
        )
      ]
    },
    {
      id: 'math_level',
      question: 'Bạn đánh giá trình độ toán học hiện tại của mình như thế nào?',
      type: 'radio',
      options: [
        { value: 'beginner', label: 'Mới bắt đầu' },
        { value: 'intermediate', label: 'Trung bình' },
        { value: 'advanced', label: 'Nâng cao' }
      ]
    },
    {
      id: 'learning_goals',
      question: 'Mục tiêu học tập của bạn là gì?',
      type: 'checkbox',
      options: [
        { value: 'improve_grades', label: 'Cải thiện điểm số' },
        { value: 'prepare_exam', label: 'Chuẩn bị thi cử' },
        { value: 'learn_new_skills', label: 'Học kỹ năng mới' },
        { value: 'career_preparation', label: 'Chuẩn bị nghề nghiệp' }
      ]
    },
    {
      id: 'difficulty_preference',
      question: 'Bạn thích mức độ khó như thế nào?',
      type: 'radio',
      options: [
        { value: 'easy', label: 'Dễ dàng' },
        { value: 'moderate', label: 'Vừa phải' },
        { value: 'challenging', label: 'Thử thách' }
      ]
    },
    {
      id: 'learning_style',
      question: 'Phong cách học tập nào phù hợp với bạn?',
      type: 'radio',
      options: [
        { value: 'visual', label: 'Hình ảnh' },
        { value: 'auditory', label: 'Âm thanh' },
        { value: 'kinesthetic', label: 'Thực hành' },
        { value: 'reading', label: 'Đọc hiểu' }
      ]
    },
    {
      id: 'time_commitment',
      question: 'Bạn có thể dành bao nhiêu thời gian học mỗi tuần?',
      type: 'radio',
      options: [
        { value: '1-3_hours', label: '1-3 giờ' },
        { value: '4-6_hours', label: '4-6 giờ' },
        { value: '7-10_hours', label: '7-10 giờ' },
        { value: 'more_than_10', label: 'Hơn 10 giờ' }
      ]
    },
    {
      id: 'weak_areas',
      question: 'Lĩnh vực nào bạn cần cải thiện nhiều nhất?',
      type: 'checkbox',
      options: [
        { value: 'problem_solving', label: 'Giải quyết vấn đề' },
        { value: 'time_management', label: 'Quản lý thời gian' },
        { value: 'focus_concentration', label: 'Tập trung' },
        { value: 'motivation', label: 'Động lực học tập' }
      ]
    },
    {
      id: 'motivation_level',
      question: 'Mức độ động lực học tập của bạn hiện tại?',
      type: 'radio',
      options: [
        { value: 'low', label: 'Thấp' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'high', label: 'Cao' }
      ]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [surveys, recs] = await Promise.all([
        getSurveyHistory(),
        getAllRecommendations()
      ]);
      
      setSurveyHistory(surveys);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    let timestamp;
    if (date.seconds) {
      timestamp = date.seconds * 1000;
    } else if (typeof date === 'string') {
      timestamp = new Date(date).getTime();
    } else if (date instanceof Date) {
      timestamp = date.getTime();
    } else {
      return 'N/A';
    }
    
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecommendationsForSurvey = (surveyId) => {
    return recommendations.filter(rec => rec.surveyId === surveyId);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleNewSurvey = () => {
    console.log('Opening survey modal');
    setShowSurveyModal(true);
  };

  const handleSurveyComplete = (recommendations) => {
    setShowSurveyModal(false);
    if (recommendations) {
      setSurveyRecommendations(recommendations);
      setShowRecommendationsModal(true);
    } else {
      // Reload data to show new survey
      loadData();
    }
  };

  const handleSurveySkip = () => {
    setShowSurveyModal(false);
    // Reload data
    loadData();
  };

  const handleRecommendationsClose = () => {
    setShowRecommendationsModal(false);
    setSurveyRecommendations(null);
    // Reload data to show new survey
    loadData();
  };

  const handleViewSurvey = (survey) => {
    setSelectedSurvey(survey);
  };

  const handleCloseSurveyDetail = () => {
    setSelectedSurvey(null);
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

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <ClipboardList className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">
                  Lịch sử Khảo sát & Gợi ý
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Làm mới</span>
              </button>
              <button
                onClick={handleNewSurvey}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Khảo sát mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <p className="text-gray-600">
            Xem lại các khảo sát đã làm và gợi ý khóa học từ AI
          </p>
        </div>

        {surveyHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <ClipboardList className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có khảo sát nào
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy làm khảo sát đầu tiên để nhận gợi ý khóa học từ AI!
            </p>
            <button
              onClick={handleNewSurvey}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Làm khảo sát ngay
            </button>
          </div>
        ) : (
          <>
            {/* Additional Survey Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">
                    Khảo sát bổ sung
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Bạn có thể làm khảo sát thêm để cập nhật mục tiêu học tập. 
                    Khảo sát chính thức tiếp theo sẽ có sau 30 ngày kể từ khảo sát cuối.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {surveyHistory.map((survey, index) => {
              const surveyRecommendations = getRecommendationsForSurvey(survey.id);
              
              return (
                <div key={survey.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Khảo sát #{index + 1}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(survey.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          survey.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {survey.status === 'completed' ? 'Hoàn thành' : 'Đang làm'}
                        </span>
                        {survey.isAdditional && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            Khảo sát bổ sung
                          </span>
                        )}
                        {surveyRecommendations.length > 0 && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {surveyRecommendations.length} gợi ý
                          </span>
                        )}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleViewSurvey(survey)}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Xem chi tiết</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Survey Answers Summary */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Kết quả khảo sát:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {survey.answers.grade_level && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-600">Lớp học:</span>
                            <p className="font-medium">{survey.answers.grade_level.replace('grade_', 'Lớp ')}</p>
                          </div>
                        )}
                        {survey.answers.subject_focus && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-600">Môn học:</span>
                            <p className="font-medium">
                              {Array.isArray(survey.answers.subject_focus) 
                                ? survey.answers.subject_focus.length + ' môn'
                                : survey.answers.subject_focus}
                            </p>
                          </div>
                        )}
                        {survey.answers.math_level && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-600">Trình độ:</span>
                            <p className="font-medium">{survey.answers.math_level}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {surveyRecommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Gợi ý từ AI:
                        </h4>
                        <div className="space-y-3">
                          {surveyRecommendations.map((rec, recIndex) => (
                            <div key={rec.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-blue-800">
                                  Gợi ý #{recIndex + 1}
                                </h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  rec.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {rec.status === 'active' ? 'Hoạt động' : 'Đã lưu trữ'}
                                </span>
                              </div>
                              
                              {rec.recommendations && rec.recommendations.recommendations && (
                                <div className="space-y-2">
                                  {rec.recommendations.recommendations.slice(0, 3).map((course, courseIndex) => (
                                    <div key={courseIndex} className="bg-white p-3 rounded border">
                                      <h6 className="font-medium text-gray-800">{course.title}</h6>
                                      <p className="text-sm text-gray-600">{course.description}</p>
                                      <div className="flex gap-2 mt-2">
                                        {course.grade_level && (
                                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                            {course.grade_level}
                                          </span>
                                        )}
                                        {course.subject && (
                                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                            {course.subject}
                                          </span>
                                        )}
                                        <span className={`px-2 py-1 rounded text-xs ${
                                          course.priority === 'high' ? 'bg-red-100 text-red-800' :
                                          course.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {course.priority === 'high' ? 'Ưu tiên cao' :
                                           course.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  {rec.recommendations.recommendations.length > 3 && (
                                    <p className="text-sm text-gray-500">
                                      +{rec.recommendations.recommendations.length - 3} gợi ý khác...
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </>
        )}
      </div>

      {/* Survey Detail Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Chi tiết Khảo sát</h2>
                  <p className="text-blue-100 mt-1">
                    Xem đầy đủ câu trả lời và phân tích
                  </p>
                </div>
                <button
                  onClick={handleCloseSurveyDetail}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Survey Info */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Khảo sát #{surveyHistory.findIndex(s => s.id === selectedSurvey.id) + 1}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedSurvey.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedSurvey.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedSurvey.status === 'completed' ? 'Hoàn thành' : 'Đang làm'}
                    </span>
                    {selectedSurvey.isAdditional && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Khảo sát bổ sung
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* All Answers */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Tất cả câu trả lời:</h4>
                
                {surveyQuestions.map((question, index) => {
                  const answer = selectedSurvey.answers[question.id];
                  if (!answer) return null;

                  return (
                    <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 mb-2">
                            {question.question}
                          </h5>
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

              {/* Recommendations */}
              {getRecommendationsForSurvey(selectedSurvey.id).length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Gợi ý từ AI:</h4>
                  <div className="space-y-4">
                    {getRecommendationsForSurvey(selectedSurvey.id).map((rec, recIndex) => (
                      <div key={rec.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-semibold text-blue-800">
                            Gợi ý #{recIndex + 1}
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rec.status === 'active' ? 'Hoạt động' : 'Đã lưu trữ'}
                          </span>
                        </div>
                        
                        {rec.recommendations && rec.recommendations.recommendations && (
                          <div className="space-y-3">
                            {rec.recommendations.recommendations.map((course, courseIndex) => (
                              <div key={courseIndex} className="bg-white p-3 rounded border">
                                <h6 className="font-medium text-gray-800">{course.title}</h6>
                                <p className="text-sm text-gray-600">{course.description}</p>
                                <div className="flex gap-2 mt-2">
                                  {course.grade_level && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                      {course.grade_level}
                                    </span>
                                  )}
                                  {course.subject && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                      {course.subject}
                                    </span>
                                  )}
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    course.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    course.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {course.priority === 'high' ? 'Ưu tiên cao' :
                                     course.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={handleCloseSurveyDetail}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Survey Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <UserSurvey
              onComplete={handleSurveyComplete}
              onSkip={handleSurveySkip}
            />
          </div>
        </div>
      )}

      {/* Recommendations Modal */}
      {showRecommendationsModal && surveyRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CourseRecommendations
              recommendations={surveyRecommendations}
              onClose={handleRecommendationsClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyHistory;
