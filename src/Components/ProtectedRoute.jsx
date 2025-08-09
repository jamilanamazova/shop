import React, { Children } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  if (!authenticated || !user) {
    return <Navigate to="/confirm-email" state={{ from: location }} replace />;
  }

  if (!user.isEmailVerified) {
    console.log("Email not verified, redirecting to home.");
    return <Navigate to="/confirm-email" replace />;
  }

  console.log("access granted to protected route");
  return children;
};

export default ProtectedRoute;
