import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../Components/ProtectedRoute";
import PublicRoute from "../Components/PublicRoute";
import Home from "../Components/Home";
import Products from "../Components/Products";
import Blog from "../Components/Blog";
import Support from "../Components/Support";
import NotFound from "../Components/NotFound";
import Login from "../Components/Login";
import Register from "../Components/Register";
import Profile from "../Components/ProfileDashboard"; // Assuming ProfileDashboard is the component for user profile
import Settings from "../Components/Settings";
import Product from "../Components/Product";
import noise from "../Images/noise.jpg";
import ConfirmEmail from "../Components/ConfirmEmail";
import ForgotPassword from "../Components/ForgotPassword";
import ResetPassword from "../Components/ResetPassword";
import Addresses from "../Components/Addresses";
const Routing = () => {
  const topPicksProducts = [
    {
      id: 1,
      name: "Noise-cancelling",
      price: "9.99",
      originalPrice: "12.99",
      image: noise,
      category: "electronics",
    },
    {
      id: 2,
      name: "Stylish Jacket",
      price: "45.99",
      originalPrice: "65.99",
      image:
        "https://cdn.shopify.com/s/files/1/0867/4417/0787/files/winter-jacket-for-men.jpg?v=1725260898",
      category: "fashion",
    },
    {
      id: 3,
      name: "Comfortable Sofa",
      price: "299.99",
      originalPrice: "399.99",
      image:
        "https://cdn.thewirecutter.com/wp-content/media/2024/12/BEST-ONLINE-SOFAS-SUB-2048px-sixpenny-aria-grande.jpg?auto=webp&quality=75&width=1024",
      category: "furniture",
    },
    {
      id: 4,
      name: "Gourmet dog cookies",
      price: "9.99",
      originalPrice: "14.99",
      image:
        "https://i.etsystatic.com/13595738/r/il/2f46cf/3711835356/il_570xN.3711835356_e5c9.jpg",
      category: "pets",
    },
    {
      id: 5,
      name: "Natural bird feed",
      price: "7.99",
      originalPrice: "11.99",
      image:
        "https://peckishbirdfood.com/cdn/shop/products/60051338_1_v2.jpg?v=1675160670",
      category: "pets",
    },
    {
      id: 6,
      name: "Durable chew toy",
      price: "12.99",
      originalPrice: "18.99",
      image:
        "https://m.media-amazon.com/images/I/71KHlJw+8TL._UF1000,1000_QL80_.jpg",
      category: "pets",
    },
  ];
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
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products products={topPicksProducts} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <Product products={topPicksProducts} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog"
        element={
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        }
      />
      <Route
        path="/addresses"
        element={
          <ProtectedRoute>
            <Addresses />
          </ProtectedRoute>
        }
      />
      <Route path="/settings" element={<Settings />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
