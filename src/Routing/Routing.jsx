import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "../App";
import Home from "../Components/Home";
import Products from "../Components/Products";
import Blog from "../Components/Blog";
import Support from "../Components/Support";
import NotFound from "../Components/NotFound";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/support" element={<Support />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
