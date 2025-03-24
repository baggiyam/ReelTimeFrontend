import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/ForgotPassword.css"; // style file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();
  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setIsCodeSent(true); // Move to next step
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        email,
        resetCode,
        newPassword,
      });
      setMessage(res.data.message);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };
  useEffect(() => {
    if (message == "Password reset successful! You can now log in.") {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 15000);
      return () => clearTimeout(timer);
    }

  }, [message, navigate])
  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}

      {!isCodeSent ? (
        <form onSubmit={handleSendCode}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="send-button">Send Reset Code</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            type="text"
            placeholder="Enter Reset Code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="reset-button">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
