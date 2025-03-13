import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
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
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;

};

export default ProtectedRoute;
