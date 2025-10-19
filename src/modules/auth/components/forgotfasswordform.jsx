import  { useState } from "react";
import PropTypes from "prop-types";
const ForgotPasswordForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isSending, setIsSending] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await onSubmit({ username, email });
    } catch (error) {
      console.error("Error sending code:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-black block mb-1 [font-family:'Open_Sans',Helvetica] font-bold">User Name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your User Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="text-sm text-black block mb-1 [font-family:'Open_Sans',Helvetica] font-bold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 transition"
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send code"}
      </button>
    </form>
  );
};
ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default ForgotPasswordForm;