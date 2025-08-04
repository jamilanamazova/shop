import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "../App";
import Home from "../Components/Home";
import Products from "../Components/Products";
import Blog from "../Components/Blog";
import Support from "../Components/Support";
import NotFound from "../Components/NotFound";
import Login from "../Components/Login";
import Register from "../Components/Register";
import Profile from "../Components/ProfileDashboard"; // Assuming ProfileDashboard is the component for user profile

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/support" element={<Support />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
