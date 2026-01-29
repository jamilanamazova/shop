import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../../Backend/Api/api";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: "",
    color: "",
    borderColor: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        text: "",
        color: "",
        borderColor: "border-gray-300",
      };
    }

    const checks = [
      {
        test: password.length >= 8,
        score: 2,
      },
      {
        test: password.length >= 6 && password.length < 8,
        score: 1,
      },
      {
        test: /[a-z]/.test(password),
        score: 1,
      },
      {
        test: /[A-Z]/.test(password),
        score: 1,
      },
      { test: /\d/.test(password), score: 1 },
      {
        test: /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(password),
        score: 2,
      },
    ];

    let score = 0;

    checks.forEach(({ test, score: points }) => {
      if (test) {
        score += points;
      }
    });

    const strengthLevels = [
      {
        minScore: 6,
        score: 3,
        text: "Strong",
        color: "text-green-500",
        borderColor: "border-green-500",
      },
      {
        minScore: 4,
        score: 2,
        text: "Medium",
        color: "text-orange-500",
        borderColor: "border-orange-500",
      },
      {
        minScore: 1,
        score: 1,
        text: "Weak",
        color: "text-red-500",
        borderColor: "border-red-500",
      },
      {
        minScore: 0,
        score: 0,
        text: "Weak",
        color: "text-red-500",
        borderColor: "border-red-500",
      },
    ];

    const strength =
      strengthLevels.find(({ minScore }) => score >= minScore) ||
      strengthLevels[strengthLevels.length - 1];

    return strength;
  };

  useEffect(() => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  const PasswordStrengthIndicator = () => {
    if (!password) return null;

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${passwordStrength.color}`}>
            Password Strength: {passwordStrength.text}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              passwordStrength.score === 1
                ? "bg-red-500 w-1/3"
                : passwordStrength.score === 2
                ? "bg-orange-500 w-2/3"
                : passwordStrength.score === 3
                ? "bg-green-500 w-full"
                : "bg-gray-300 w-0"
            }`}
          ></div>
        </div>
        <div className="mt-1">
          <p className="text-xs text-gray-600">
            {passwordStrength.score === 1 &&
              "Add uppercase, numbers, and special characters"}
            {passwordStrength.score === 2 &&
              "Good! Consider adding more special characters"}
            {passwordStrength.score === 3 &&
              "Excellent! Your password is strong"}
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const resetToken = urlParams.get("token");

    if (resetToken) {
      setToken(resetToken);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [location]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (passwordStrength.score < 2) {
      setError("Please use a medium or strong password for better security.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== RESET PASSWORD REQUEST ===");
      console.log("Token:", token);
      console.log("New password length:", password.length);
      console.log("===============================");

      const response = await axios.post(`${apiURL}/auth/reset-password`, {
        token: token,
        password: password,
      });

      console.log("=== RESET RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("====================");

      if (response.status === 200) {
        setShowSuccessModal(true);

        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      }
    } catch (error) {
      console.error("❌ RESET PASSWORD ERROR:", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case 400:
            setError("Password requirements not met. Please check your input.");
            break;
          case 401:
            setError(
              "Reset link has expired. Please request a new password reset."
            );
            break;
          case 404:
            setError(
              "Invalid reset link. Please request a new password reset."
            );
            break;
          case 422:
            setError("Passwords do not match or are invalid.");
            break;
          default:
            setError(message || "Failed to reset password. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }

      setTimeout(() => setError(""), 8000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {showSuccessModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <i className="fa-solid fa-check-circle text-green-600 text-2xl"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your password has been successfully updated. You can now sign in
                with your new password.
              </p>

              <div className="flex justify-center mb-4">
                <i className="fa-solid fa-spinner fa-spin text-gray-400"></i>
              </div>
              <p className="text-sm text-gray-500">
                Redirecting to sign in page...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div className="max-w-md w-full space-y-8" variants={itemVariants}>
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Shopery</h1>
          </Link>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <i className="fa-solid fa-lock text-blue-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create New Password
          </h2>
          <p className="text-gray-600">Please enter your new password below.</p>
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          variants={itemVariants}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-exclamation-circle text-red-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    password
                      ? `${passwordStrength.borderColor} focus:ring-2 focus:ring-opacity-50`
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
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

              <PasswordStrengthIndicator />
            </div>

            {/* {password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <div
                    className={`h-2 w-full rounded ${
                      password.length >= 8
                        ? "bg-green-200"
                        : password.length >= 6
                        ? "bg-yellow-200"
                        : "bg-red-200"
                    }`}
                  >
                    <div
                      className={`h-full rounded transition-all duration-300 ${
                        password.length >= 8
                          ? "w-full bg-green-500"
                          : password.length >= 6
                          ? "w-2/3 bg-yellow-500"
                          : "w-1/3 bg-red-500"
                      }`}
                    ></div>
                  </div>
                  <span
                    className={`${
                      password.length >= 8
                        ? "text-green-600"
                        : password.length >= 6
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {password.length >= 8
                      ? "Strong"
                      : password.length >= 6
                      ? "Medium"
                      : "Weak"}
                  </span>
                </div>
              </div>
            )} */}

            <button
              type="submit"
              disabled={isLoading || !token || passwordStrength.score < 2}
              className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ${
                isLoading || !token || passwordStrength.score < 2
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Updating Password...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-key mr-2"></i>
                  Update Password
                  {passwordStrength.score >= 2 && (
                    <i className="fa-solid fa-check ml-2 text-green-400"></i>
                  )}
                </div>
              )}
            </button>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fa-solid fa-shield-check text-green-400"></i>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800 mb-1">
                    Security Tips
                  </h4>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Use a strong, unique password</li>
                    <li>• Include letters, numbers, and symbols</li>
                    <li>• Don't reuse passwords from other accounts</li>
                    <li>• Consider using a password manager</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        <motion.div className="text-center" variants={itemVariants}>
          <Link
            to="/signin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Sign In
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
