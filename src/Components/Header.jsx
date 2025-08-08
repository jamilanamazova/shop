import React, { useRef, useState } from "react";
import "../CSS/header.module.css";
import { Link } from "react-router-dom";
import { isAuthenticated, getCurrentUser, logout } from "../utils/auth";

const Header = () => {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

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

  return (
    <>
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
                to={"/products"}
              >
                PRODUCTS
              </Link>
              <Link
                className="font-bold text-sm xl:text-base hover:text-gray-600 transition-colors"
                to={"/blog"}
              >
                BLOG
              </Link>
              <Link
                className="font-bold text-sm xl:text-base hover:text-gray-600 transition-colors"
                to={"/support"}
              >
                SUPPORT
              </Link>
            </ul>
          </div>
        </div>

        <div className="rightHeader">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
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
                    Hi, {user?.name || user?.fullName || "User"}!
                  </span>
                  <Link
                    to="/profile"
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
                    to="/profile"
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
        {/* ✅ Close button */}
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
              to="/products"
              className="font-bold text-lg hover:text-gray-600 transition-colors block py-2"
              onClick={toggleSideBar}
            >
              PRODUCTS
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="font-bold text-lg hover:text-gray-600 transition-colors block py-2"
              onClick={toggleSideBar}
            >
              BLOG
            </Link>
          </li>
          <li>
            <Link
              to="/support"
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
                    {user?.name || user?.fullName || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email || ""}</p>
                </div>
              </div>

              <Link
                to="/profile"
                className="flex items-center space-x-3 py-2 hover:bg-gray-100 rounded px-2 transition-colors"
                onClick={toggleSideBar}
              >
                <i className="fa-solid fa-user text-gray-600"></i>
                <span className="font-medium">My Profile</span>
              </Link>

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
