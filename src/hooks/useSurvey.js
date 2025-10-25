import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import surveyService from '../services/firebase/surveyService';

export const useSurvey = () => {
  const { user, role } = useAuth();
  const [surveyEligibility, setSurveyEligibility] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasCheckedRef = useRef(false);
  const userIdRef = useRef(null);

  const checkEligibility = useCallback(async () => {
    // Chỉ check eligibility cho học sinh
    if (!user?.uid || role !== 'student') {
      setSurveyEligibility(null);
      hasCheckedRef.current = false;
      userIdRef.current = null;
      return;
    }

    // Chỉ check lại nếu user thay đổi hoặc chưa check lần nào
    if (userIdRef.current === user.uid && hasCheckedRef.current) {
      return;
    }

    userIdRef.current = user.uid;
    hasCheckedRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await surveyService.checkSurveyEligibility(user.uid);
      setSurveyEligibility(result);
    } catch (err) {
      setError(err.message);
      console.error('Error checking survey eligibility:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, role]);

  const submitSurvey = useCallback(async (answers) => {
    if (!user?.uid || role !== 'student') {
      throw new Error('User not authenticated or not a student');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Kiểm tra xem có phải khảo sát bổ sung không
      const eligibility = await surveyService.checkSurveyEligibility(user.uid);
      const isAdditional = eligibility?.isAdditional || false;
      
      const result = await surveyService.submitSurvey(user.uid, answers, isAdditional);
      if (result.success) {
        // Reset check flag để check lại eligibility
        hasCheckedRef.current = false;
        await checkEligibility();
        return result;
      } else {
        throw new Error(result.error || 'Failed to submit survey');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, role, checkEligibility]);

  const getRecommendations = useCallback(async () => {
    if (!user?.uid || role !== 'student') {
      throw new Error('User not authenticated or not a student');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await surveyService.getUserRecommendations(user.uid);
      if (result.success) {
        return result.recommendations;
      } else {
        throw new Error(result.error || 'No recommendations found');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, role]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  const getSurveyHistory = useCallback(async () => {
    if (!user?.uid || role !== 'student') {
      throw new Error('User not authenticated or not a student');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await surveyService.getUserSurveyHistory(user.uid);
      if (result.success) {
        return result.surveys;
      } else {
        throw new Error(result.error || 'No survey history found');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, role]);

  const getAllRecommendations = useCallback(async () => {
    if (!user?.uid || role !== 'student') {
      throw new Error('User not authenticated or not a student');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await surveyService.getAllUserRecommendations(user.uid);
      if (result.success) {
        return result.recommendations;
      } else {
        throw new Error(result.error || 'No recommendations found');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, role]);

  const getSurveyWithRecommendations = useCallback(async (surveyId) => {
    if (!user?.uid || role !== 'student') {
      throw new Error('User not authenticated or not a student');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await surveyService.getSurveyWithRecommendations(surveyId);
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Survey not found');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, role]);

  return {
    surveyEligibility,
    isLoading,
    error,
    checkEligibility,
    submitSurvey,
    getRecommendations,
    getSurveyHistory,
    getAllRecommendations,
    getSurveyWithRecommendations,
    shouldShowSurvey: surveyEligibility?.shouldShowSurvey || false,
    daysUntilEligible: surveyEligibility?.daysUntilEligible || 0,
    lastSurveyDate: surveyEligibility?.lastSurveyDate || null
  };
};
