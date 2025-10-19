import robot from "../../../assets/images/robot.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { useNavigate } from "react-router-dom";
import { GraduationCapIcon } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/animated-border.css";
const Signin = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [className, setClassName] = useState("");
  const [school, setSchool] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });
  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setFieldErrors({
      fullname: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    // Kiểm tra username & password trống
    if (!username.trim() || !password.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate mật khẩu
    const passwordRules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    };

    if (!passwordRules.length) {
      setFieldErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải có ít nhất 8 ký tự",
      }));
      return;
    }
    if (!passwordRules.uppercase) {
      setFieldErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải chứa ít nhất 1 chữ in hoa",
      }));
      return;
    }
    if (!passwordRules.number) {
      setFieldErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải chứa ít nhất 1 số",
      }));
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Mật khẩu xác nhận không khớp",
      }));
      return;
    }

    // Nếu pass tất cả
    toast.success("Đăng ký thành công 🎉", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate(ENDPOINTS.USER.COURSES);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left - Login Form */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center px-12 relative">
        {/* Logo + Welcome */}
        <div className="absolute top-10 left-1/2 flex items-center gap-4">
          <Link to={ENDPOINTS.INDEX}>
            <GraduationCapIcon className="text-blue-600 text-5xl w-[70px] h-[70px] absolute top-[-30px] left-10 z-20" />
          </Link>
          <div className="bg-white w-[900px] ml-[60px] bg-opacity-80 backdrop-blur-md rounded-[15px] px-6 py-2 shadow-md text-[28px] font-bold text-blue-600 text-center z-10">
            Chào mừng đến với Learnly
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[800px] animated-border bg-white rounded-lg p-6 shadow-md"
        >
          <h2 className="text-blue-600 text-3xl font-bold mb-2 text-center">
            Đăng ký
          </h2>
          <div className="flex gap-6">
            {/* Cột trái */}
            <div className="flex-1">
              {/* Fullname */}
              <label htmlFor="fullname" className="text-sm text-gray-700">
                Họ và tên
              </label>
              <input
                id="fullname"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] focus:outline-none focus:ring-2 ${
                  fieldErrors.fullname
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-[#a10101]"
                }`}
              />
              {fieldErrors.fullname && (
                <p className="text-red-500 text-sm mb-3">
                  {fieldErrors.fullname}
                </p>
              )}

              {/* Username */}
              <label htmlFor="username" className="text-sm text-gray-700">
                Tên đăng nhập hoặc Email
              </label>
              <input
                id="username"
                type="text"
                placeholder="Tên đăng nhập hoặc Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] focus:outline-none focus:ring-2 ${
                  fieldErrors.username
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-[#a10101]"
                }`}
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-sm mb-3">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Cột phải */}
            <div className="flex-1">
              {/* Password */}
              <label htmlFor="password" className="text-sm text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] pr-12 focus:outline-none focus:ring-2 ${
                    fieldErrors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#a10101]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mb-3">
                  {fieldErrors.password}
                </p>
              )}

              {/* Confirm Password */}
              <label
                htmlFor="confirmPassword"
                className="text-sm text-gray-700"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 mt-1 mb-1 border rounded-[10px] pr-12 focus:outline-none focus:ring-2 ${
                    fieldErrors.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#a10101]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm mb-3">
                  {fieldErrors.confirmPassword}
                </p>
              )}

              {/* Rules */}
              <div className="text-xs mb-4">
                <p className="font-medium">Mật khẩu phải chứa:</p>
                <ul className="list-disc list-inside">
                  <li
                    className={
                      passwordRules.length ? "text-green-600" : "text-red-500"
                    }
                  >
                    Ít nhất 8 ký tự
                  </li>
                  <li
                    className={
                      passwordRules.uppercase
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    Một chữ cái viết hoa
                  </li>
                  <li
                    className={
                      passwordRules.number ? "text-green-600" : "text-red-500"
                    }
                  >
                    Một số
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Study Place */}
          <label htmlFor="province" className="text-sm text-gray-700">
            Nơi học tập
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
            >
              <option value="">Chọn Tỉnh/Thành Phố</option>
              {/* map tỉnh thành từ API hoặc mảng */}
            </select>
            <select
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
            >
              <option value="">Chọn Quận/Huyện</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              id="class"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
            >
              <option value="">Chọn lớp</option>
            </select>
            <input
              id="school"
              type="text"
              placeholder="Tên trường"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#1d4ed8] text-white font-bold rounded-[10px] shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Đăng ký{" "}
          </button>

          <div className="flex items-center gap-2">
            <hr className="flex-1 border-gray-300" />
          </div>
        </form>
      </div>

      {/* Right - Background */}
      <div className="w-1/2 relative flex  justify-center bg-purple-200">
        {/* <img
          src="https://c.animaapp.com/dMPYuAuq/img/image.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
        <div className="relative z-10 flex flex-col items-center justify-center text-left text-blue-600 min-h-screen px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg mt-[100px]">
            Đăng ký Learnly
          </h1>
          <h2 className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed text-left">
            Tham gia nền tảng học tập cá nhân hóa với AI – học thông minh, đúng
            sức, không áp lực
          </h2>
          <ul className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed list-disc list-inside text-leftr">
            <li>Giải bài tập theo SGK, có giải thích dễ hiểu</li>
            <li>Lộ trình học cá nhân hóa theo năng lực</li>
            <li>Cảnh báo học quá tải thông minh</li>
            <li>Phụ huynh có thể theo dõi tiến độ học</li>
          </ul>
          <img
            src={robot}
            alt="Learnly Illustration"
            className="w-[300px] mt-[60px] drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
