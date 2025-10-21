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
import RequiredPermission from "../components/RequiredPermission";
import { ENDPOINTS } from "./endPoints";
import LandingLayout from "../layouts/LandingLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
const WEB_NAME = "Learnly";

const RequiredAuth = ({ children, path, requiredRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, role } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return <Loading />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions if required
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
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

  return children;
};

RequiredAuth.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  requiredRoles: PropTypes.array,
};

const delayRoute = (ms = 500) => {
  return (promise) =>
    promise.then(
      (data) =>
        new Promise((resolve) => {
          setTimeout(() => resolve(data), ms);
        })
    );
};

// Routes configuration

// Landing Page Routes (Public)
const landingPage = {
  path: ENDPOINTS.LANDING.HOME,
  Layout: LandingLayout,
  component: lazy(() => delayRoute()(import("../modules/landing/features"))),
  title: WEB_NAME,
};

const newsPage = {
  path: ENDPOINTS.LANDING.NEWS,
  component: lazy(() => delayRoute()(import("../modules/news/features/index"))),
  title: `Tin tức | ${WEB_NAME}`,
  Layout: LandingLayout,
};

// Auth Routes
const loginPage = {
  path: ENDPOINTS.AUTH.LOGIN,
  component: lazy(() => delayRoute()(import("../modules/auth/features/login"))),
  title: `Đăng nhập | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const forgotPasswordPage = {
  path: ENDPOINTS.AUTH.FORGOT_PASSWORD,
  component: lazy(() => delayRoute()(import("../modules/auth/features/forgotPassword"))),
  title: `Quên mật khẩu | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const signinPage = {
  path: ENDPOINTS.AUTH.SIGNIN,
  component: lazy(() => delayRoute()(import("../modules/auth/features/signin"))),
  title: `Đăng ký | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const signinSuccessPage = {
  path: ENDPOINTS.AUTH.SIGNIN_SUCCESS,
  component: lazy(() => delayRoute()(import("../modules/auth/features/signinSuccess"))),
  title: `Đăng ký thành công | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const changePasswordPage = {
  path: ENDPOINTS.AUTH.CHANGE_PASSWORD,
  component: lazy(() => delayRoute()(import("../modules/auth/features/changePassword"))),
  title: `Đổi mật khẩu | ${WEB_NAME}`,
  Layout: LandingLayout,
};

// Admin Routes
const adminDashboardPage = {
  path: ENDPOINTS.ADMIN.DASHBOARD,
  component: lazy(() => delayRoute()(import("../modules/admin/features/index"))),
  title: `Admin Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["admin"],
};

// Parent Routes
const parentDashboardPage = {
  path: ENDPOINTS.PARENT.DASHBOARD,
  component: lazy(() => delayRoute()(import("../modules/parent/features/index"))),
  title: `Parent Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["parent"],
};

const parentCourseDetailPage = {
  path: ENDPOINTS.PARENT.COURSE_DETAIL,
  component: lazy(() => delayRoute()(import("../modules/parent/components/CourseDetail"))),
  title: `Parent Course Detail | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["parent"],
};

// Student Routes
const studentDashboardPage = {
  path: ENDPOINTS.STUDENT.DASHBOARD,
  component: lazy(() => delayRoute()(import("../modules/student/features/index"))),
  title: `Student Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["student"],
};

const studentCourseDetailPage = {
  path: ENDPOINTS.STUDENT.COURSE_DETAIL,
  component: lazy(() => delayRoute()(import("../modules/student/components/CourseDetail"))),
  title: `Chi tiết khóa học | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["student"],
};

// Student root route (redirect to dashboard)
const studentRootPage = {
  path: ENDPOINTS.STUDENT.STUDENT_ROOT,
  component: () => <Navigate to={ENDPOINTS.STUDENT.DASHBOARD} replace />,
  title: `Student Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
  requiredRoles: ["student"],
};

// Shared Routes
const subscriptionPage = {
  path: ENDPOINTS.SHARED.SUBSCRIPTION,
  component: lazy(() => delayRoute()(import("../modules/subscription/features/index"))),
  title: `Quản lý gói học | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const paymentPage = {
  path: ENDPOINTS.SHARED.PAYMENT,
  component: lazy(() => delayRoute()(import("../modules/payment/features/index"))),
  title: `Thanh toán | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const chatbotPage = {
  path: ENDPOINTS.SHARED.CHATBOT,
  component: lazy(() => delayRoute()(import("../modules/chatbot/features/index"))),
  title: `AI Chatbot | ${WEB_NAME}`,
  Layout: LandingLayout,
};

const profilePage = {
  path: ENDPOINTS.SHARED.PROFILE,
  component: lazy(() => delayRoute()(import("../modules/profile/features/index"))),
  title: `Hồ sơ cá nhân | ${WEB_NAME}`,
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

  // Shared Features (Protected)
  subscriptionPage,
  paymentPage,
  chatbotPage,
  profilePage,
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
      ...rest
    } = route;

    const content = (
      <Suspense fallback={<Loading />}>
        {Layout ? (
          <Layout>
            <Component />
          </Layout>
        ) : (
          <Component />
        )}
      </Suspense>
    );

    let element = content;

    if (isPrivate) {
      element = (
        <RequiredAuth 
          path="/login"
          requiredRoles={route.requiredRoles}
        >
          {requiredPermissions ? (
            <RequiredPermission
              path={ENDPOINTS.STUDENT.DASHBOARD}
              requiredPrivileges={requiredPermissions}
            >
              {content}
            </RequiredPermission>
          ) : (
            content
          )}
        </RequiredAuth>
      );
    }

    return (
      <Route
        {...rest}
        key={`${isPrivate ? "private" : "public"}-route-${index}`}
        path={path}
        element={element} // ✅ Fix: sử dụng biến element đã build đúng
      />
    );
  });
};

// Auth wrapper component to initialize auth state
const AuthWrapper = ({ children }) => {
  useAuth(); // Initialize auth state
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <Routes>
          {renderRoutes(publicRoutesData)}
          {renderRoutes(privateRouteData, true)}
          {/* Catch-all route for 404s */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthWrapper>
    </BrowserRouter>
  );
};

export default AppRoutes;
