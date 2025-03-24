import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Login.css";
import { AuthContext } from "../src/context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, formData);
      login(res.data.token);
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed!";
      setMessage(errorMsg);

      if (errorMsg.includes("verify your email")) {
        setShowVerificationPopup(true);
      }
    }
  };

  const handleVerify = async () => {
    setPopupMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verification`, {
        email: formData.email,
        verificationCode,
      });

      if (res.data.token) {
        login(res.data.token);
        navigate("/");
        setShowVerificationPopup(false);
      } else {
        setPopupMessage("Verification failed! Please check your code.");
      }
    } catch (error) {
      setPopupMessage(
        error.response?.data?.message || "Verification failed!"
      );
    }
  };

  const handleResendCode = async () => {
    setPopupMessage("Resending code...");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/resend-code`, {
        email: formData.email,
      });

      setPopupMessage(res.data.message || "Verification code resent!");
    } catch (error) {
      setPopupMessage(
        error.response?.data?.message || "Failed to resend code!"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />

          {/* Forgot Password Link */}
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      {/* Verification Popup */}
      {showVerificationPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Email Verification</h3>
            <p>Enter the code sent to your email.</p>
            <input
              type="number"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="input-field"
            />
            <button onClick={handleVerify} className="verify-button">Verify</button>
            <button onClick={handleResendCode} className="resend-button">Resend Code</button>
            <button onClick={() => setShowVerificationPopup(false)} className="close-button">Close</button>
            {popupMessage && <p className="message">{popupMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
