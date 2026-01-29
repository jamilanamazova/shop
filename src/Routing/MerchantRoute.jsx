import React from "react";
import { Navigate } from "react-router-dom";

const MerchantRoute = ({ children }) => {
  const merchantToken = localStorage.getItem("merchantAccessToken");

  if (!merchantToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default MerchantRoute;
