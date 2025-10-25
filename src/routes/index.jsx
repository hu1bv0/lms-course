/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Loading from "../components/Loading";
import SimpleLoading from "../components/SimpleLoading";
import RequiredPermission from "../components/RequiredPermission";
import ErrorBoundary from "../components/ErrorBoundary";
import { ENDPOINTS } from "./endPoints";
import LandingLayout from "../layouts/LandingLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import SurveyWrapper from "../components/SurveyWrapper";
const WEB_NAME = "Learnly";

const RequiredAuth = ({ children, path, requiredRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, role } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return <SimpleLoading />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions if required
  if (requiredRoles.length > 0 && role && !requiredRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    switch (role) {
      case 'admin':
        return <Navigate to={ENDPOINTS.ADMIN.DASHBOARD} replace />;
      case 'parent':
        return <Navigate to={ENDPOINTS.PARENT.DASHBOARD} replace />;
      case 'student':
        return <Navigate to={ENDPOINTS.STUDENT.DASHBOARD} replace />;
      default:
        return <Navigate to={ENDPOINTS.STUDENT.DASHBOARD} replace />;
    }
  }

  return <SurveyWrapper>{children}</SurveyWrapper>;
};

RequiredAuth.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  requiredRoles: PropTypes.array,
};

// Routes configuration

// Landing Page Routes (Public)
const landingPage = {
  path: ENDPOINTS.LANDING.HOME,
  Layout: LandingLayout,
  component: lazy(() => import("../modules/landing/features")),
  title: WEB_NAME,
};

const newsPage = {
  path: ENDPOINTS.LANDING.NEWS,
  component: lazy(() => import("../modules/news/features/index")),
  title: `Tin tức | ${WEB_NAME}`,
  Layout: LandingLayout,
};

// Auth Routes
const loginPage = {
  path: ENDPOINTS.AUTH.LOGIN,
  component: lazy(() => import("../modules/auth/features/login")),
  title: `Đăng nhập | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const forgotPasswordPage = {
  path: ENDPOINTS.AUTH.FORGOT_PASSWORD,
  component: lazy(() => import("../modules/auth/features/forgotPassword")),
  title: `Quên mật khẩu | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const signinPage = {
  path: ENDPOINTS.AUTH.SIGNIN,
  component: lazy(() => import("../modules/auth/features/signin")),
  title: `Đăng ký | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const signinSuccessPage = {
  path: ENDPOINTS.AUTH.SIGNIN_SUCCESS,
  component: lazy(() => import("../modules/auth/features/signinSuccess")),
  title: `Đăng ký thành công | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const changePasswordPage = {
  path: ENDPOINTS.AUTH.CHANGE_PASSWORD,
  component: lazy(() => import("../modules/auth/features/changePassword")),
  title: `Đổi mật khẩu | ${WEB_NAME}`,
  Layout: LandingLayout,
};

// Admin Routes
const adminDashboardPage = {
  path: ENDPOINTS.ADMIN.DASHBOARD,
  component: lazy(() => import("../modules/admin/features/index")),
  title: `Admin Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["admin"],
};

// Parent Routes
const parentDashboardPage = {
  path: ENDPOINTS.PARENT.DASHBOARD,
  component: lazy(() => import("../modules/parent/features/index")),
  title: `Parent Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["parent"],
};

const parentCourseDetailPage = {
  path: ENDPOINTS.PARENT.COURSE_DETAIL,
  component: lazy(() => import("../modules/parent/components/CourseDetail")),
  title: `Parent Course Detail | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["parent"],
};

// Student Routes
const studentDashboardPage = {
  path: ENDPOINTS.STUDENT.DASHBOARD,
  component: lazy(() => import("../modules/student/features/index")),
  title: `Student Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["student"],
};

const studentCourseDetailPage = {
  path: ENDPOINTS.STUDENT.COURSE_DETAIL,
  component: lazy(() => import("../modules/student/components/CourseDetail")),
  title: `Chi tiết khóa học | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["student"],
};

const studentSurveyHistoryPage = {
  path: ENDPOINTS.STUDENT.SURVEY_HISTORY,
  component: lazy(() => import("../modules/survey/components/SurveyHistory")),
  title: `Lịch sử Khảo sát | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["student"],
};

// Student root route (redirect to dashboard) - Fix: Make it a proper lazy component
const studentRootPage = {
  path: ENDPOINTS.STUDENT.STUDENT_ROOT,
  component: lazy(() => Promise.resolve({ 
    default: () => <Navigate to={ENDPOINTS.STUDENT.DASHBOARD} replace /> 
  })),
  title: `Student Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["student"],
};

// Shared Routes
const subscriptionPage = {
  path: ENDPOINTS.SHARED.SUBSCRIPTION,
  component: lazy(() => import("../modules/subscription/features/index")),
  title: `Quản lý gói học | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const paymentPage = {
  path: ENDPOINTS.SHARED.PAYMENT,
  component: lazy(() => import("../modules/payment/features/index")),
  title: `Thanh toán | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const chatbotPage = {
  path: ENDPOINTS.SHARED.CHATBOT,
  component: lazy(() => import("../modules/chatbot/features/index")),
  title: `AI Chatbot | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const profilePage = {
  path: ENDPOINTS.SHARED.PROFILE,
  component: lazy(() => import("../modules/profile/features/index")),
  title: `Hồ sơ cá nhân | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const surveyPage = {
  path: ENDPOINTS.SHARED.SURVEY,
  component: lazy(() => import("../modules/survey/features/index")),
  title: `Khảo sát học tập | ${WEB_NAME}`,
  Layout: LandingLayout,
};



// Các trang khác sẽ được thêm vào đây
export const privateRouteData = [
  // Role-based Dashboards (Protected)
  adminDashboardPage,
  parentDashboardPage,
  parentCourseDetailPage,
  studentDashboardPage,
  studentRootPage,
  studentCourseDetailPage,
  studentSurveyHistoryPage,

  // Shared Features (Protected)
  subscriptionPage,
  paymentPage,
  chatbotPage,
  profilePage,
  surveyPage,
];

export const publicRoutesData = [
  // Landing Pages (Public)
  landingPage,
  newsPage,

  // Auth Pages (Public)
  loginPage,
  forgotPasswordPage,
  signinPage,
  signinSuccessPage,
  changePasswordPage,
];

// Improved route rendering function
const renderRoutes = (routes, isPrivate = false) => {
  return routes.map((route, index) => {
    const {
      component: Component,
      path,
      Layout,
      requiredPermissions,
      requiredRoles,
      ...rest
    } = route;

    // Base component render
    const componentElement = Layout ? (
      <Layout>
        <Component />
      </Layout>
    ) : (
      <Component />
    );

    // Wrap in ErrorBoundary
    const errorWrappedElement = (
      <ErrorBoundary>
        {componentElement}
      </ErrorBoundary>
    );

    // Wrap in auth/permission checks if private
    let protectedElement = errorWrappedElement;
    
    if (isPrivate) {
      if (requiredPermissions) {
        protectedElement = (
          <RequiredAuth 
            path={path}
            requiredRoles={requiredRoles || []}
          >
            <RequiredPermission
              path={ENDPOINTS.STUDENT.DASHBOARD}
              requiredPrivileges={requiredPermissions}
            >
              {errorWrappedElement}
            </RequiredPermission>
          </RequiredAuth>
        );
      } else {
        protectedElement = (
          <RequiredAuth 
            path={path}
            requiredRoles={requiredRoles || []}
          >
            {errorWrappedElement}
          </RequiredAuth>
        );
      }
    }

    // Final Suspense wrapper (only one!)
    const finalElement = (
      <Suspense fallback={<SimpleLoading />}>
        {protectedElement}
      </Suspense>
    );

    return (
      <Route
        {...rest}
        key={`${isPrivate ? "private" : "public"}-route-${index}`}
        path={path}
        element={finalElement}
      />
    );
  });
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {renderRoutes(publicRoutesData)}
          {renderRoutes(privateRouteData, true)}
          {/* Catch-all route for 404s */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;
