import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../../routes/endPoints';

const CourseRecommendations = ({ recommendations, onClose, onEnroll }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  if (!recommendations) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Đang tạo gợi ý khóa học...
            </h3>
            <p className="text-gray-600">
              AI đang phân tích kết quả khảo sát của bạn để đưa ra gợi ý phù hợp nhất.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { analysis, recommendations: courses, study_plan } = recommendations;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
                className="flex items-center gap-2 text-green-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại Dashboard</span>
              </button>
              <div className="h-6 w-px bg-green-300" />
              <div>
                <h2 className="text-2xl font-bold">Gợi ý khóa học cá nhân</h2>
                <p className="text-green-100 mt-1">
                  Dựa trên kết quả khảo sát của bạn
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-green-200 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Analysis Section */}
          {analysis && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Phân tích học tập của bạn
              </h3>
              
              {/* Grade Level Insights */}
              {analysis.grade_level_insights && (
                <div className="mb-4 bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">📚 Thông tin lớp học</h4>
                  <p className="text-indigo-700">{analysis.grade_level_insights}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Điểm mạnh về môn học</h4>
                  <ul className="text-blue-700">
                    {(analysis.subject_strengths || analysis.strengths || []).map((strength, index) => (
                      <li key={index} className="flex items-center mb-1">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Cần cải thiện</h4>
                  <ul className="text-orange-700">
                    {(analysis.subject_weaknesses || analysis.weaknesses || []).map((weakness, index) => (
                      <li key={index} className="flex items-center mb-1">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {analysis.learning_style_insights && (
                <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Phong cách học tập</h4>
                  <p className="text-purple-700">{analysis.learning_style_insights}</p>
                </div>
              )}
            </div>
          )}

          {/* Course Recommendations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              🎯 Khóa học được gợi ý
            </h3>
            <div className="grid gap-4">
              {courses?.map((course, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCourse === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCourse(selectedCourse === index ? null : index)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{course.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {course.grade_level || course.category}
                        </span>
                        {course.subject && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {course.subject}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(course.priority)}`}>
                        {course.priority === 'high' ? 'Ưu tiên cao' : 
                         course.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty === 'beginner' ? 'Cơ bản' :
                         course.difficulty === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{course.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>⏱️ {course.estimated_duration}</span>
                    <span>💡 {course.reason}</span>
                  </div>
                  
                  {selectedCourse === index && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEnroll?.(course);
                          }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                        >
                          Đăng ký ngay
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement course preview
                          }}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Xem trước
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Study Plan */}
          {study_plan && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📅 Kế hoạch học tập đề xuất
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Lịch học</h4>
                  <p className="text-gray-600">{study_plan.weekly_schedule}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Môn học tập trung</h4>
                  <ul className="text-gray-600">
                    {(study_plan.focus_subjects || study_plan.focus_areas || []).map((subject, index) => (
                      <li key={index}>• {subject}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Mẹo học tập</h4>
                  <ul className="text-gray-600">
                    {(study_plan.grade_specific_tips || study_plan.tips || []).map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Chuẩn bị thi cử</h4>
                  <p className="text-gray-600">{study_plan.exam_preparation || 'Tập trung vào bài tập và ôn tập định kỳ'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseRecommendations;
