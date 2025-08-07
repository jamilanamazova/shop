import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const ConfirmEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

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
                <p className="text-gray-600 text-sm mb-6">
                  We've sent a 6-digit verification code to your email address.
                  Please enter the code below to verify your account.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Verification Code
                </label>
                <div className="flex justify-center space-x-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
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
                <p className="text-sm text-gray-600">
                  Code expires in{" "}
                  <span className="font-medium text-black">05:00</span>
                </p>
              </div>

              <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-300">
                Verify Email
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button className="text-black hover:text-gray-800 font-medium transition-colors">
                    Resend Code
                  </button>
                </p>
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
