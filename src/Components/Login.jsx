import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      setShowSuccessModal(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
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
                Signing in Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                You have successfully signed in to your account. Welcome to
                Shopery!
              </p>

              <div className="space-y-3">
                <Link
                  to="/"
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 inline-block"
                  onClick={closeModal}
                >
                  Go to Dashboard
                </Link>
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
                />
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-300"
            >
              Sign In
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                <i className="fa-brands fa-google text-red-500 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                <i className="fa-brands fa-facebook text-blue-600 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>
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
