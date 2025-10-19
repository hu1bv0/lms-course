import { useState } from "react";

const NewPasswordForm = ({ onSubmit }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Quy định mật khẩu
  const isLengthValid = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

  const isPasswordValid =
    isLengthValid &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setErrors(["Password does not meet all requirements."]);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    setErrors([]);
    onSubmit({ newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="relative">
          <label className="text-sm font-bold text-black block mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Your New Password"
              className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showNewPassword ? (
                // 👁️ Mở mắt
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                // 👁️‍🗨️ Đóng mắt
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a10.08 10.08 0 012.134-3.294m3.294-2.134A10.08 10.08 0 0112 5c4.478 0 8.269 2.943 9.543 7a10.08 10.08 0 01-4.347 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <ul className="mt-2 text-sm list-disc list-inside space-y-1">
          <li className={isLengthValid ? "text-green-600" : "text-red-500"}>
            Minimum 8 characters
          </li>
          <li
            className={
              hasUppercase && hasLowercase ? "text-green-600" : "text-red-500"
            }
          >
            Include uppercase & lowercase
          </li>
          <li className={hasNumber ? "text-green-600" : "text-red-500"}>
            Include numbers
          </li>
          <li className={hasSpecialChar ? "text-green-600" : "text-red-500"}>
            Include special characters
          </li>
        </ul>
      </div>

      <div>
        <div className="relative">
          <label className="text-sm font-bold text-black block mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showConfirmPassword ? (
                // 👁️ Mở mắt
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                // 👁️‍🗨️ Đóng mắt
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a10.08 10.08 0 012.134-3.294m3.294-2.134A10.08 10.08 0 0112 5c4.478 0 8.269 2.943 9.543 7a10.08 10.08 0 01-4.347 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="text-red-600 text-sm font-semibold">
          {errors.map((error, i) => (
            <div key={i}>{error}</div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 transition"
      >
        Create New Password
      </button>
    </form>
  );
};

export default NewPasswordForm;
