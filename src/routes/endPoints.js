export const ENDPOINTS = Object.freeze({
  AUTH: {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forget-password",
    SIGNIN: "/signin",
    SIGNIN_SUCCESS: "/signin-success",
    CHANGE_PASSWORD: "/change-password",
  },
  INDEX: "/",
  
  // Landing Page (Public)
  LANDING: {
    HOME: "/",
    NEWS: "/news",
  },
  
  // Admin Panel
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PAYMENTS: "/admin/payments",
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
  },
  
  // Parent Panel
  PARENT: {
    DASHBOARD: "/parent/dashboard",
    COURSES: "/parent/courses",
    COURSE_DETAIL: "/parent/course/:courseId",
    PROGRESS: "/parent/progress",
    ACHIEVEMENTS: "/parent/achievements",
    CHILDREN: "/parent/children",
    REPORTS: "/parent/reports",
    SETTINGS: "/parent/settings",
  },
  
  // Student Panel
  STUDENT: {
    DASHBOARD: "/student/dashboard",
    STUDENT_ROOT: "/student", // Root student route
    COURSES: "/student/courses",
    COURSE_DETAIL: "/student/course/:courseId",
    ACHIEVEMENTS: "/student/achievements",
    CHATBOT: "/student/chatbot",
    SETTINGS: "/student/settings",
  },
  
  // Shared Features
  SHARED: {
    PROFILE: "/profile",
    SUBSCRIPTION: "/subscription",
    PAYMENT: "/payment",
    CHATBOT: "/chatbot",
  },

});
