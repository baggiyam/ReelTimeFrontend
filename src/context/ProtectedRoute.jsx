import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  return token ? (
    children
  ) : (
    <div className="protected-route-container">
      <div className="protected-message-box">

        <p>Login/signup</p>
        <a href="/login" className="login-link">Go to Login</a>
      </div>
    </div>
  );
};

export default ProtectedRoute;
