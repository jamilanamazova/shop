import React, { useEffect, useRef, useState } from "react";
import "../CSS/header.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser, logout } from "../utils/auth";
import axios from "axios";
import { apiURL } from "../Backend/Api/api";
import { hasMerchantAccount, setAppMode } from "../utils/roleMode";

const Header = () => {
  const [currentUser, setCurrentUser] = useState();
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [isBecomingMerchant, setIsBecomingMerchant] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const authenticated = isAuthenticated();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const location = useLocation();
  const isEmailVerified = user?.isEmailVerified;

  const handleShowSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage("");
    }, 3000);
  };

  const handleShowErrorMessage = (message) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
    setTimeout(() => {
      setShowErrorMessage(false);
      setErrorMessage("");
    }, 4000);
  };

  const handleBecomeMerchant = () => {
    setShowMerchantModal(true);
  };

  const confirmBecomeMerchant = async () => {
    try {
      setIsBecomingMerchant(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.post(
        `${apiURL}/users/me/be-merchant`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Merchant response", response.data);

      if (response.data.status === "OK" && response.data.data) {
        localStorage.setItem(
          "merchantAccessToken",
          response.data.data.accessToken
        );
        localStorage.setItem(
          "merchantRefreshToken",
          response.data.data.refreshToken
        );

        setAppMode("merchant");

        setShowMerchantModal(false);

        handleShowSuccessMessage("Welcome to your merchant dashboard!");

        setTimeout(() => {
          navigate("/merchant/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error becoming merchant:", error);
      handleShowErrorMessage(
        "Failed to activate merchant account. Please try again."
      );
    } finally {
      setIsBecomingMerchant(false);
    }
  };

  const handleGetUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(`${apiURL}/users/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("RESPONSE DATA", response.data);
      console.log("RESPONSE DATA STATUS", response.data.status);
      console.log(response.data.data);

      if (response.data.status === "OK") {
        setCurrentUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      handleGetUserProfile();
    }
  }, [authenticated]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const hamburgerMenuRef = useRef(null);
  const [openSideBar, setOpenSideBar] = useState(false);

  const toggleSideBar = () => {
    setOpenSideBar(!openSideBar);
    if (hamburgerMenuRef.current) {
      if (!openSideBar) {
        hamburgerMenuRef.current.style.transform = "translateX(0)";
        hamburgerMenuRef.current.style.backgroundColor = "white";
        hamburgerMenuRef.current.style.boxShadow = "2px 0 10px rgba(0,0,0,0.1)";
      } else {
        hamburgerMenuRef.current.style.transform = "translateX(-100%)";
      }
    }
    if (openSideBar) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    document.body.style.transition = "overflow 0.3s ease-in-out";
  };

  if (location.pathname === "/confirm-email") {
    return null;
  }

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
            <i className="fa-solid fa-check-circle text-xl"></i>
            <p className="font-medium">{successMessage}</p>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-white hover:text-green-200"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {showErrorMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
            <i className="fa-solid fa-exclamation-circle text-xl"></i>
            <p className="font-medium">{errorMessage}</p>
            <button
              onClick={() => setShowErrorMessage(false)}
              className="text-white hover:text-red-200"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}
      <header className="p-4 lg:p-7 flex justify-between items-center max-w-[93%] m-auto relative">
        <div className="leftHeader flex gap-3 md:gap-12 items-center">
          <div className="bagIcon">
            <span className="text-xl">
              <i className="fa-solid fa-bag-shopping"></i>
            </span>
          </div>

          <div
            className="hamburger-menu lg:hidden cursor-pointer"
            onClick={toggleSideBar}
          >
            <span className="text-xl">
              <i className="fa-solid fa-bars"></i>
            </span>
          </div>

          <div className="headerLinks hidden lg:block">
            <ul className="flex gap-8 xl:gap-12 items-center list-none">
              <Link
                className="font-bold text-sm xl:text-base hover:text-gray-600 transition-colors"
                to={"/"}
              >
                HOME
              </Link>
              <Link
                className="font-bold text-sm xl:text-base hover:text-gray-600 transition-colors"
                to={"/customer/products"}
              >
                PRODUCTS
              </Link>
              <Link
                className="font-bold text-sm xl:text-base hover:text-gray-600 transition-colors"
                to={"/customer/blog"}
              >
                BLOG
              </Link>
              <Link
                className="font-bold text-sm xl:text-base hover:text-gray-600 transition-colors"
                to={"/customer/support"}
              >
                SUPPORT
              </Link>
            </ul>
          </div>
        </div>

        <div className="rightHeader">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              {authenticated && (
                <div className="hidden lg:block">
                  {hasMerchantAccount() ? (
                    <Link
                      to="/merchant/dashboard"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Merchant Dashboard
                    </Link>
                  ) : (
                    <button
                      className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse"
                      onClick={handleBecomeMerchant}
                    >
                      <i className="fa-solid fa-store mr-2"></i>
                      Be a Merchant
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
                        NEW
                      </span>
                    </button>
                  )}
                </div>
              )}
              <div className="search-icon cursor-pointer hover:text-gray-600 transition-colors">
                <i className="fa-solid fa-magnifying-glass text-lg"></i>
              </div>
              <div className="cart-icon cursor-pointer hover:text-gray-600 transition-colors">
                <i className="fa-solid fa-cart-shopping text-lg"></i>
              </div>
            </div>

            {authenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                  <span className="text-gray-700 text-sm lg:text-base max-w-[100px] lg:max-w-none truncate">
                    Hi, {currentUser?.firstName || user?.fullName}!
                  </span>
                  <Link
                    to="/customer/profile"
                    className="text-gray-700 hover:text-green-600 transition-colors"
                    title="Profile"
                  >
                    <i className="fa-solid fa-user-circle text-xl"></i>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>

                <div className="flex md:hidden items-center space-x-2">
                  <Link
                    to="/customer/profile"
                    className="text-gray-700 hover:text-green-600 transition-colors"
                    title="Profile"
                  >
                    <i className="fa-solid fa-user-circle text-xl"></i>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Logout"
                  >
                    <i className="fa-solid fa-sign-out-alt text-lg"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/register"
                  className="hover:text-gray-700 transition-colors"
                  title="Sign Up"
                >
                  <i className="fa-solid fa-user text-lg"></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {showMerchantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <i className="fa-solid fa-store text-green-600 text-2xl"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Become a Merchant
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                You're about to activate your merchant account. This will allow
                you to:
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <ul className="text-left text-sm text-green-800 space-y-2">
                  <li className="flex items-start">
                    <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                    Sell products on our platform
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                    Access merchant dashboard
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                    Manage orders and inventory
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                    View sales analytics
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <i className="fa-solid fa-info-circle text-blue-600 mr-2 mt-0.5"></i>
                  <p className="text-left text-sm text-blue-800">
                    You can switch between customer and merchant modes anytime.
                    Your shopping experience will remain unchanged.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 font-medium mb-8">
                Are you ready to start your merchant journey?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowMerchantModal(false)}
                  disabled={isBecomingMerchant}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Not Now
                </button>
                <button
                  onClick={confirmBecomeMerchant}
                  disabled={isBecomingMerchant}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    isBecomingMerchant
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isBecomingMerchant ? (
                    <div className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Activating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <i className="fa-solid fa-rocket mr-2"></i>
                      Yes, Let's Go!
                    </div>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                By becoming a merchant, you agree to our{" "}
                <a
                  href="/merchant-terms"
                  className="text-green-600 hover:underline"
                >
                  Merchant Terms of Service
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="hamburger-menu-content w-64 h-screen p-6 lg:hidden"
        ref={hamburgerMenuRef}
        style={{
          transform: "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          backgroundColor: "white",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Menu</h3>
          <button
            onClick={toggleSideBar}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <ul className="flex flex-col gap-4 list-none mb-6">
          <li>
            <Link
              to="/"
              className="font-bold text-lg hover:text-gray-600 transition-colors block py-2"
              onClick={toggleSideBar}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/customer/products"
              className="font-bold text-lg hover:text-gray-600 transition-colors block py-2"
              onClick={toggleSideBar}
            >
              PRODUCTS
            </Link>
          </li>
          <li>
            <Link
              to="/customer/blog"
              className="font-bold text-lg hover:text-gray-600 transition-colors block py-2"
              onClick={toggleSideBar}
            >
              BLOG
            </Link>
          </li>
          <li>
            <Link
              to="/customer/support"
              className="font-bold text-lg hover:text-gray-600 transition-colors block py-2"
              onClick={toggleSideBar}
            >
              SUPPORT
            </Link>
          </li>
        </ul>

        <div className="border-t pt-4">
          {authenticated ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-4">
                <i className="fa-solid fa-user-circle text-2xl text-gray-600"></i>
                <div>
                  <p className="font-medium text-gray-800">
                    {currentUser?.firstName || user?.fullName || "User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentUser?.email || ""}
                  </p>
                </div>
              </div>
              <Link
                to="/customer/profile"
                className="flex items-center space-x-3 py-2 hover:bg-gray-100 rounded px-2 transition-colors"
                onClick={toggleSideBar}
              >
                <i className="fa-solid fa-user text-gray-600"></i>
                <span className="font-medium">My Profile</span>
              </Link>
              {hasMerchantAccount() ? (
                <Link
                  to="/merchant/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Merchant Dashboard
                </Link>
              ) : (
                <button
                  className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse"
                  onClick={handleBecomeMerchant}
                >
                  <i className="fa-solid fa-store mr-2"></i>
                  Be a Merchant
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                </button>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  toggleSideBar();
                }}
                className="flex items-center space-x-3 py-2 hover:bg-red-50 rounded px-2 transition-colors w-full text-left text-red-600"
              >
                <i className="fa-solid fa-sign-out-alt"></i>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/signin"
                className="block w-full text-center bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={toggleSideBar}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                onClick={toggleSideBar}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {openSideBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] lg:hidden"
          onClick={toggleSideBar}
        ></div>
      )}

      <hr className="max-w-[95%] m-auto text-gray-500" />
    </>
  );
};

export default Header;
