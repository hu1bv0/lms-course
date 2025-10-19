// Constants for Education System

// Grade levels by education level
export const EDUCATION_LEVELS = {
  PRIMARY: {
    id: 'primary',
    name: 'Cấp 1',
    grades: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'],
    gradeNumbers: [1, 2, 3, 4, 5]
  },
  SECONDARY: {
    id: 'secondary', 
    name: 'Cấp 2',
    grades: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
    gradeNumbers: [6, 7, 8, 9]
  },
  HIGH_SCHOOL: {
    id: 'high_school',
    name: 'Cấp 3', 
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    gradeNumbers: [10, 11, 12]
  }
};

// Subjects by education level
export const SUBJECTS_BY_LEVEL = {
  primary: [
    { id: 'math', name: 'Toán học', icon: '🔢' },
    { id: 'vietnamese', name: 'Tiếng Việt', icon: '📚' },
    { id: 'science', name: 'Khoa học', icon: '🔬' },
    { id: 'social', name: 'Xã hội', icon: '🌍' },
    { id: 'english', name: 'Tiếng Anh', icon: '🇬🇧' },
    { id: 'art', name: 'Mỹ thuật', icon: '🎨' },
    { id: 'music', name: 'Âm nhạc', icon: '🎵' },
    { id: 'pe', name: 'Thể dục', icon: '⚽' }
  ],
  secondary: [
    { id: 'math', name: 'Toán học', icon: '🔢' },
    { id: 'literature', name: 'Ngữ văn', icon: '📖' },
    { id: 'english', name: 'Tiếng Anh', icon: '🇬🇧' },
    { id: 'physics', name: 'Vật lý', icon: '⚡' },
    { id: 'chemistry', name: 'Hóa học', icon: '🧪' },
    { id: 'biology', name: 'Sinh học', icon: '🧬' },
    { id: 'history', name: 'Lịch sử', icon: '📜' },
    { id: 'geography', name: 'Địa lý', icon: '🗺️' },
    { id: 'civics', name: 'Giáo dục công dân', icon: '🏛️' },
    { id: 'technology', name: 'Công nghệ', icon: '💻' },
    { id: 'art', name: 'Mỹ thuật', icon: '🎨' },
    { id: 'music', name: 'Âm nhạc', icon: '🎵' },
    { id: 'pe', name: 'Thể dục', icon: '⚽' }
  ],
  high_school: [
    { id: 'math', name: 'Toán học', icon: '🔢' },
    { id: 'literature', name: 'Ngữ văn', icon: '📖' },
    { id: 'english', name: 'Tiếng Anh', icon: '🇬🇧' },
    { id: 'physics', name: 'Vật lý', icon: '⚡' },
    { id: 'chemistry', name: 'Hóa học', icon: '🧪' },
    { id: 'biology', name: 'Sinh học', icon: '🧬' },
    { id: 'history', name: 'Lịch sử', icon: '📜' },
    { id: 'geography', name: 'Địa lý', icon: '🗺️' },
    { id: 'civics', name: 'Giáo dục công dân', icon: '🏛️' },
    { id: 'technology', name: 'Công nghệ', icon: '💻' },
    { id: 'informatics', name: 'Tin học', icon: '💻' },
    { id: 'economics', name: 'Kinh tế pháp luật', icon: '💰' },
    { id: 'art', name: 'Mỹ thuật', icon: '🎨' },
    { id: 'music', name: 'Âm nhạc', icon: '🎵' },
    { id: 'pe', name: 'Thể dục', icon: '⚽' }
  ]
};

// Content types
export const CONTENT_TYPES = {
  LESSON: 'lesson',
  EXAM: 'exam'
};

// Content access levels
export const ACCESS_LEVELS = {
  FREE: 'free',
  PREMIUM: 'premium'
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: { id: 'easy', name: 'Dễ', color: 'green' },
  MEDIUM: { id: 'medium', name: 'Trung bình', color: 'yellow' },
  HARD: { id: 'hard', name: 'Khó', color: 'red' }
};

// Helper functions
export const getSubjectsByLevel = (levelId) => {
  return SUBJECTS_BY_LEVEL[levelId] || [];
};

export const getEducationLevel = (levelId) => {
  return Object.values(EDUCATION_LEVELS).find(level => level.id === levelId);
};

export const getAllGrades = () => {
  return Object.values(EDUCATION_LEVELS).flatMap(level => 
    level.grades.map((grade, index) => ({
      grade,
      gradeNumber: level.gradeNumbers[index],
      levelId: level.id,
      levelName: level.name
    }))
  );
};

export const getGradeByNumber = (gradeNumber) => {
  const allGrades = getAllGrades();
  return allGrades.find(grade => grade.gradeNumber === gradeNumber);
};
