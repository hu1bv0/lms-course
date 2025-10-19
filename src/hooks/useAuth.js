import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCredentials, logout } from "../store/slices/authSlice";
import { jwtDecode } from "jwt-decode";
import request from "../utils/request";
import endpoints from "../constants/apiEndpoints";
// import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../routes/endPoints";
import { toast } from "react-toastify";
// import { useNotificationSocket } from "./useNotificationSocket";
export const useAuth = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // const { disconnect } = useNotificationSocket((message) => {
  //   console.log("Notification:", message);
  // });

  const loginMutation = useMutation({
    mutationFn: async (inp) => {
      // Xóa trước khi gọi API đăng nhập
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      return await request.post(endpoints.AUTH.LOGIN, inp);
    },
    onSuccess: (data) => {
      const decoded = jwtDecode(data.token);
      console.log("Token decoded:", decoded);
      const restructuredData = {
        user: {
          id: decoded.sub,
          scope: decoded.scope,
          username: decoded.username,
          avatarUrl: decoded.avatarUrl,
        },
        token: data.token,
      };
      dispatch(setCredentials(restructuredData));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setTimeout(() => {
        navigate(ENDPOINTS.USER.DASHBOARD);
      }, 1000);
      toast.success("Login successfully", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    },
    onError: (error) => {
      //    const errorMessage = (error.response.data.message) || "Login failed";
      //     toast.error("Login failed"+ errorMessage, {
      //         position: "top-left",
      //         autoClose: 3000,
      //     });
      console.error("Login error:", error.response.data.message);
    },
  });

  const handleLogout = async () => {
    dispatch(logout());
    queryClient.clear();
    await request.post(endpoints.AUTH.LOGOUT, { token: token });
    // disconnect();
    toast.success("Logout successfully", {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  const forgotPassword = async (inp) => {
    const response = await request.post(endpoints.AUTH.FORGOT, inp);
    return response;
  };
  const verificationOtp = async (inp) => {
const response = await request.post(endpoints.AUTH.VERIFICATION_OTP, inp);
    return response;
  };
  const resetPassword = async (inp) => {
    const response = await request.post(endpoints.AUTH.RESET_PASSWORD, inp);
    return response;
  };
  return {
    user,
    token,
    isAuthenticated: !!token,
    login: loginMutation.mutate,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    forgotPassword,
    verificationOtp,
    resetPassword,
  };
};
