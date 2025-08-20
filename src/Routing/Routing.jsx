import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "../Components/Routes/PublicRoute";
import Home from "../Components/Home";
import NotFound from "../Components/NotFound";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import ConfirmEmail from "../Components/Auth/ConfirmEmail";
import ForgotPassword from "../Components/Auth/ForgotPassword";
import ResetPassword from "../Components/Auth/ResetPassword";
import MerchantRoutes from "./MerchantRoutes";
import CustomerRoutes from "./CustomerRoutes";
import Shops from "../Components/Merchant/Shops";
import ProtectedRoute from "../Components/Routes/ProtectedRoute";

import PublicShopDetail from "../Components/Shop/ShopDetail";
import ShopDashboard from "../Components/Merchant/Dashboard/ShopDashboard";
import ProfileDashboard from "../Components/Customer/ProfileDashboard";

const Routing = () => {
  const user = localStorage.getItem("appMode");
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      <Route path="/shops" element={<Shops />} />
      <Route path="/shop/:shopId" element={<PublicShopDetail />} />

      <Route
        path="/merchant/shops/:shopId/dashboard"
        element={<ShopDashboard />}
      />

      <Route
        path={`${
          user === "merchant" ? "/merchant/profile" : "/customer/profile"
        }`}
        element={
          <ProtectedRoute>
            <ProfileDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/merchant/dashboard" element={<ShopDashboard />} />

      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />

      <Route path="/merchant/*" element={<MerchantRoutes />} />

      <Route path="/customer/*" element={<CustomerRoutes />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
