import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  if (authenticated && user && user.isEmailVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
