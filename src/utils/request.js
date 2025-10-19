import axios from "axios";
import qs from "qs";
import { getConfig } from "../configs/getConfig.config";
import { toast } from "react-toastify";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";
import { startLoading, stopLoading } from "../store/slices/loadingSlice";
const paramsSerializer = (params) =>
  qs.stringify(params, { arrayFormat: "repeat" });

const request = axios.create({
  paramsSerializer,
});

export function createRequestInterceptor() {
  return function interceptor(config) {
    const { apiUrl } = getConfig();

    config.baseURL = apiUrl;

    const baseConfig = {
      ...config,
      headers: { ...config.headers },
    };

    const token = store.getState().auth.token;

    const { headers } = baseConfig;
    const newHeaders = {
      ...headers,
    };
    if (token) {
      newHeaders.Authorization = `Bearer ${token}`;
    }

    return {
      ...config,
      headers: newHeaders,
    };
  };
}

function parseResultsHandler(response) {
  const { data } = response || {};
  console.log("Response data:", data);
  return data?.result || data;
}

const isResponseError = ({ response }) => {
  return !!response;
};

const isServerError = ({ response: { status } }) => {
  return status >= 500;
};

const isUserError = ({ response: { status } }) => {
  return status >= 400 && status < 500;
};

const isUnauthorized = ({ response: { status } }) => {
  return status == 401 || status == 403;
};

const isRequestError = ({ response, request }) => {
  return !response && !!request;
};

export function displayErrorMessage(errorMsg) {
  if (typeof errorMsg === "string" && errorMsg.includes("Uncategorized")) {
    return;
  }
  return toast.error(errorMsg);
}
export function displaySuccessMessage(errorMsg) {
  return toast.success(errorMsg);
}

function getErrorDetails(error) {
  let errorMessage;
  const { response } = error;

  errorMessage =
    (response && response.data && response.data.message) ||
    response.data.description ||
    response.data.error_description ||
    response.statusText;

  return errorMessage;
}

function serverErrorHandler(error, next) {
  if (!isResponseError(error) || !isServerError(error)) {
    return next();
  }
  const errorMsg = getErrorDetails(error);
  return displayErrorMessage(errorMsg);
}

function userErrorHandler(error, next) {
  if (!isResponseError(error) || !isUserError(error)) {
    return next();
  }
  const errorMsg = getErrorDetails(error);

  return displayErrorMessage(errorMsg);
}

function unauthorizedErrorHandler(error, next) {
  if (isUnauthorized(error)) {
    // toast.error("Your session has expired. Please login again.");
    store.dispatch(logout());
    setTimeout(() => {
      // window.location.href = "/login";
    }, 5000);
  }
  if (!isResponseError(error) || !isUnauthorized(error)) {
    return next();
  }
  const errorMsg = getErrorDetails(error);
  return displayErrorMessage(errorMsg);
}

function requestErrorHandler(error, next) {
  if (!isRequestError(error)) {
    return next();
  }
  return displayErrorMessage("request failed");
}

export function createHandlerChain(handlers = []) {
  return function handlerChain(error) {
    const stack = [...handlers];
    function next() {
      if (stack.length === 0) {
        return;
      }
      const nextHandler = stack.pop();
      nextHandler(error, next);
    }
    next();
    return Promise.reject(error);
  };
}

// request.interceptors.request.use(createRequestInterceptor());
// request.interceptors.response.use(
//     parseResultsHandler,
//     createHandlerChain([
//         serverErrorHandler,
//         userErrorHandler,
//         unauthorizedErrorHandler,
//         requestErrorHandler,
//     ])
// );

// export default request;
// Request Interceptor: show loading
request.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading()); // Show loading
    return createRequestInterceptor()(config);
  },
  (error) => {
    store.dispatch(stopLoading()); // Hide loading if request setup fails
    return Promise.reject(error);
  }
);

// Response Interceptor: hide loading
request.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading()); // Hide loading on success
    return parseResultsHandler(response);
  },
  (error) => {
    store.dispatch(stopLoading()); // Hide loading on error
    return createHandlerChain([
      serverErrorHandler,
      userErrorHandler,
      unauthorizedErrorHandler,
      requestErrorHandler,
    ])(error);
  }
);

export default request;
