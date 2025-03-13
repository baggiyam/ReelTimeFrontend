import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Signup.css";
import { AuthContext } from "../src/context/AuthContext";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, formData);
      console.log("Signup response:", res.data);
      setMessage("Verification code sent to your email.");
      setIsVerifying(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verification`, {
        email: formData.email,
        verificationCode,
      });
      console.log("Full response:", res);
      setMessage(res.data.message);

      if (res.data.token) {
        login(res.data.token);
        setIsVerifying(false);
        setFormData({ username: "", email: "", password: "" });
        setVerificationCode("");
        navigate("/", { state: { message: "Verification successful!" } });
        window.location.reload();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed!");
    }


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
            <button type="submit" className="signup-button">Sign Up</button>
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
            <button type="submit" className="signup-button">Verify</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
