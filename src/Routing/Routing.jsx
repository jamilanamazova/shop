import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "../App";
import Home from "../Components/Home";
import About from "../Components/About";
import NotFound from "../Components/NotFound";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
