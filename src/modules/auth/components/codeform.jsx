// import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";

// const CodeForm = ({ email, onSubmit, onResend }) => {
//   const [code, setCode] = useState(Array(6).fill(""));
//   const [timeLeft, setTimeLeft] = useState(60);
//   const inputRefs = useRef([]);

//   useEffect(() => {
//     if (timeLeft <= 0) return;
//     const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const handleChange = (e, index) => {
//     const value = e.target.value.replace(/[^0-9]/g, "");
//     if (!value) return;
//     const newCode = [...code];
//     newCode[index] = value.charAt(0);
//     setCode(newCode);

//     if (index < 5 && inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ code: code.join("") });
//   };

//   const handleResend = () => {
//     if (typeof onResend === "function") {
//       onResend(); // Gọi hàm gửi lại mã từ cha (nếu có)
//     }
//     setCode(Array(6).fill(""));
//     setTimeLeft(60);
//     inputRefs.current[0]?.focus();
//   };

//   const isExpired = timeLeft <= 0;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label className="text-sm block mb-1 font-bold">
//           OTP code đã gửi đến <span className="text-red-600 font-semibold">{email}</span>
//         </label>
//       </div>

//       <div className="flex justify-between gap-2">
//         {code.map((digit, index) => (
//           <input
//             key={index}
//             ref={(el) => (inputRefs.current[index] = el)}
//             type="text"
//             maxLength="1"
//             value={digit}
//             onChange={(e) => handleChange(e, index)}
//             disabled={isExpired}
//             className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//           />
//         ))}
//       </div>

//       <div className="text-sm font-bold text-red-600">
//         {isExpired
//           ? <button
//               type="button"
//               onClick={handleResend}
//               className="text-blue-600 underline hover:text-blue-800 transition"
//             >
//               Send code again
//             </button>
//           : `Code có hiệu lực trong ${timeLeft}s`}
//       </div>

//       <button
//         type="submit"
//         disabled={isExpired}
//         className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 transition disabled:opacity-50"
//       >
//         Confirm
//       </button>
//     </form>
//   );
// };

// CodeForm.propTypes = {
//   email: PropTypes.string.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   onResend: PropTypes.func, // Thêm prop tùy chọn cho resend
// };

// export default CodeForm;
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

const CodeForm = ({ email, onSubmit, onResend }) => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits

    if (value.length === 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }

    // User pasted full code
    if (value.length === 6) {
      const values = value.slice(0, 6).split("");
      setCode(values);
      values.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = digit;
        }
      });
      if (inputRefs.current[5]) inputRefs.current[5].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (pastedData.length === 6) {
      const values = pastedData.split("");
      setCode(values);
      values.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = digit;
        }
      });
      if (inputRefs.current[5]) inputRefs.current[5].focus();
      e.preventDefault();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (!code[index] && index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        newCode[index] = "";
        setCode(newCode);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ code: code.join("") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    onResend?.();
    setCode(Array(6).fill(""));
    setTimeLeft(60);
    inputRefs.current[0]?.focus();
  };

  const isExpired = timeLeft <= 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm block mb-1 font-bold">
          OTP code đã gửi đến{" "}
          <span className="text-red-600 font-semibold">{email}</span>
        </label>
      </div>

      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isExpired}
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        ))}
      </div>

      <div className="text-sm font-bold text-red-600">
        {isExpired ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            Send code again
          </button>
        ) : (
          `Code có hiệu lực trong ${timeLeft}s`
        )}
      </div>

      <button
        type="submit"
        disabled={isExpired || isSubmitting}
        className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 transition disabled:opacity-50"
      >
        {isSubmitting ? "Confirming..." : "Confirm"}
      </button>
    </form>
  );
};

CodeForm.propTypes = {
  email: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onResend: PropTypes.func,
};

export default CodeForm;
