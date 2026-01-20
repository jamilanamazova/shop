import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import axios from "axios";
import { apiURL } from "../../Backend/Api/api";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  // Note: we avoid keeping separate user state to prevent unused variables and loops
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      await axios.get(`${apiURL}/users/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error fetching user profile in ProtectedRoute:", error);
      // setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [authenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Don't immediately redirect if profile is null; allow page to render for
  // cases where profile is not strictly required. Components can fetch as needed.
  // This prevents redirect loops on home or other public pages embedding ProtectedRoute.

  return children;
};

export default ProtectedRoute;
