import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { apiURL } from "../Backend/Api/api";

const ConfirmEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    const email = localStorage.getItem("pendingMail");
    const name = localStorage.getItem("pendingUserName");
    if (email) {
      setUserEmail(email);
      setUserName(name || "User");
    } else {
      window.location.href = "/register";
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResendCode = async () => {
    if (isResending || timer > 0) return;
    setIsResending(true);
    setResendMessage("");

    try {
      const response = await axios.post(`${apiURL}/auth/resend-code`, {
        email: userEmail,
      });
      if (response.data.success) {
        setResendMessage("Verification code resent successfully.");
        setShowSuccessModal(true);
        setTimer(300);
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Error resending code:", error);
      if (error.response?.data?.message) {
        setResendMessage(error.response.data.message);
      } else {
        setResendMessage("Failed to resend code. Please try again later.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length < 6) {
      alert("Please enter the complete 6-digit code.");
      return;
    }
    setIsVerifying(true);

    try {
      const response = await axios.post(`${apiURL}/auth/verify`, {
        email: userEmail,
        code: verificationCode,
      });

      console.log("=== VERIFICATION DEBUG ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("AccessToken:", response.data.accessToken);
      console.log("User data:", response.data.data);
      console.log("========================");

      const data = response.data;

      const { accessToken, refreshToken } = data.data;

      console.log("Access Token:", accessToken ? "✅ Found" : "❌ Missing");
      console.log("Refresh Token:", refreshToken ? "✅ Found" : "❌ Missing");
      console.log("User data:", data.data);

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        console.log("Tokens saved successfully!");

        const userPhone =
          localStorage.getItem("pendingPhone") || "Not provided";

        const userData = {
          fullName: userName || "User",
          email: userEmail,
          phone: userPhone,
          isEmailVerified: true,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("currentUser", JSON.stringify(userData));
        console.log("user data saved: ", userData);

        localStorage.removeItem("pendingMail");
        localStorage.removeItem("pendingUserName");

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        console.log("❌ Tokens not found in response");
        alert("Verification failed. No tokens received.");
        return;
      }
    } catch (error) {
      console.error("Verification failed:", error);
      if (error.response?.data?.message) {
        alert("Invalid or expired verification code. Please try again.");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        alert("Verification failed. Please try again");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <>
      <Header />
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
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6">
              <i className="fa-solid fa-envelope text-blue-600 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <i className="fa-solid fa-envelope-open text-green-600 text-2xl"></i>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Check Your Email
                </h3>
                <p className="text-gray-600">
                  We've sent a verification code to{" "}
                  <span className="font-medium text-gray-800">{userEmail}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter 6-digit verification code
                </label>
                <div className="flex justify-center space-x-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 text-center text-lg font-bold border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        digit
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 focus:ring-black focus:border-black"
                      }`}
                      placeholder="X"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-gray-600">
                    Code expires in{" "}
                    <span className="font-medium text-black">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-medium">
                    Verification code has expired
                  </p>
                )}
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={!code.every((digit) => digit) || isVerifying}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
                  code.every((digit) => digit) && !isVerifying
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Verifying...
                  </span>
                ) : (
                  "Verify Email"
                )}
              </button>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>

                {resendMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      resendMessage.includes("sent")
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {resendMessage}
                  </div>
                )}
                <button
                  onClick={handleResendCode}
                  disabled={isResending || timer > 0}
                  className={`text-sm font-medium transition-colors ${
                    timer > 0 || isResending
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black hover:text-gray-600"
                  }`}
                >
                  {isResending ? (
                    <span className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                      Sending...
                    </span>
                  ) : timer > 0 ? (
                    `Resend in ${formatTime(timer)}`
                  ) : (
                    "Resend Code"
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="fa-solid fa-info-circle text-blue-600 mr-2 mt-0.5"></i>
                  <div className="text-left">
                    <p className="text-xs text-blue-800">
                      <strong>Tips:</strong> Check your spam folder if you don't
                      see the email. The code is valid for 5 minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  to="/signin"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300 text-center"
                >
                  Back to Sign In
                </Link>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Need help? Contact our{" "}
                    <Link
                      to="/support"
                      className="text-black hover:text-gray-800 font-medium"
                    >
                      support team
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Home
            </Link>

            <div className="text-xs text-gray-500">
              <p>
                By verifying your email, you agree to our{" "}
                <Link to="/terms" className="text-gray-700 hover:text-gray-900">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmEmail;
