// const BASE_URL = 'https://api-gateway-acehh3adgsgcd3cp.eastasia-01.azurewebsites.net/api/iam';
// const BASE_URL = 'http://localhost:8088';
const BASE_URL = "http://localhost:8765/api/iam";

export default {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    FORGOT: `${BASE_URL}/auth/forgot-password`,
    VERIFICATION_OTP: `${BASE_URL}/auth/verify-otp`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  },
  USER: {},
};
