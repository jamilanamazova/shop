import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../Backend/Api/api";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiURL}/auth/forgot-password`, {
        email: email,
      });

      console.log("=== FULL RESPONSE DEBUG ===");

      console.log("Response:", response.data);
      console.log("Response status:", response.status);
      console.log("=========================");

      if (response.status === 200) {
        setShowSuccessModal(true);
        setIsLoading(false);
      } else {
        setError("Failed to send password reset email.");
        setIsLoading(false);
      }
    } catch (error) {
      setError("Failed to send password reset email.", error);
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
                <i className="fa-solid fa-envelope-circle-check text-green-600 text-2xl"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Email Sent!
              </h3>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-medium text-gray-800 mb-6 bg-gray-100 p-2 rounded">
                {email}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please check your email and click the link to reset your
                password. The link will expire in 15 minutes.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
              >
                Got it
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the email?{" "}
                  <button className="font-medium text-green-600 hover:text-green-800 transition-colors">
                    Resend
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div className="max-w-md w-full space-y-8" variants={itemVariants}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
            <i className="fa-solid fa-key text-orange-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Your Password?
          </h2>
          <p className="text-gray-600">
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </p>
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
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  required
                  disabled={isLoading}
                />
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send a password reset link to this email address.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 ${
                isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700 transform hover:scale-[1.02]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Sending Reset Link...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Send Reset Link
                </div>
              )}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fa-solid fa-info-circle text-blue-400"></i>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    What happens next?
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• We'll send a secure reset link to your email</li>
                    <li>• Click the link to create a new password</li>
                    <li>• The link expires in 15 minutes for security</li>
                    <li>• Check your spam folder if you don't see it</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>

            <Link
              to="/signin"
              className="inline-flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Sign In
            </Link>
          </div>
        </motion.div>

        <motion.div className="text-center space-y-4" variants={itemVariants}>
          <div className="flex justify-center space-x-6 text-sm">
            <Link
              to="/support"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="fa-solid fa-life-ring mr-1"></i>
              Need Help?
            </Link>
            <Link
              to="/register"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="fa-solid fa-user-plus mr-1"></i>
              Create Account
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fa-solid fa-home mr-2"></i>
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          variants={itemVariants}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fa-solid fa-shield-check text-green-600 text-lg"></i>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-800 mb-1">
                Secure & Private
              </h4>
              <p className="text-xs text-gray-600">
                Your account security is our priority. Reset links are encrypted
                and expire quickly to protect your account.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
