import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useSurvey } from '../../../hooks/useSurvey';
import UserSurvey from './UserSurvey';
import CourseRecommendations from './CourseRecommendations';
import Loading from '../../../components/Loading';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../../routes/endPoints';

const SurveyFlow = ({ onComplete }) => {
  const { user } = useAuth();
  const { surveyEligibility, isLoading, submitSurvey, getRecommendations } = useSurvey();
  const navigate = useNavigate();
  const [showSurvey, setShowSurvey] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  // Hiển thị survey nếu eligible
  React.useEffect(() => {
    if (surveyEligibility?.shouldShowSurvey) {
      setShowSurvey(true);
    } else if (surveyEligibility && !surveyEligibility.shouldShowSurvey) {
      // Không cần làm khảo sát, có thể hiển thị thông báo hoặc chuyển tiếp
      handleSurveyComplete();
    }
  }, [surveyEligibility]);

  const handleSurveyComplete = (surveyRecommendations = null) => {
    setShowSurvey(false);
    
    if (surveyRecommendations) {
      setRecommendations(surveyRecommendations);
      setShowRecommendations(true);
    } else {
      // Không có gợi ý từ khảo sát, có thể lấy gợi ý cũ hoặc chuyển tiếp
      loadExistingRecommendations();
    }
  };

  const handleSurveySkip = () => {
    setShowSurvey(false);
    loadExistingRecommendations();
  };

  const loadExistingRecommendations = async () => {
    if (!user) {
      onComplete?.();
      return;
    }

    try {
      const existingRecommendations = await getRecommendations();
      if (existingRecommendations) {
        setRecommendations(existingRecommendations);
        setShowRecommendations(true);
      } else {
        // Không có gợi ý cũ, chuyển tiếp luôn
        onComplete?.();
      }
    } catch (error) {
      console.error('Error loading existing recommendations:', error);
      onComplete?.();
    }
  };

  const handleRecommendationsClose = () => {
    setShowRecommendations(false);
    setRecommendations(null);
    onComplete?.();
  };

  const handleCourseEnroll = (course) => {
    // TODO: Implement course enrollment logic
    console.log('Enrolling in course:', course);
    // Có thể chuyển đến trang đăng ký khóa học hoặc hiển thị modal đăng ký
    alert(`Đăng ký khóa học: ${course.title}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {showSurvey && (
        <UserSurvey
          onComplete={handleSurveyComplete}
          onSkip={handleSurveySkip}
        />
      )}
      
      {showRecommendations && (
        <CourseRecommendations
          recommendations={recommendations}
          onClose={handleRecommendationsClose}
          onEnroll={handleCourseEnroll}
        />
      )}
      
      {/* Additional Survey Message */}
      {surveyEligibility && surveyEligibility.shouldShowSurvey && surveyEligibility.isAdditional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <div className="text-blue-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Khảo sát bổ sung
                </h3>
                <p className="text-gray-600 mb-4">
                  Bạn có thể làm khảo sát thêm để cập nhật mục tiêu học tập của mình. 
                  Khảo sát chính thức tiếp theo sẽ có sau{' '}
                  <span className="font-semibold text-blue-600">
                    {surveyEligibility.daysUntilEligible} ngày
                  </span>
                  .
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Khảo sát cuối: {surveyEligibility.lastSurveyDate}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại Dashboard</span>
                  </button>
                  <button
                    onClick={() => setShowSurvey(true)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors"
                  >
                    Làm khảo sát thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Survey Not Available Message */}
      {surveyEligibility && !surveyEligibility.shouldShowSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Khảo sát tiếp theo
                </h3>
                <p className="text-gray-600 mb-4">
                  Bạn đã hoàn thành khảo sát gần đây. Khảo sát tiếp theo sẽ có sẵn sau{' '}
                  <span className="font-semibold text-blue-600">
                    {surveyEligibility.daysUntilEligible} ngày
                  </span>
                  .
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Khảo sát cuối: {surveyEligibility.lastSurveyDate}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại Dashboard</span>
                  </button>
                  <button
                    onClick={handleRecommendationsClose}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SurveyFlow;
