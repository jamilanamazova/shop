import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../Backend/Api/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const loginData = {
      email: email,
      password: password,
    };

    console.log("=== LOGIN DEBUG ===");
    console.log("API URL:", `${apiURL}/auth/login`);
    console.log("Request data:", loginData);
    console.log("==================");

    try {
      console.log("🔑 Attempting login...");

      const response = await axios.post(`${apiURL}/auth/login`, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Login success - Full response:", response);
      console.log("Response data:", response.data);

      const data = response.data;

      console.log("=== RESPONSE STRUCTURE ===");
      console.log("data:", data);
      console.log("data.accessToken:", data.accessToken);
      console.log("data.refreshToken:", data.refreshToken);
      console.log("data.user:", data.user);
      console.log("data.data:", data.data);
      console.log("========================");

      let accessToken, refreshToken;

      if (data.data && data.data.accessToken) {
        accessToken = data.data.accessToken;
        refreshToken = data.data.refreshToken;
      } else if (data.accessToken) {
        accessToken = data.accessToken;
        refreshToken = data.refreshToken;
      } else {
        console.log("❌ Unknown response structure");
        setError("Login response format error. Please try again.");
        return;
      }

      console.log("Extracted tokens:");
      console.log("Access Token:", accessToken ? "✅ Found" : "❌ Missing");
      console.log("Refresh Token:", refreshToken ? "✅ Found" : "❌ Missing");

      console.log("✅ Login successful - tokens updated");

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setShowSuccessModal(true);

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        console.log("❌ No tokens received from backend");
        setError("Login failed. No authentication tokens received.");
      }
    } catch (error) {
      console.error("❌ LOGIN ERROR:", error);

      if (error.response) {
        console.log("Error Response:", error.response);
        console.log("Error Status:", error.response.status);
        console.log("Error Data:", error.response.data);
        console.log("Error Headers:", error.response.headers);

        const status = error.response.status;
        const message =
          error.response.data?.message || error.response.data?.error;

        switch (status) {
          case 400:
            setError("Invalid request. Please check your email and password.");
            break;
          case 401:
            setError("Invalid email or password. Please try again.");
            break;
          case 404:
            setError(
              "Account not found. Please check your email or register first."
            );
            break;
          case 403:
            setError("Please verify your email before signing in.");
            break;
          case 422:
            setError("Validation error. Please check your input.");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(
              message || `Login failed with status ${status}. Please try again.`
            );
        }
      } else if (error.request) {
        console.log("Network Error - No response received");
        setError("Network error. Please check your internet connection.");
      } else {
        console.log("Request Error:", error.message);
        setError("Request failed. Please try again.");
      }

      setTimeout(() => {
        setError("");
      }, 8000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <i className="fa-solid fa-check text-green-600 text-2xl"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back!
              </h3>
              <p className="text-gray-600 mb-6">
                You have successfully signed in to your account. Redirecting to
                home...
              </p>

              <div className="flex justify-center">
                <i className="fa-solid fa-spinner fa-spin text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Shopery</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your account to continue shopping
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-exclamation-circle text-red-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  required
                  disabled={isLoading}
                />
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div>
                {error && (
                  <p className="text-red-500 text-sm mb-2">
                    Invalid email or password. Please try again.
                  </p>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  required
                  disabled={isLoading}
                />
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-black hover:text-gray-800 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-300 ${
                isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-black hover:text-gray-800 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
