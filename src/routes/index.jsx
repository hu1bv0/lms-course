/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
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
const WEB_NAME = "Learnly";

const RequiredAuth = ({ children, path }) => {
  const location = useLocation();
  // Fixed the token selector
  const token = useSelector((state) => state.auth?.token);

  if (!token) {
    return <Navigate to={path} state={{ from: location }} replace />;
  }

  return children;
};

RequiredAuth.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
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

const landingPage = {
  path: ENDPOINTS.INDEX,
  Layout: LandingLayout,
  component: lazy(() => delayRoute()(import("../modules/landing/features"))),
  title: WEB_NAME,
};

const loginPage = {
  path: ENDPOINTS.AUTH.LOGIN,
  component: lazy(() => delayRoute()(import("../modules/auth/features/login"))),
  title: `Login | ${WEB_NAME}`,
  Layout: LandingLayout,
};
const forgotPasswordPage = {
  path: ENDPOINTS.AUTH.FORGOT_PASSWORD,
  component: lazy(() =>
    delayRoute()(import("../modules/auth/features/forgotPassword"))
  ),
  title: `Forgot Password | ${WEB_NAME}`,
  Layout: LandingLayout,
};
const signinpage = {
  path: ENDPOINTS.AUTH.SIGNIN,
  component: lazy(() =>
    delayRoute()(import("../modules/auth/features/signin"))
  ),
  title: `Sign In | ${WEB_NAME}`,
  Layout: LandingLayout,
};
const signinSuccessPage = {
  path: ENDPOINTS.AUTH.SIGNIN_SUCCESS,
  component: lazy(() =>
    delayRoute()(import("../modules/auth/features/signinSuccess"))
  ),
  title: `Sign In | ${WEB_NAME}`,
  Layout: LandingLayout,
};
const userdashboardPage = {
  path: ENDPOINTS.USER.DASHBOARD,
  component: lazy(() =>
    delayRoute()(import("../modules/user_dashboard/features/index"))
  ),
  title: `Dashboard | ${WEB_NAME}`,
  Layout: DashboardLayout,
};

const checkoutPage = {
  path: ENDPOINTS.USER.CHECKOUT,
  component: lazy(() =>
    delayRoute()(import("../modules/checkout/features/index"))
  ),
  title: `Checkout | ${WEB_NAME}`,
  Layout: DashboardLayout,
};
const pricingPage = {
  path: ENDPOINTS.USER.PRICING,
  component: lazy(() =>
    delayRoute()(import("../modules/pricing/features/index"))
  ),
  title: `Pricing | ${WEB_NAME}`,
  Layout: DashboardLayout,
};
const chatbotPage = {
  path: ENDPOINTS.USER.CHATBOT,
  component: lazy(() =>
    delayRoute()(import("../modules/chatbot/features/index"))
  ),
  title: `Chatbot | ${WEB_NAME}`,
  Layout: LandingLayout,
};
const newsPage = {
  path: ENDPOINTS.USER.NEWS,
  component: lazy(() =>
    delayRoute()(import("../modules/news/features/index"))
  ),
  title: `News | ${WEB_NAME}`,
  Layout: LandingLayout,
};
const infoPage = {
  path: ENDPOINTS.USER.INFO,
  component: lazy(() =>
    delayRoute()(import("../modules/info/features/index"))
  ),
  title: `Info | ${WEB_NAME}`,
  Layout: LandingLayout,
};
const coursePage = {
  path: ENDPOINTS.USER.COURSES,
  component: lazy(() =>
    delayRoute()(import("../modules/courses/features/index"))
  ),
  title: `Courses | ${WEB_NAME}`,
  Layout: LandingLayout,
};
const adminDashboardPage = {
  path: ENDPOINTS.ADMIN.DASHBOARD,
  component: lazy(() =>
    delayRoute()(import("../modules/admin/features/index"))
  ),
  title: `Admin Dashboard | ${WEB_NAME}`,
  Layout: LandingLayout,
};



// Các trang khác sẽ được thêm vào đây
export const privateRouteData = [];
export const publicRoutesData = [
  landingPage,
  loginPage,
  forgotPasswordPage,
  signinpage,
  signinSuccessPage,
  userdashboardPage,
  checkoutPage,
  pricingPage,
  chatbotPage,
  newsPage,
  infoPage,
  coursePage,
  adminDashboardPage,
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
        <RequiredAuth path={ENDPOINTS.AUTH.LOGIN}>
          {requiredPermissions ? (
            <RequiredPermission
              path={ENDPOINTS.USER.DASHBOARD}
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

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(publicRoutesData)}
        {renderRoutes(privateRouteData, true)}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
