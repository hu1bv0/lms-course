import React from "react";
import { Link , useNavigate} from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import ForgotPasswordForm from "../components/forgotfasswordform";
import CodeForm from "../components/codeform";
import NewPasswordForm from "../components/newpassword";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [showCodeForm, setShowCodeForm] = React.useState(false);
  const [useremail, setuserEmail] = React.useState("");
  const [nameuser, setNameUser] = React.useState("");
  const [showNewPasswordForm, setShowNewPasswordForm] = React.useState(false);
  const [verifitoken, setVerifitoken] = React.useState("");
  const navigate = useNavigate();
  const { forgotPassword,verificationOtp, resetPassword } = useAuth();
  
  const handleSubmit = async ({ username, email }) => {
    console.log("Send reset to:", { username, email });

    try {
      const response = await forgotPassword({ username, email });

      if (response) { // Giả sử API trả về success: true
        setShowCodeForm(true);
        setuserEmail(email);
        setNameUser(username);
        console.log(response.message);
        toast.success("Send OTP successfully");
      } else {
        console.log("Failed to send OTP:", response?.message || "Unknown error");
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      toast.error("Error in forgotPassword");
    }
  };
  const handleResend = async () => {
    try {
      console.log("Send reset to:", { nameuser, useremail });
      const response = await forgotPassword({ username:nameuser, email:useremail });

      if (response.code===1000) { // Giả sử API trả về success: true
        setShowCodeForm(true);
        setShowNewPasswordForm(false);
        console.log(response.message);
        toast.success("Resend OTP successfully");
      } else {
        console.log("Failed to send OTP:", response?.message || "Unknown error");
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      toast.error("Error in forgotPassword");
    }
  };
  const handleCodeSubmit = async (code) => {
  console.log("Code submitted:", code.code);

  try {
    const response = await verificationOtp({ otp: code.code });

    if (response && response.verificationToken) {
      setVerifitoken(response.verificationToken);
      setShowNewPasswordForm(true);
      console.log("OTP verified successfully!");
      toast.success("OTP verified successfully!");
    } else {
      console.warn("OTP verification failed:", response?.message || "Unknown error");
      toast.error("OTP verification failed");
    }
  } catch (error) {
    toast.error("Error verifying OTP");
    console.error("Error verifying OTP:", error);
  }
};
 
const handleNewPasswordSubmit = async (newPasswordObj) => {
  console.log("New password submitted:", newPasswordObj);
  setShowCodeForm(false);
  const actualPassword = newPasswordObj.newPassword;

  const payload = {
    username: nameuser,
    newPassword: actualPassword,
    token: verifitoken,
  };

  try {
    const response = await resetPassword(payload);

    if (response) {
      toast.success("Reset password successfully");
      setTimeout(() => {
        
        navigate(ENDPOINTS.AUTH.LOGIN);
      }, 1500);
      
    } else {
      console.warn("Reset failed:", response?.message || "Unknown");
    }
  } catch (error) {
    console.error("Reset password error:", error);
    toast.error("Reset password error");
  }
};

  return (
    <div className=" flex flex-col bg-white">
      {/* Header background */}
      <div>
      <img
                  className="w-full h-[462px] top-0 left-0"
                  alt="Image"
                  src="https://c.animaapp.com/bt39k2cp/img/image.png"
                />
        {/* Back button */}
        <Link to="/login">
          <div className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center rotate-90 shadow">
            <img
              src="https://c.animaapp.com/bt39k2cp/img/polygon-4.svg"
              alt="Back"
              className="w-4 h-4 -rotate-90"
            />
          </div>
        </Link>

        {/* Welcome text */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-center text-white">
          <h1 className="text-[64px] font-bold">Welcome!</h1>
          <p className="mt-2 max-w-md text-[20px]">
            Enter your registered username and email to receive a verification code from the system.
Once verified, you&apos;ll be able to reset your password quickly and securely.
          </p>
        </div>
      </div>

      {/* Form container */}
      <div className="relative flex justify-center -mt-24 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 pt-16">
          {/* Icon */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src="https://c.animaapp.com/bt39k2cp/img/blood-donation-icon-png-4@2x.png"
              alt="Logo"
              className="w-20 h-20 rounded-full bg-white p-1 shadow"
            />
          </div>

          <h2 className="text-center text-red-700 text-xl font-bold mb-6">
            Forget password
          </h2>
          {showNewPasswordForm ? <NewPasswordForm onSubmit={handleNewPasswordSubmit} /> : (showCodeForm ? (
            <CodeForm email={useremail} onSubmit={handleCodeSubmit} onResend={handleResend} />
          ) : (
            <ForgotPasswordForm onSubmit={handleSubmit} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
