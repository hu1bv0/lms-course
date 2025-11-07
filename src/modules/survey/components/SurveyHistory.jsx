import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useSurvey } from '../../../hooks/useSurvey';
import Loading from '../../../components/Loading';
import UserSurvey from './UserSurvey';
import CourseRecommendations from './CourseRecommendations';
import { getSurveyQuestions, getAnswerText as getAnswerTextUtil } from '../../../constants/surveyConstants';
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

  // Sử dụng survey questions từ constants chung
  const surveyQuestions = getSurveyQuestions();

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

  // Sử dụng utility function từ constants chung
  const getAnswerText = getAnswerTextUtil;

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Quay lại Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ClipboardList className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Lịch sử Khảo sát & Gợi ý
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md px-3 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 border border-gray-200/50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline font-medium">Làm mới</span>
              </button>
              <button
                onClick={handleNewSurvey}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Khảo sát mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <p className="text-gray-700 font-medium text-lg">
            Xem lại các khảo sát đã làm và gợi ý khóa học từ AI
          </p>
        </div>

        {surveyHistory.length === 0 ? (
          <div className="text-center py-20 relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6 shadow-lg">
              <ClipboardList className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Chưa có khảo sát nào
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Hãy làm khảo sát đầu tiên để nhận gợi ý khóa học từ AI!
            </p>
            <button
              onClick={handleNewSurvey}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 font-semibold text-lg"
            >
              Làm khảo sát ngay
            </button>
          </div>
        ) : (
          <>
            {/* Additional Survey Info */}
            <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-5 mb-6 shadow-lg shadow-blue-500/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-800 mb-2 text-lg">
                    Khảo sát bổ sung
                  </h4>
                  <p className="text-blue-700 text-sm leading-relaxed">
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
                <div key={survey.id} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-lg">#{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Khảo sát #{index + 1}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-2 font-medium">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            {formatDate(survey.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${
                          survey.status === 'completed' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                            : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                        }`}>
                          {survey.status === 'completed' ? 'Hoàn thành' : 'Đang làm'}
                        </span>
                        {survey.isAdditional && (
                          <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
                            Khảo sát bổ sung
                          </span>
                        )}
                        {surveyRecommendations.length > 0 && (
                          <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
                            {surveyRecommendations.length} gợi ý
                          </span>
                        )}
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => handleViewSurvey(survey)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Xem chi tiết</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Survey Answers Summary */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        Kết quả khảo sát:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {survey.answers.grade_level && (
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <span className="text-sm text-gray-600 font-medium block mb-1">Lớp học:</span>
                            <p className="font-bold text-gray-800">{getAnswerText('grade_level', survey.answers.grade_level)}</p>
                          </div>
                        )}
                        {survey.answers.subject_focus && (
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <span className="text-sm text-gray-600 font-medium block mb-1">Môn học:</span>
                            <p className="font-bold text-gray-800">
                              {getAnswerText('subject_focus', survey.answers.subject_focus)}
                            </p>
                          </div>
                        )}
                        {survey.answers.math_level && (
                          <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 rounded-xl border border-pink-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <span className="text-sm text-gray-600 font-medium block mb-1">Trình độ:</span>
                            <p className="font-bold text-gray-800">{getAnswerText('math_level', survey.answers.math_level)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {surveyRecommendations.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          Gợi ý từ AI:
                        </h4>
                        <div className="space-y-4">
                          {surveyRecommendations.map((rec, recIndex) => (
                            <div key={rec.id} className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm p-5 rounded-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="font-bold text-blue-800 text-lg flex items-center gap-2">
                                  <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    #{recIndex + 1}
                                  </span>
                                  Gợi ý #{recIndex + 1}
                                </h5>
                                <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md ${
                                  rec.status === 'active' 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                }`}>
                                  {rec.status === 'active' ? 'Hoạt động' : 'Đã lưu trữ'}
                                </span>
                              </div>
                              
                              {rec.recommendations && rec.recommendations.recommendations && (
                                <div className="space-y-3">
                                  {rec.recommendations.recommendations.slice(0, 3).map((course, courseIndex) => (
                                    <div key={courseIndex} className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                      <h6 className="font-bold text-gray-800 mb-1">{course.title}</h6>
                                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                                      <div className="flex gap-2 flex-wrap">
                                        {course.grade_level && (
                                          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md">
                                            {course.grade_level}
                                          </span>
                                        )}
                                        {course.subject && (
                                          <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md">
                                            {course.subject}
                                          </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-md ${
                                          course.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                                          course.priority === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                                          'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                        }`}>
                                          {course.priority === 'high' ? 'Ưu tiên cao' :
                                           course.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  {rec.recommendations.recommendations.length > 3 && (
                                    <p className="text-sm text-gray-600 font-medium text-center py-2">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/50">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Chi tiết Khảo sát</h2>
                  <p className="text-blue-100 text-lg">
                    Xem đầy đủ câu trả lời và phân tích
                  </p>
                </div>
                <button
                  onClick={handleCloseSurveyDetail}
                  className="text-blue-200 hover:text-white transition-all duration-300 hover:scale-110 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
              {/* Survey Info */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        #{surveyHistory.findIndex(s => s.id === selectedSurvey.id) + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Khảo sát #{surveyHistory.findIndex(s => s.id === selectedSurvey.id) + 1}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-2 font-medium">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        {formatDate(selectedSurvey.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${
                      selectedSurvey.status === 'completed' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                    }`}>
                      {selectedSurvey.status === 'completed' ? 'Hoàn thành' : 'Đang làm'}
                    </span>
                    {selectedSurvey.isAdditional && (
                      <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
                        Khảo sát bổ sung
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* All Answers */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">Q</span>
                  </div>
                  Tất cả câu trả lời:
                </h4>
                
                {surveyQuestions.map((question, index) => {
                  const answer = selectedSurvey.answers[question.id];
                  if (!answer) return null;

                  return (
                    <div key={question.id} className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-800 mb-3 text-lg">
                            {question.question}
                          </h5>
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200/50">
                            <p className="text-gray-700 font-medium">
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
                  <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    Gợi ý từ AI:
                  </h4>
                  <div className="space-y-4">
                    {getRecommendationsForSurvey(selectedSurvey.id).map((rec, recIndex) => (
                      <div key={rec.id} className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm p-5 rounded-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-bold text-blue-800 text-lg flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              #{recIndex + 1}
                            </span>
                            Gợi ý #{recIndex + 1}
                          </h5>
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md ${
                            rec.status === 'active' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                          }`}>
                            {rec.status === 'active' ? 'Hoạt động' : 'Đã lưu trữ'}
                          </span>
                        </div>
                        
                        {rec.recommendations && rec.recommendations.recommendations && (
                          <div className="space-y-3">
                            {rec.recommendations.recommendations.map((course, courseIndex) => (
                              <div key={courseIndex} className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                <h6 className="font-bold text-gray-800 mb-1">{course.title}</h6>
                                <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                                <div className="flex gap-2 flex-wrap">
                                  {course.grade_level && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md">
                                      {course.grade_level}
                                    </span>
                                  )}
                                  {course.subject && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md">
                                      {course.subject}
                                    </span>
                                  )}
                                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-md ${
                                    course.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                                    course.priority === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                                    'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
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
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/50 flex justify-end rounded-b-2xl">
              <button
                onClick={handleCloseSurveyDetail}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Survey Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/50">
            <UserSurvey
              onComplete={handleSurveyComplete}
              onSkip={handleSurveySkip}
            />
          </div>
        </div>
      )}

      {/* Recommendations Modal */}
      {showRecommendationsModal && surveyRecommendations && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/50">
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
