import React from "react";
import { Route, Routes } from "react-router-dom";
// import MerchantRoute from "./MerchantRoute";
// import Shops from "../Components/Merchant/Shops";
// Gələcəkdə əlavə ediləcək komponentlər
// import MerchantProducts from "../Components/MerchantProducts";
// import MerchantOrders from "../Components/MerchantOrders";
// import MerchantProfile from "../Components/MerchantProfile";
// import MerchantSettings from "../Components/MerchantSettings";

const MerchantRoutes = () => {
  return (
    <Routes>
      {/* <Route
        path="/shops"
        element={
          <MerchantRoute>
            <Shops />
          </MerchantRoute>
        }
      /> */}

      {/* Gələcəkdə əlavə ediləcək route-lar */}
      {/* 
      <Route
        path="/products"
        element={
          <MerchantRoute>
            <MerchantProducts />
          </MerchantRoute>
        }
      />
      
      <Route
        path="/orders"
        element={
          <MerchantRoute>
            <MerchantOrders />
          </MerchantRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <MerchantRoute>
            <MerchantProfile />
          </MerchantRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <MerchantRoute>
            <MerchantSettings />
          </MerchantRoute>
        }
      />
      */}
    </Routes>
  );
};

export default MerchantRoutes;
