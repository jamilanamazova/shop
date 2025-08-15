import React, { useEffect, useReducer, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiURL } from "../../Backend/Api/api";
import axios from "axios";
import { setTokens } from "../../utils/tokenService";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, dispatch] = useReducer(formReducer, initialState);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: "",
    color: "",
    borderColor: "",
  });
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const errorRef = useRef(null);
  const passwordInputRef = useRef(null);
  const fullNameInputRef = useRef(null);

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorMessage(true);

    setTimeout(() => {
      setShowErrorMessage(false);
      setErrorMessage("");
    }, 5000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage("");
    }, 4000);
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
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field, value) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value,
    });
  };

  const handleCheckBoxChange = (field, checked) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value: checked,
    });
  };

  const validateFullName = (name) => {
    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 25) {
      return false;
    }

    if (/\d/.test(trimmedName)) {
      return false;
    }

    if (!/^[A-Za-zƏÖÜÇŞĞİəıöüçşğ\s]+$/.test(trimmedName)) {
      return false;
    }

    const namePattern =
      /^[A-ZƏÖÜÇŞĞİ][a-zəıöüçşğ]+\s[A-ZƏÖÜÇŞĞİ][a-zəıöüçşğ]+$/;

    return namePattern.test(trimmedName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFullName(formData.fullName)) {
      fullNameInputRef.current.classList.remove("hidden");
      return;
    } else {
      fullNameInputRef.current.classList.add("hidden");
    }

    if (formData.password !== formData.confirmPassword) {
      errorRef.current.classList.remove("hidden");
      return;
    } else {
      errorRef.current.classList.add("hidden");
    }

    if (passwordStrength.score < 2) {
      passwordInputRef.current.classList.remove("hidden");
      return;
    } else {
      passwordInputRef.current.classList.add("hidden");
    }

    try {
      const response = await axios.post(`${apiURL}/auth/register`, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      console.log("=== FULL RESPONSE DEBUG ===");
      console.log("Response status:", response.status);
      console.log("Response data:", JSON.stringify(response.data, null, 2));
      console.log("Data.token exists:", !!response.data.token);
      console.log("Data.user exists:", !!response.data.user);
      console.log("=========================");

      const data = response.data;

      let accessToken, refreshToken, userData;

      if (data.data) {
        accessToken = data.data.accessToken;
        refreshToken = data.data.refreshToken;
        userData = data.data.userProfileResponseDto || data.data.user;
      } else {
        accessToken = data.accessToken;
        refreshToken = data.refreshToken;
        userData = data.user || data;
      }

      console.log("Extracted data:");
      console.log("Access Token:", accessToken ? "✅ Found" : "❌ Missing");
      console.log("Refresh Token:", refreshToken ? "✅ Found" : "❌ Missing");
      console.log("User Data:", userData);

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
      }

      const pendingEmail = formData.email;
      const pendingName = formData.fullName;
      localStorage.setItem("pendingMail", pendingEmail);
      localStorage.setItem("pendingUserName", pendingName);

      dispatch({ type: "RESET_FORM" });
      setShowPassword(false);
      setShowConfirmPassword(false);

      setShowRedirectModal(true);

      setTimeout(() => {
        window.location.href = "/confirm-email";
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (data.message) {
            showError(data.message);
          } else if (data.errors) {
            const errorMessages = Object.values(data.errors).join("\n");
            showError(`Validation Errors:\n${errorMessages}`);
          } else {
            showError("Invalid data. Please check your inputs.");
          }
        } else if (status === 409) {
          showError("Email already exists. Please use a different email.");
        } else {
          showError("Registration failed. Please try again.");
        }
      } else if (error.request) {
        showError(
          "Cannot connect to server. Please check your connection and try again."
        );
      } else {
        showError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const PasswordStrengthIndicator = () => {
    if (!formData.password) return null;

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
            <div className="flex-shrink-0">
              <i className="fa-solid fa-check-circle text-xl"></i>
            </div>
            <div className="flex-1">
              <p className="font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => {
                setShowSuccessMessage(false);
                setSuccessMessage("");
              }}
              className="flex-shrink-0 text-white hover:text-green-200"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {showErrorMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
            <div className="flex-shrink-0">
              <i className="fa-solid fa-exclamation-circle text-xl"></i>
            </div>
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
            </div>
            <button
              onClick={() => {
                setShowErrorMessage(false);
                setErrorMessage("");
              }}
              className="flex-shrink-0 text-white hover:text-red-200"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {showRedirectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-pulse">
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-envelope text-blue-600 text-lg"></i>
                  </div>
                  <div className="ml-3 text-left">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      Email Verification Required
                    </h4>
                    <p className="text-xs text-blue-700 mb-2">
                      We've sent a 6-digit verification code to:
                    </p>
                    <p className="text-sm font-medium text-blue-900 bg-blue-100 p-2 rounded">
                      {formData.email}
                    </p>
                    <p className="text-xs text-blue-700 mt-2">
                      Please check your email inbox and enter the code on the
                      next page.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-clock text-orange-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-700">
                      You will be redirected to the email verification page in a
                      few seconds...
                    </p>
                  </div>
                </div>
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
            Create an Account
          </h2>
          <p className="text-gray-600">
            Join us today and start your shopping journey
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <span
                className="text-sm font-[500] password-error text-red-500 hidden"
                ref={fullNameInputRef}
              >
                Please enter a valid full name:
              </span>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/[0-9]/g, "");
                    handleInputChange("fullName", filteredValue);
                  }}
                  placeholder="Enter your full name"
                  maxLength={25}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  required
                />
                <i className="fa-solid fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
              <span
                className="text-sm font-[500] password-error text-red-500 hidden"
                ref={passwordInputRef}
              >
                Please use a strong or medium password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Create a password"
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formData.password
                      ? `${passwordStrength.borderColor} focus:ring-2 focus:ring-opacity-50`
                      : "border-gray-300 focus:ring-black focus:border-black"
                  }`}
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
              <PasswordStrengthIndicator />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <span
                className="text-sm font-[500] password-error text-red-500 hidden"
                ref={errorRef}
              >
                Passwords do not match
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  required
                />
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i
                    className={`fa-solid ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={(e) =>
                  handleCheckBoxChange("terms", e.target.checked)
                }
                className="h-4 w-4 mt-1 text-black focus:ring-black border-gray-300 rounded"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-600"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-black hover:text-gray-800 font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-black hover:text-gray-800 font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-300"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-black hover:text-gray-800 transition-colors"
              >
                Sign in here
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

export default Register;
