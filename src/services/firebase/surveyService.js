import firestoreService from './firestoreService';
import aiService from './aiService';
import { getAllGrades, SUBJECTS_BY_LEVEL } from '../../constants/educationConstants';

class SurveyService {
  constructor() {
    this.firestore = firestoreService;
    this.ai = aiService;
  }

  // Kiểm tra xem người dùng có cần làm khảo sát không (1 tháng/lần)
  async checkSurveyEligibility(userId) {
    try {
      console.log('🔍 Checking survey eligibility for user:', userId);
      
      // Lấy khảo sát gần nhất của user
      const surveys = await this.firestore.getCollection('user_surveys');
      const userSurveys = surveys.filter(survey => survey.userId === userId);
      
      if (userSurveys.length === 0) {
        console.log('✅ No previous surveys found - eligible for first survey');
        return { shouldShowSurvey: true, reason: 'first_survey' };
      }

      // Sắp xếp theo thời gian tạo (mới nhất trước)
      userSurveys.sort((a, b) => {
        const getTime = (survey) => {
          if (survey.createdAt?.seconds) {
            return survey.createdAt.seconds * 1000;
          }
          if (typeof survey.createdAt === 'string') {
            return new Date(survey.createdAt).getTime();
          }
          if (survey.createdAt instanceof Date) {
            return survey.createdAt.getTime();
          }
          return 0;
        };
        return getTime(b) - getTime(a);
      });

      const lastSurvey = userSurveys[0];
      const lastSurveyTime = this.getTimestamp(lastSurvey.createdAt);
      const now = new Date().getTime();
      const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 30 ngày

      if (now - lastSurveyTime >= oneMonthInMs) {
        console.log('✅ Last survey was more than 30 days ago - eligible');
        return { shouldShowSurvey: true, reason: 'monthly_survey' };
      } else {
        const daysSinceLastSurvey = Math.floor((now - lastSurveyTime) / (24 * 60 * 60 * 1000));
        console.log(`⚠️ Last survey was ${daysSinceLastSurvey} days ago - can do additional survey`);
        return { 
          shouldShowSurvey: true, // Cho phép làm khảo sát thêm
          reason: 'additional_survey',
          daysUntilEligible: 30 - daysSinceLastSurvey,
          lastSurveyDate: new Date(lastSurveyTime).toLocaleDateString('vi-VN'),
          isAdditional: true // Đánh dấu đây là khảo sát thêm
        };
      }
    } catch (error) {
      console.error('Error checking survey eligibility:', error);
      // Default to showing survey if error
      return { shouldShowSurvey: true, reason: 'error_fallback' };
    }
  }

  // Lưu kết quả khảo sát và tạo gợi ý AI
  async submitSurvey(userId, answers, isAdditional = false) {
    try {
      console.log('📝 Submitting survey for user:', userId);
      
      // Tạo dữ liệu khảo sát
    const surveyData = {
      userId,
      answers,
      createdAt: new Date(),
      status: 'completed',
      isAdditional // Đánh dấu khảo sát bổ sung
    };

      // Lưu khảo sát vào database
      const surveyResult = await this.firestore.createDocument('user_surveys', surveyData);
      console.log('✅ Survey saved successfully:', surveyResult);

      // Tạo gợi ý AI
      console.log('🤖 Generating AI recommendations...');
      const recommendations = await this.generateRecommendations(userId, answers);
      console.log('✅ AI recommendations generated:', recommendations);
      
      // Lưu gợi ý vào database
      const recommendationData = {
        userId,
        surveyId: surveyResult.id,
        recommendations,
        createdAt: new Date(),
        status: 'active'
      };

      const recommendationResult = await this.firestore.createDocument('user_recommendations', recommendationData);
      console.log('✅ Recommendations saved successfully:', recommendationResult);

      console.log('✅ Survey submitted successfully');
      return {
        success: true,
        surveyId: surveyResult.id,
        recommendations
      };
    } catch (error) {
      console.error('Error submitting survey:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Tạo gợi ý khóa học dựa trên kết quả khảo sát
  async generateRecommendations(userId, answers) {
    try {
      console.log('🤖 Generating AI recommendations for user:', userId);
      console.log('📝 Survey answers:', answers);
      
      // Tạo prompt cho AI
      const prompt = this.createRecommendationPrompt(answers);
      console.log('📋 AI Prompt:', prompt);
      
      // Gọi AI service
      const chatId = `survey_${userId}_${Date.now()}`;
      console.log('💬 Calling AI service with chatId:', chatId);
      
      const result = await this.ai.sendMessage(chatId, prompt, []);
      console.log('🤖 AI Service result:', result);
      
      if (result.success) {
        // Parse AI response để lấy gợi ý
        console.log('📄 Parsing AI response:', result.content);
        const recommendations = this.parseAIResponse(result.content);
        console.log('✅ Parsed recommendations:', recommendations);
        return recommendations;
      } else {
        console.log('❌ AI service failed, using fallback');
        // Fallback recommendations nếu AI lỗi
        return this.getFallbackRecommendations(answers);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      console.log('🔄 Using fallback recommendations due to error');
      return this.getFallbackRecommendations(answers);
    }
  }

  // Tạo prompt cho AI
  createRecommendationPrompt(answers) {
    return `Bạn là một chuyên gia giáo dục và tư vấn học tập. Dựa trên kết quả khảo sát của một học sinh, hãy phân tích và đưa ra gợi ý khóa học phù hợp với chương trình học cụ thể.

KẾT QUẢ KHẢO SÁT:
- Lớp học: ${answers.grade_level || 'Chưa trả lời'}
- Môn học tập trung: ${Array.isArray(answers.subject_focus) ? answers.subject_focus.join(', ') : answers.subject_focus || 'Chưa trả lời'}
- Trình độ toán học: ${answers.math_level || 'Chưa trả lời'}
- Mục tiêu học tập: ${Array.isArray(answers.learning_goals) ? answers.learning_goals.join(', ') : answers.learning_goals || 'Chưa trả lời'}
- Mức độ khó ưa thích: ${answers.difficulty_preference || 'Chưa trả lời'}
- Phong cách học tập: ${answers.learning_style || 'Chưa trả lời'}
- Thời gian học mỗi tuần: ${answers.time_commitment || 'Chưa trả lời'}
- Lĩnh vực cần cải thiện: ${Array.isArray(answers.weak_areas) ? answers.weak_areas.join(', ') : answers.weak_areas || 'Chưa trả lời'}
- Mức độ động lực: ${answers.motivation_level || 'Chưa trả lời'}

Hãy phân tích và đưa ra gợi ý theo format JSON sau:

{
  "analysis": {
    "grade_level_insights": "phân tích về lớp học và chương trình học",
    "subject_strengths": ["điểm mạnh về môn học"],
    "subject_weaknesses": ["điểm cần cải thiện về môn học"],
    "learning_style_insights": "phân tích phong cách học tập",
    "motivation_level": "đánh giá mức độ động lực"
  },
  "recommendations": [
    {
      "category": "tên danh mục khóa học",
      "title": "tên khóa học cụ thể theo lớp",
      "description": "mô tả ngắn về khóa học phù hợp với chương trình lớp học",
      "grade_level": "lớp học phù hợp",
      "subject": "môn học chính",
      "difficulty": "beginner/intermediate/advanced",
      "estimated_duration": "thời gian ước tính",
      "reason": "lý do gợi ý khóa học này dựa trên lớp học và môn học",
      "priority": "high/medium/low"
    }
  ],
  "study_plan": {
    "weekly_schedule": "lịch học đề xuất phù hợp với lớp học",
    "focus_subjects": ["các môn học cần tập trung theo lớp"],
    "grade_specific_tips": ["mẹo học tập phù hợp với lớp học"],
    "exam_preparation": "lời khuyên chuẩn bị thi cử theo lớp"
  }
}

QUAN TRỌNG: 
- Đưa ra gợi ý khóa học cụ thể theo lớp học (ví dụ: "Toán lớp 10 - Hàm số và đồ thị")
- Phù hợp với chương trình học của lớp đó
- Bao gồm cả môn học chính và môn học phụ
- Đưa ra 3-5 khóa học cụ thể phù hợp với lớp học và môn học được chọn.`;
  }

  // Parse response từ AI
  parseAIResponse(content) {
    try {
      // Tìm JSON trong response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getFallbackRecommendations({});
    }
  }

  // Gợi ý fallback nếu AI lỗi
  getFallbackRecommendations(answers) {
    const gradeLevel = answers.grade_level || 'grade_10';
    const subjectFocus = Array.isArray(answers.subject_focus) ? answers.subject_focus : ['mathematics'];
    const mathLevel = answers.math_level || 'intermediate';
    const weakAreas = Array.isArray(answers.weak_areas) ? answers.weak_areas : [];

    let recommendations = [];

    // Lấy thông tin lớp học từ constants
    const gradeNumber = gradeLevel.replace('grade_', '');
    const gradeInfo = getAllGrades().find(g => g.gradeNumber.toString() === gradeNumber);
    const gradeName = gradeInfo ? gradeInfo.grade : (gradeLevel === 'university' ? 'Đại học' : 'Khác');

    // Lấy thông tin môn học từ constants
    const allSubjects = Object.values(SUBJECTS_BY_LEVEL).flatMap(subjects => subjects);
    const uniqueSubjects = allSubjects.filter((subject, index, self) => 
      index === self.findIndex(s => s.id === subject.id)
    );

    // Gợi ý dựa trên môn học được chọn
    subjectFocus.forEach(subjectId => {
      const subject = uniqueSubjects.find(s => s.id === subjectId);
      if (subject) {
        recommendations.push({
          category: subject.name,
          title: `${subject.name} ${gradeName}`,
          description: `Học ${subject.name} phù hợp với chương trình ${gradeName}`,
          grade_level: gradeName,
          subject: subject.name,
          difficulty: mathLevel === 'beginner' ? 'beginner' : 'intermediate',
          estimated_duration: '6-8 tuần',
          reason: `Phù hợp với chương trình ${subject.name} ${gradeName}`,
          priority: subjectId === 'math' ? 'high' : 'medium'
        });
      }
    });

    // Nếu không có gợi ý nào, tạo gợi ý chung
    if (recommendations.length === 0) {
      recommendations.push({
        category: 'Tổng hợp',
        title: `Khóa học tổng hợp ${gradeName}`,
        description: `Ôn tập và nâng cao kiến thức tổng hợp cho ${gradeName}`,
        grade_level: gradeName,
        subject: 'Tổng hợp',
        difficulty: 'intermediate',
        estimated_duration: '8-12 tuần',
        reason: `Phù hợp với trình độ tổng thể của ${gradeName}`,
        priority: 'high'
      });
    }

    return {
      analysis: {
        grade_level_insights: `Học sinh đang học ${gradeName}, cần tập trung vào chương trình học phù hợp`,
        subject_strengths: ['Có động lực học tập'],
        subject_weaknesses: weakAreas,
        learning_style_insights: 'Cần phương pháp học phù hợp với từng môn học',
        motivation_level: answers.motivation_level || 'medium'
      },
      recommendations,
      study_plan: {
        weekly_schedule: 'Học 3-4 buổi/tuần, mỗi buổi 1-2 giờ',
        focus_subjects: subjectFocus,
        grade_specific_tips: [
          `Tập trung vào chương trình học ${gradeName}`,
          'Làm bài tập theo từng môn học',
          'Ôn tập định kỳ theo chương trình'
        ],
        exam_preparation: `Chuẩn bị cho các kỳ thi theo chương trình ${gradeName}`
      }
    };
  }

  // Lấy gợi ý gần nhất của user
  async getUserRecommendations(userId) {
    try {
      console.log('🔍 Getting recommendations for user:', userId);
      const recommendations = await this.firestore.getCollection('user_recommendations');
      console.log('📋 All recommendations:', recommendations);
      
      const userRecommendations = recommendations.filter(rec => rec.userId === userId);
      console.log('👤 User recommendations:', userRecommendations);
      
      if (userRecommendations.length === 0) {
        console.log('❌ No recommendations found for user');
        return { success: false, error: 'No recommendations found' };
      }

      // Sắp xếp theo thời gian tạo (mới nhất trước)
      userRecommendations.sort((a, b) => {
        const getTime = (rec) => {
          if (rec.createdAt?.seconds) {
            return rec.createdAt.seconds * 1000;
          }
          if (typeof rec.createdAt === 'string') {
            return new Date(rec.createdAt).getTime();
          }
          if (rec.createdAt instanceof Date) {
            return rec.createdAt.getTime();
          }
          return 0;
        };
        return getTime(b) - getTime(a);
      });

      console.log('✅ Found recommendations for user:', userRecommendations[0]);
      return {
        success: true,
        recommendations: userRecommendations[0].recommendations
      };
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Lấy lịch sử khảo sát của user
  async getUserSurveyHistory(userId) {
    try {
      console.log('📚 Getting survey history for user:', userId);
      const surveys = await this.firestore.getCollection('user_surveys');
      const userSurveys = surveys.filter(survey => survey.userId === userId);
      
      // Sắp xếp theo thời gian tạo (mới nhất trước)
      userSurveys.sort((a, b) => {
        const getTime = (survey) => {
          if (survey.createdAt?.seconds) {
            return survey.createdAt.seconds * 1000;
          }
          if (typeof survey.createdAt === 'string') {
            return new Date(survey.createdAt).getTime();
          }
          if (survey.createdAt instanceof Date) {
            return survey.createdAt.getTime();
          }
          return 0;
        };
        return getTime(b) - getTime(a);
      });

      console.log('✅ Found survey history:', userSurveys.length, 'surveys');
      return {
        success: true,
        surveys: userSurveys
      };
    } catch (error) {
      console.error('Error getting survey history:', error);
      return {
        success: false,
        error: error.message,
        surveys: []
      };
    }
  }

  // Lấy tất cả recommendations của user
  async getAllUserRecommendations(userId) {
    try {
      console.log('📋 Getting all recommendations for user:', userId);
      const recommendations = await this.firestore.getCollection('user_recommendations');
      const userRecommendations = recommendations.filter(rec => rec.userId === userId);
      
      // Sắp xếp theo thời gian tạo (mới nhất trước)
      userRecommendations.sort((a, b) => {
        const getTime = (rec) => {
          if (rec.createdAt?.seconds) {
            return rec.createdAt.seconds * 1000;
          }
          if (typeof rec.createdAt === 'string') {
            return new Date(rec.createdAt).getTime();
          }
          if (rec.createdAt instanceof Date) {
            return rec.createdAt.getTime();
          }
          return 0;
        };
        return getTime(b) - getTime(a);
      });

      console.log('✅ Found recommendations:', userRecommendations.length, 'recommendations');
      return {
        success: true,
        recommendations: userRecommendations
      };
    } catch (error) {
      console.error('Error getting all recommendations:', error);
      return {
        success: false,
        error: error.message,
        recommendations: []
      };
    }
  }

  // Lấy survey và recommendations theo surveyId
  async getSurveyWithRecommendations(surveyId) {
    try {
      console.log('🔍 Getting survey with recommendations for surveyId:', surveyId);
      
      // Lấy survey
      const surveyResult = await this.firestore.getDocument('user_surveys', surveyId);
      if (!surveyResult.success) {
        throw new Error('Survey not found');
      }

      // Lấy recommendations cho survey này
      const recommendations = await this.firestore.getCollection('user_recommendations');
      const surveyRecommendations = recommendations.filter(rec => rec.surveyId === surveyId);

      console.log('✅ Found survey and recommendations');
      return {
        success: true,
        survey: surveyResult.data,
        recommendations: surveyRecommendations
      };
    } catch (error) {
      console.error('Error getting survey with recommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cập nhật trạng thái recommendation
  async updateRecommendationStatus(recommendationId, status) {
    try {
      console.log('🔄 Updating recommendation status:', recommendationId, 'to', status);
      
      await this.firestore.updateDocument('user_recommendations', recommendationId, {
        status,
        updatedAt: new Date()
      });

      console.log('✅ Recommendation status updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating recommendation status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Xóa recommendation cũ (archived)
  async archiveOldRecommendations(userId, keepLatest = 3) {
    try {
      console.log('🗄️ Archiving old recommendations for user:', userId);
      
      const result = await this.getAllUserRecommendations(userId);
      if (!result.success) {
        throw new Error(result.error);
      }

      const recommendations = result.recommendations;
      
      // Giữ lại recommendations mới nhất, archive các cái cũ
      if (recommendations.length > keepLatest) {
        const toArchive = recommendations.slice(keepLatest);
        
        for (const rec of toArchive) {
          await this.updateRecommendationStatus(rec.id, 'archived');
        }
        
        console.log(`✅ Archived ${toArchive.length} old recommendations`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error archiving old recommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper function để convert timestamp
  getTimestamp(timestamp) {
    if (timestamp?.seconds) {
      return timestamp.seconds * 1000;
    }
    if (typeof timestamp === 'string') {
      return new Date(timestamp).getTime();
    }
    if (timestamp instanceof Date) {
      return timestamp.getTime();
    }
    return 0;
  }
}

export default new SurveyService();
