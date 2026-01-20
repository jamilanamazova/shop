import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../../utils/auth";

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const check = () => {
      const a = isAuthenticated();
      const u = getCurrentUser();
      setAuthed(a);
      setUser(u);
      setReady(true);
    };

    check();

    const onStorage = (e) => {
      if (!e || e.key === "accessToken" || e.key === "currentUser") check();
    };
    const onAuth = () => check();

    window.addEventListener("storage", onStorage);
    window.addEventListener("authStateChanged", onAuth);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authStateChanged", onAuth);
    };
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-gray-400 text-2xl mb-2"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const path = location.pathname;
  const isAuthPage =
    path === "/signin" || path === "/register" || path === "/login";

  if (isAuthPage && authed && user?.isEmailVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
