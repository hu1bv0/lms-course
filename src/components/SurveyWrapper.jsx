import React, { useState, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSurvey } from '../hooks/useSurvey';
import SurveyFlow from '../modules/survey/components/SurveyFlow';

const SurveyWrapper = memo(({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading, role } = useAuth();
  const { shouldShowSurvey, isLoading: surveyLoading, surveyEligibility } = useSurvey();
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  // Không hiển thị khảo sát tự động nếu đang ở trang /survey
  const isOnSurveyPage = location.pathname === '/survey';

  const handleSurveyComplete = () => {
    setSurveyCompleted(true);
  };

  // Hiển thị loading khi đang kiểm tra auth hoặc survey eligibility
  if (authLoading || surveyLoading) {
    return children;
  }

  // Chỉ hiển thị khảo sát cho học sinh (student role) và không ở trang /survey
  // Chỉ hiển thị khảo sát chính thức, không hiển thị khảo sát bổ sung ở dashboard
  if (isAuthenticated && role === 'student' && shouldShowSurvey && !surveyCompleted && !isOnSurveyPage) {
    // Kiểm tra xem có phải khảo sát bổ sung không
    const isAdditionalSurvey = surveyEligibility?.isAdditional;
    
    // Chỉ hiển thị khảo sát chính thức ở dashboard
    if (!isAdditionalSurvey) {
      return (
        <>
          <SurveyFlow onComplete={handleSurveyComplete} />
          {children}
        </>
      );
    }
  }

  // Hiển thị nội dung chính cho tất cả user khác
  return children;
});

SurveyWrapper.displayName = 'SurveyWrapper';

export default SurveyWrapper;
