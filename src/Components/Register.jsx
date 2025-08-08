import React, { useEffect, useReducer, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiURL } from "../Backend/Api/api";
import axios from "axios";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countryCode, setCountryCode] = useState("+994");
  const errorRef = useRef(null);
  const passwordInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const fullNameInputRef = useRef(null);

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

  const validatePhoneNumber = (phone, code = countryCode) => {
    const patterns = {
      "+994": /^(\d{2}\s?\d{3}\s?\d{2}\s?\d{2}|\d{9})$/,
      "+90": /^(\d{3}\s?\d{3}\s?\d{2}\s?\d{2}|\d{10})$/,
      "+1": /^(\d{3}\s?\d{3}\s?\d{4}|\d{10})$/,
      "+44": /^(\d{4}\s?\d{6}|\d{10})$/,
      "+49": /^(\d{3}\s?\d{3}\s?\d{4}|\d{10})$/,
      "+33": /^(\d{2}\s?\d{2}\s?\d{2}\s?\d{2}|\d{10})$/,
      "+7": /^(\d{3}\s?\d{3}\s?\d{2}\s?\d{2}|\d{10})$/,
    };

    const pattern = patterns[code] || patterns["+994"];

    return pattern.test(phone);
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
    handleInputChange("phone", "");
  };

  const validateFullName = (name) => {
    const namePattern =
      /^[A-ZƏÖÜÇŞĞİ][a-zəıöüçşğ]+\s[A-ZƏÖÜÇŞĞİ][a-zəıöüçşğ]+$/;
    return namePattern.test(name);
  };

  const getPhoneMaxLength = (countryCode) => {
    const maxLengths = {
      "+994": 9,
      "+90": 10,
      "+1": 10,
      "+44": 10,
      "+49": 11,
      "+33": 9,
      "+7": 10,
    };
    return maxLengths[countryCode];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFullName(formData.fullName)) {
      fullNameInputRef.current.classList.remove("hidden");
      return;
    } else {
      fullNameInputRef.current.classList.add("hidden");
    }

    if (!validatePhoneNumber(formData.phone)) {
      phoneInputRef.current.classList.remove("hidden");
      return;
    } else {
      phoneInputRef.current.classList.add("hidden");
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
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
      });
      const data = response.data;

      console.log("Registration successful:", data);
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      }
      localStorage.setItem("pendingMail", formData.email);
      localStorage.setItem("pendingUserName", formData.fullName);

      setShowSuccessModal(true);

      if (data.error) {
        console.error("Registration error:", data.error);
        return;
      }

      dispatch({ type: "RESET_FORM" });
      setShowPassword(false);
      setShowConfirmPassword(false);

      setTimeout(() => {
        window.location.href = "/confirm-email";
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (data.message) {
            alert(data.message);
          } else if (data.errors) {
            const errorMessages = Object.values(data.errors).join("\n");
            alert(`Validation Errors:\n${errorMessages}`);
          } else {
            alert("Invalid data. Please check your inputs.");
          }
        } else if (status === 409) {
          alert("Email already exists. Please use a different email.");
        } else {
          alert("Registration failed. Please try again.");
        }
      } else if (error.request) {
        alert(
          "Cannot connect to server. Please check your connection and try again."
        );
      } else {
        alert("An unexpected error occurred. Please try again.");
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
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <i className="fa-solid fa-check text-green-600 text-2xl"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                You have successfully registered your account. Welcome to
                Shopery!
              </p>
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
                Please enter a valid Full Name
              </span>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Enter your full name"
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
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <span
                className="text-sm font-[500] password-error text-red-500 hidden"
                ref={phoneInputRef}
              >
                Please enter a valid phone number format: +994XXXXXXXXX
              </span>
              <div className="relative">
                <div className="flex">
                  <div className="relative">
                    <select
                      name="countryCode"
                      id="countryCode"
                      className="appearance-none bg-gray-50 border border-gray-300 rounded-l-lg px-2 py-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors font-medium"
                      onChange={handleCountryCodeChange}
                    >
                      <option value="+994">🇦🇿 +994</option>
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+7">🇷🇺 +7</option>
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                  </div>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d\s]/g, "");
                      handleInputChange("phone", value);
                    }}
                    maxLength={getPhoneMaxLength(countryCode)}
                    className="flex-1 px-4 py-3 border-l-0 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                    required
                  />
                </div>
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                <i className="fa-brands fa-google text-red-500 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
            </div>
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
