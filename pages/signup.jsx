import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Signup.css";

const Signup = ({ setToken }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, formData);
      console.log("Signup response:", res.data);
      setMessage("Verification code sent to your email.");
      setIsVerifying(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verification`, {
        email: formData.email,
        verificationCode,
      });
      console.log("Full response:", res);
      setMessage(res.data.message);

      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        setToken(res.data.token);

        setIsVerifying(false);
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        setVerificationCode("");
      }


    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed!");
    }
    navigate("/", { state: { message: "Verification successful!" } });
    window.location.reload();
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Signup</h2>
        {message && <p className="message">{message}</p>}
        {!isVerifying ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />
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
            <button type="submit" disabled={loading} className="signup-button">
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <input
              type="text"
              name="verificationCode"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="input-field"
            />
            <button type="submit" disabled={loading} className="signup-button">
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
