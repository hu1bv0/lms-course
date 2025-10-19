import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { GraduationCapIcon, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/animated-border.css";
import { useAuth } from "../../../hooks/useAuth";
import robot from "../../../assets/images/robot.png";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { changePassword, isLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate(ENDPOINTS.AUTH.LOGIN);
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    
    if (!formData.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    if (formData.currentPassword === formData.newPassword) {
      errors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await changePassword(formData.newPassword);
      
      if (result.success) {
        toast.success("Đổi mật khẩu thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate(ENDPOINTS.STUDENT.DASHBOARD);
      }
    } catch (error) {
      toast.error(error.message || "Đổi mật khẩu thất bại!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left - Change Password Form */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center px-12 relative">
        <div className="absolute top-10 left-1/2 flex items-center gap-4">
          <GraduationCapIcon className="text-blue-600 text-5xl w-[70px] h-[70px] absolute top-[-30px] left-10 z-20" />
          <div className="bg-white w-[900px] ml-[60px] bg-opacity-80 backdrop-blur-md rounded-[15px] px-6 py-2 shadow-md text-[28px] font-bold text-blue-600 text-center z-10">
            Đổi mật khẩu
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[500px] animated-border bg-white rounded-lg p-6 shadow-md"
        >
          <h2 className="text-blue-600 text-3xl font-bold mb-2 text-center">
            Đổi mật khẩu
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Để bảo mật tài khoản, vui lòng đổi mật khẩu định kỳ
          </p>

          {/* Current Password */}
          <label htmlFor="currentPassword" className="text-sm text-gray-700">
            Mật khẩu hiện tại *
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              placeholder="Nhập mật khẩu hiện tại"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] pr-12 focus:outline-none focus:ring-2 ${
                fieldErrors.currentPassword
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[#1d4ed8]"
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.currentPassword && (
            <p className="text-red-500 text-sm mb-3">{fieldErrors.currentPassword}</p>
          )}

          {/* New Password */}
          <label htmlFor="newPassword" className="text-sm text-gray-700">
            Mật khẩu mới *
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] pr-12 focus:outline-none focus:ring-2 ${
                fieldErrors.newPassword
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[#1d4ed8]"
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.newPassword && (
            <p className="text-red-500 text-sm mb-3">{fieldErrors.newPassword}</p>
          )}

          {/* Confirm Password */}
          <label htmlFor="confirmPassword" className="text-sm text-gray-700">
            Xác nhận mật khẩu mới *
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] pr-12 focus:outline-none focus:ring-2 ${
                fieldErrors.confirmPassword
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[#1d4ed8]"
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm mb-3">{fieldErrors.confirmPassword}</p>
          )}

          {/* Password Requirements */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Yêu cầu mật khẩu:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Ít nhất 6 ký tự</li>
              <li>• Khác với mật khẩu hiện tại</li>
              <li>• Nên bao gồm chữ hoa, chữ thường và số</li>
            </ul>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1d4ed8] text-white font-bold rounded-[10px] shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </button>

          <div className="flex items-center gap-2 mt-6">
            <hr className="flex-1 border-gray-300" />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
              className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại dashboard
            </button>
          </div>
        </form>
      </div>

      {/* Right - Background */}
      <div className="w-1/2 relative flex justify-center bg-purple-200">
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-blue-600 min-h-screen px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg mt-[100px]">
            Bảo mật tài khoản
          </h1>
          <h2 className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            Đổi mật khẩu định kỳ để đảm bảo tài khoản của bạn luôn được bảo vệ an toàn
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

export default ChangePassword;
