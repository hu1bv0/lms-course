# Hệ thống Khảo sát Người dùng với AI Gợi ý Khóa học

## Tổng quan

Hệ thống khảo sát người dùng được thiết kế để đánh giá trình độ học tập và đưa ra gợi ý khóa học phù hợp dựa trên AI. **Khảo sát chỉ dành cho học sinh (student role)** và sẽ được thực hiện 1 tháng/lần sau khi đăng nhập.

## Tính năng chính

### 1. Khảo sát Đánh giá Kỹ năng
- **9 câu hỏi chính** đánh giá:
  - **Lớp học** (sử dụng `educationConstants.js`)
  - **Môn học tập trung** (sử dụng `SUBJECTS_BY_LEVEL`)
  - Trình độ toán học hiện tại
  - Mục tiêu học tập
  - Mức độ khó ưa thích
  - Phong cách học tập
  - Thời gian học mỗi tuần
  - Lĩnh vực cần cải thiện
  - Mức độ động lực

### 2. AI Phân tích và Gợi ý
- Sử dụng **Gemini AI** để phân tích kết quả khảo sát
- Đưa ra gợi ý khóa học cá nhân hóa
- Phân tích điểm mạnh và điểm cần cải thiện
- Tạo kế hoạch học tập phù hợp

### 3. Quản lý Thời gian
- Khảo sát được thực hiện **1 tháng/lần** cho học sinh
- Tự động kiểm tra thời gian khảo sát cuối
- Hiển thị thông báo khi chưa đến thời gian khảo sát tiếp theo
- **Admin và Parent không cần làm khảo sát**

## Cấu trúc File

```
src/
├── modules/survey/
│   ├── components/
│   │   ├── UserSurvey.jsx          # Component khảo sát chính
│   │   ├── CourseRecommendations.jsx # Hiển thị gợi ý khóa học
│   │   └── SurveyFlow.jsx          # Quản lý flow khảo sát
│   └── features/
│       └── index.jsx               # Export chính
├── services/firebase/
│   └── surveyService.js            # Service quản lý khảo sát
├── hooks/
│   └── useSurvey.js               # Hook quản lý trạng thái khảo sát
└── components/
    └── SurveyWrapper.jsx          # Wrapper tích hợp vào routing
```

## Cách sử dụng

### 1. Tích hợp vào Routing
Khảo sát đã được tích hợp tự động vào flow đăng nhập thông qua `SurveyWrapper`:

```jsx
// Trong routes/index.jsx
import SurveyWrapper from "../components/SurveyWrapper";

const RequiredAuth = ({ children, path, requiredRoles = [] }) => {
  // ... auth logic
  return <SurveyWrapper>{children}</SurveyWrapper>;
};
```

### 2. Sử dụng Hook
```jsx
import { useSurvey } from '../hooks/useSurvey';

const MyComponent = () => {
  const { 
    shouldShowSurvey, 
    submitSurvey, 
    getRecommendations,
    isLoading 
  } = useSurvey();

  // Sử dụng các function và state từ hook
};
```

### 3. Truy cập Trực tiếp
```jsx
import SurveyFlow from '../modules/survey/components/SurveyFlow';

const MyPage = () => {
  return (
    <SurveyFlow 
      onComplete={(recommendations) => {
        console.log('Survey completed:', recommendations);
      }}
    />
  );
};
```

## Database Schema

### Collections

#### `user_surveys` - Lưu trữ kết quả khảo sát
```javascript
{
  id: string, // Auto-generated document ID
  userId: string, // ID của học sinh
  answers: {
    grade_level: string, // grade_1, grade_2, ..., grade_12, university, other
    subject_focus: string[], // math, physics, chemistry, english, etc.
    math_level: string,
    learning_goals: string[],
    difficulty_preference: string,
    learning_style: string,
    time_commitment: string,
    weak_areas: string[],
    motivation_level: string
  },
  createdAt: Date, // Thời gian tạo
  updatedAt: Date, // Thời gian cập nhật
  status: 'completed' | 'in_progress' // Trạng thái khảo sát
}
```

#### `user_recommendations` - Lưu trữ gợi ý từ AI
```javascript
{
  id: string, // Auto-generated document ID
  userId: string, // ID của học sinh
  surveyId: string, // ID của khảo sát liên quan
  recommendations: {
    analysis: {
      grade_level_insights: string,
      subject_strengths: string[],
      subject_weaknesses: string[],
      learning_style_insights: string,
      motivation_level: string
    },
    recommendations: [
      {
        category: string,
        title: string,
        description: string,
        grade_level: string,
        subject: string,
        difficulty: 'beginner' | 'intermediate' | 'advanced',
        estimated_duration: string,
        reason: string,
        priority: 'high' | 'medium' | 'low'
      }
    ],
    study_plan: {
      weekly_schedule: string,
      focus_subjects: string[],
      grade_specific_tips: string[],
      exam_preparation: string
    }
  },
  createdAt: Date, // Thời gian tạo
  updatedAt: Date, // Thời gian cập nhật
  status: 'active' | 'archived' // Trạng thái gợi ý
}
```

## API Endpoints

### Survey Service Methods

```javascript
// Kiểm tra eligibility
await surveyService.checkSurveyEligibility(userId)

// Submit khảo sát
await surveyService.submitSurvey(userId, answers)

// Lấy gợi ý mới nhất
await surveyService.getUserRecommendations(userId)

// Lấy lịch sử khảo sát
await surveyService.getUserSurveyHistory(userId)

// Lấy tất cả gợi ý
await surveyService.getAllUserRecommendations(userId)

// Lấy survey với gợi ý theo surveyId
await surveyService.getSurveyWithRecommendations(surveyId)

// Cập nhật trạng thái gợi ý
await surveyService.updateRecommendationStatus(recommendationId, status)

// Archive gợi ý cũ
await surveyService.archiveOldRecommendations(userId, keepLatest)
```

## Vị trí trong Giao diện

### 1. **Khảo sát Tự động** (SurveyWrapper)
- **Vị trí**: Hiển thị tự động sau khi học sinh đăng nhập
- **Điều kiện**: Chỉ hiển thị cho học sinh (role: 'student')
- **Tần suất**: 1 tháng/lần
- **Cách hoạt động**: 
  - Wrap tất cả private routes
  - Kiểm tra eligibility tự động
  - Hiển thị overlay khi cần làm khảo sát

### 2. **Lịch sử Khảo sát** (SurveyHistory)
- **Vị trí**: Student Dashboard → Tab "Khảo sát"
- **URL**: `/student/survey-history`
- **Truy cập**: 
  - Từ Student Dashboard: Click tab "Khảo sát"
  - Hoặc truy cập trực tiếp: `/student/survey-history`
- **Chức năng**:
  - Xem tất cả khảo sát đã làm
  - Xem gợi ý AI cho từng khảo sát
  - Làm khảo sát mới (nếu chưa có)

### 3. **Navigation Structure**
```
Student Dashboard
├── Tổng quan
├── Khóa học của tôi  
├── Tất cả khóa học
├── Thành tích
├── Khảo sát ← (Tab mới)
└── AI Chatbot
```

## Cấu hình AI

Hệ thống sử dụng Gemini AI với prompt được tối ưu để:
- Phân tích kết quả khảo sát
- Đưa ra gợi ý khóa học phù hợp
- Tạo kế hoạch học tập cá nhân hóa

## Tính năng nâng cao

### 1. Fallback Recommendations
Nếu AI không hoạt động, hệ thống sẽ đưa ra gợi ý cơ bản dựa trên:
- Trình độ toán học
- Lĩnh vực cần cải thiện
- Mục tiêu học tập

### 2. Responsive Design
- Giao diện thân thiện trên mọi thiết bị
- Progress bar hiển thị tiến độ
- Animation mượt mà

### 3. Error Handling
- Xử lý lỗi gracefully
- Fallback khi AI không khả dụng
- Loading states phù hợp

## Mở rộng trong tương lai

1. **Thêm loại khảo sát khác**: Khoa học, Ngôn ngữ, v.v.
2. **Tích hợp với hệ thống khóa học**: Tự động đăng ký khóa học được gợi ý
3. **Theo dõi tiến độ**: So sánh kết quả khảo sát theo thời gian
4. **Gợi ý động**: Cập nhật gợi ý dựa trên hoạt động học tập

## Lưu ý

- Đảm bảo `VITE_GEMINI_API_KEY` được cấu hình trong `.env`
- Firebase collections sẽ được tạo tự động khi có document đầu tiên
- **Khảo sát chỉ hiển thị cho học sinh (role: 'student')**
- Admin và Parent sẽ không thấy khảo sát
- Thời gian khảo sát được tính theo UTC
