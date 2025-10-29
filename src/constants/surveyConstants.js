import { getAllGrades, SUBJECTS_BY_LEVEL } from './educationConstants';

/**
 * Danh sách câu hỏi khảo sát
 * Đây là source of truth chung cho tất cả các component survey
 */
export const getSurveyQuestions = () => [
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

/**
 * Utility function để map answer key sang label (giá trị hiển thị)
 * @param {string} questionId - ID của câu hỏi
 * @param {string|string[]} answerValue - Giá trị answer (có thể là string hoặc array)
 * @returns {string} - Giá trị đã được map sang label tiếng Việt
 */
export const getAnswerText = (questionId, answerValue) => {
  const surveyQuestions = getSurveyQuestions();
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

