import { useState } from "react";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { GraduationCapIcon, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/animated-border.css";
import { useAuth } from "../../../hooks/useAuth";
import robot from "../../../assets/images/robot.png";

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Vui lòng nhập email", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email không hợp lệ", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setIsEmailSent(true);
        toast.success("Email khôi phục mật khẩu đã được gửi!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi gửi email", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleResendEmail = async () => {
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        toast.success("Email đã được gửi lại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi gửi lại email", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex h-screen w-full">
        {/* Left - Success Message */}
        <div className="w-1/2 bg-white flex flex-col items-center justify-center px-12 relative">
          <div className="absolute top-10 left-1/2 flex items-center gap-4">
            <Link to={ENDPOINTS.INDEX}>
              <GraduationCapIcon className="text-blue-600 text-5xl w-[70px] h-[70px] absolute top-[-30px] left-10 z-20" />
            </Link>
            <div className="bg-white w-[900px] ml-[60px] bg-opacity-80 backdrop-blur-md rounded-[15px] px-6 py-2 shadow-md text-[28px] font-bold text-blue-600 text-center z-10">
              Email đã được gửi
            </div>
          </div>

          <div className="w-full max-w-[500px] animated-border bg-white rounded-lg p-8 shadow-md text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Kiểm tra email của bạn
            </h2>
            
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi link khôi phục mật khẩu đến email <strong>{email}</strong>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-[10px] shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang gửi..." : "Gửi lại email"}
              </button>
              
              <Link
                to={ENDPOINTS.AUTH.LOGIN}
                className="w-full py-3 border border-gray-300 text-gray-700 font-bold rounded-[10px] shadow-md hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>

        {/* Right - Background */}
        <div className="w-1/2 relative flex justify-center bg-purple-200">
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-blue-600 min-h-screen px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg mt-[100px]">
              Khôi phục mật khẩu
            </h1>
            <h2 className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
              Kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu
            </h2>
            <img
              src={robot}
              alt="Learnly Illustration"
              className="w-60 mt-[60px] md:w-80 drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left - Forgot Password Form */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center px-12 relative">
        <div className="absolute top-10 left-1/2 flex items-center gap-4">
          <Link to={ENDPOINTS.INDEX}>
            <GraduationCapIcon className="text-blue-600 text-5xl w-[70px] h-[70px] absolute top-[-30px] left-10 z-20" />
          </Link>
          <div className="bg-white w-[900px] ml-[60px] bg-opacity-80 backdrop-blur-md rounded-[15px] px-6 py-2 shadow-md text-[28px] font-bold text-blue-600 text-center z-10">
            Quên mật khẩu
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[500px] animated-border bg-white rounded-lg p-6 shadow-md"
        >
          <h2 className="text-blue-600 text-3xl font-bold mb-2 text-center">
            Khôi phục mật khẩu
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Nhập email để nhận link khôi phục mật khẩu
          </p>

          <label htmlFor="email" className="text-sm text-gray-700">
            Email đăng ký
          </label>
          <input
            id="email"
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mt-1 mb-1 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1d4ed8] text-white font-bold rounded-[10px] shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? "Đang gửi..." : "Gửi link khôi phục"}
          </button>

          <div className="flex items-center gap-2 mt-6">
            <hr className="flex-1 border-gray-300" />
          </div>

          <div className="text-center mt-6">
            <Link
              to={ENDPOINTS.AUTH.LOGIN}
              className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>

      {/* Right - Background */}
      <div className="w-1/2 relative flex justify-center bg-purple-200">
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-blue-600 min-h-screen px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg mt-[100px]">
            Đừng lo lắng
          </h1>
          <h2 className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            Chúng tôi sẽ giúp bạn khôi phục mật khẩu một cách nhanh chóng và an toàn
          </h2>
          <img
            src={robot}
            alt="Learnly Illustration"
            className="w-60 mt-[60px] md:w-80 drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;