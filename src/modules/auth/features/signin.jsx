import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { GraduationCapIcon } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/animated-border.css";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import { USER_ROLES } from "../../../services/firebase";
import robot from "../../../assets/images/robot.png";

const SignIn = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithFacebook, isLoading, isAuthenticated, userData } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.STUDENT,
    phone: "",
    grade: "",
    school: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitClickCount, setSubmitClickCount] = useState(0);
  const [showAdminOption, setShowAdminOption] = useState(false);
  
  // Debug log for state changes
  console.log('SignIn render - submitClickCount:', submitClickCount, 'showAdminOption:', showAdminOption);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userData) {
      const userRole = userData.role;
      if (userRole === USER_ROLES.ADMIN) {
        navigate(ENDPOINTS.ADMIN.DASHBOARD, { replace: true });
      } else if (userRole === USER_ROLES.PARENT) {
        navigate(ENDPOINTS.PARENT.DASHBOARD, { replace: true });
      } else {
        navigate(ENDPOINTS.STUDENT.DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, userData, navigate]);

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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    
    if (!formData.password) {
      errors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    if (formData.role === USER_ROLES.STUDENT && !formData.grade.trim()) {
      errors.grade = "Vui lòng chọn lớp học";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle header click for admin unlock
  const handleHeaderClick = () => {
    const newClickCount = submitClickCount + 1;
    setSubmitClickCount(newClickCount);
    
    console.log('Header clicked, count:', newClickCount);
    
    // Show admin option after 10 clicks
    if (newClickCount >= 10 && !showAdminOption) {
      console.log('Unlocking admin option!');
      setShowAdminOption(true);
      toast.info("🎉 Chúc mừng! Bạn đã mở khóa tùy chọn đăng ký Admin! Bây giờ bạn có thể chọn vai trò Admin trong dropdown.", {
        position: "top-right",
        autoClose: 8000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Increment click count FIRST (before validation)
    const newClickCount = submitClickCount + 1;
    setSubmitClickCount(newClickCount);
    
    console.log('Submit clicked, count:', newClickCount);
    
    // Show admin option after 10 clicks
    if (newClickCount >= 10 && !showAdminOption) {
      console.log('Unlocking admin option!');
      setShowAdminOption(true);
      toast.info("🎉 Chúc mừng! Bạn đã mở khóa tùy chọn đăng ký Admin! Bây giờ bạn có thể chọn vai trò Admin trong dropdown.", {
        position: "top-right",
        autoClose: 8000,
      });
    }
    
    if (!validateForm()) {
      console.log('Form validation failed, but click counted');
      return;
    }

    try {
      const userData = {
        displayName: formData.fullName,
        fullName: formData.fullName,
        role: formData.role,
        phone: formData.phone,
        grade: formData.grade,
        school: formData.school
      };

      const result = await register(formData.email, formData.password, userData);
      
      if (result.success) {
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.", {
          position: "top-right",
          autoClose: 5000,
        });
        navigate(ENDPOINTS.AUTH.LOGIN);
      }
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast.success("Đăng ký với Google thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
        // Redirect based on user role
        const userRole = result.userData?.role;
        if (userRole === USER_ROLES.ADMIN) {
          navigate(ENDPOINTS.ADMIN.DASHBOARD);
        } else if (userRole === USER_ROLES.PARENT) {
          navigate(ENDPOINTS.PARENT.DASHBOARD);
        } else {
          navigate(ENDPOINTS.STUDENT.DASHBOARD);
        }
      }
    } catch (error) {
      toast.error(error.message || "Đăng ký với Google thất bại!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await loginWithFacebook();
      if (result.success) {
        toast.success("Đăng ký với Facebook thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
        // Redirect based on user role
        const userRole = result.userData?.role;
        if (userRole === USER_ROLES.ADMIN) {
          navigate(ENDPOINTS.ADMIN.DASHBOARD);
        } else if (userRole === USER_ROLES.PARENT) {
          navigate(ENDPOINTS.PARENT.DASHBOARD);
        } else {
          navigate(ENDPOINTS.STUDENT.DASHBOARD);
        }
      }
    } catch (error) {
      toast.error(error.message || "Đăng ký với Facebook thất bại!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left - Sign Up Form */}
      <div className="w-1/2 bg-white flex flex-col px-12 relative overflow-y-auto">
        {/* Logo + Welcome - Fixed positioning */}
        <div className="sticky top-0 bg-white z-50 py-6 border-b border-gray-100">
          <div className="flex items-center justify-center gap-4">
            <Link to={ENDPOINTS.INDEX}>
              <GraduationCapIcon className="text-blue-600 text-4xl w-[50px] h-[50px]" />
            </Link>
            <h1 
              onClick={handleHeaderClick}
              className="text-2xl font-bold text-blue-600 text-center cursor-pointer hover:text-blue-700 transition-colors"
              title="Click để mở khóa Admin (10 lần)"
            >
              Đăng ký tài khoản Learnly
            </h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center py-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[500px] animated-border bg-white rounded-lg p-6 shadow-md"
          >
          <h2 className="text-blue-600 text-3xl font-bold mb-2 text-center">
            Đăng ký
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Tạo tài khoản để bắt đầu học tập
          </p>

          {/* Full Name */}
          <label htmlFor="fullName" className="text-sm text-gray-700">
            Họ và tên *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] focus:outline-none focus:ring-2 ${
              fieldErrors.fullName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-[#1d4ed8]"
            }`}
          />
          {fieldErrors.fullName && (
            <p className="text-red-500 text-sm mb-3">{fieldErrors.fullName}</p>
          )}

          {/* Email */}
          <label htmlFor="email" className="text-sm text-gray-700">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] focus:outline-none focus:ring-2 ${
              fieldErrors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-[#1d4ed8]"
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mb-3">{fieldErrors.email}</p>
          )}

          {/* Role Selection */}
          <label htmlFor="role" className="text-sm text-gray-700">
            Loại tài khoản *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-3 mt-1 mb-1 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
          >
            <option value={USER_ROLES.STUDENT}>Học sinh</option>
            <option value={USER_ROLES.PARENT}>Phụ huynh</option>
            {showAdminOption && (
              <option value={USER_ROLES.ADMIN}>Admin</option>
            )}
          </select>

          {/* Grade (for students) */}
          {formData.role === USER_ROLES.STUDENT && (
            <>
              <label htmlFor="grade" className="text-sm text-gray-700">
                Lớp học *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] focus:outline-none focus:ring-2 ${
                  fieldErrors.grade
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-[#1d4ed8]"
                }`}
              >
                <option value="">Chọn lớp học</option>
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
              </select>
              {fieldErrors.grade && (
                <p className="text-red-500 text-sm mb-3">{fieldErrors.grade}</p>
              )}
            </>
          )}

          {/* School */}
          <label htmlFor="school" className="text-sm text-gray-700">
            Trường học
          </label>
          <input
            id="school"
            name="school"
            type="text"
            placeholder="Nhập tên trường học"
            value={formData.school}
            onChange={handleInputChange}
            className="w-full px-4 py-3 mt-1 mb-1 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
          />

          {/* Phone */}
          <label htmlFor="phone" className="text-sm text-gray-700">
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 mt-1 mb-1 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
          />

          {/* Password */}
          <label htmlFor="password" className="text-sm text-gray-700">
            Mật khẩu *
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] pr-12 focus:outline-none focus:ring-2 ${
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[#1d4ed8]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 text-sm mb-3">{fieldErrors.password}</p>
          )}

          {/* Confirm Password */}
          <label htmlFor="confirmPassword" className="text-sm text-gray-700">
            Xác nhận mật khẩu *
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
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
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm mb-3">{fieldErrors.confirmPassword}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1d4ed8] text-white font-bold rounded-[10px] shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
          
          {/* Click counter indicator */}
          {submitClickCount > 0 && (
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">
                Đã click: {submitClickCount}/10 lần
                {submitClickCount >= 10 && (
                  <span className="text-green-600 font-semibold ml-2">🎉 Đã mở khóa Admin!</span>
                )}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={handleFacebookLogin}
              disabled={isLoading}
              type="button"
              className="w-full border rounded-[10px] py-2 flex items-center justify-center gap-3 hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FaFacebook className="text-blue-600 text-xl" />
              <span className="font-medium text-gray-700">
                Đăng ký với Facebook
              </span>
            </button>

            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              type="button"
              className="w-full border rounded-[10px] py-2 flex items-center justify-center gap-3 hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500 text-xl" />
              <span className="font-medium text-gray-700">
                Đăng ký với Google
              </span>
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm mt-5">
            Đã có tài khoản?{" "}
            <Link
              to={ENDPOINTS.AUTH.LOGIN}
              className="text-blue-600 font-semibold hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </form>
        </div>
      </div>

      {/* Right - Background */}
      <div className="w-1/2 relative flex justify-center bg-purple-200">
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-blue-600 min-h-screen px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg mt-[100px]">
            Tham gia cùng hàng nghìn học sinh
          </h1>
          <h2 className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            Tạo tài khoản miễn phí và bắt đầu hành trình học tập thông minh với AI
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

export default SignIn;