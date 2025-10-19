import { useLocation, Link } from "react-router-dom";

export default function SignupSuccess() {
  const location = useLocation();
  const email = location.state?.email || "email của bạn";

  return (
    <div className="min-h-screen bg-lozo-dark flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-lozo-dark bg-opacity-70 border-4 border-lozo-purple border-opacity-70 rounded-3xl p-10 text-center text-white shadow-lg">
        <h1 className="font-bank-gothic text-4xl mb-6">🎉 Chúc mừng!</h1>
        <p className="text-lg mb-4">
          Tài khoản của bạn đã được tạo thành công.
        </p>
        <p className="text-lg mb-6">
          Vui lòng kiểm tra hộp thư <span className="font-bold">{email}</span>{" "}
          và xác thực email để bắt đầu hành trình cùng LozoAcademy.
        </p>

        <Link
          to="/login"
          className="inline-block bg-gradient-to-r from-lozo-form-bg via-lozo-form-mid to-lozo-purple-light text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
}
