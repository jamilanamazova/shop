import React, { useState, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../CSS/ProfileDashboard.css";
import {
  isAuthenticated,
  getCurrentUser,
  logout,
  checkTokens,
} from "../utils/auth";
import { Navigate } from "react-router-dom";

const initialState = {
  fullName: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
};

const ProfileDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getCurrentUser();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/signin");
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    window.location.href = "/";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (field, value) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value,
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

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (formState.fullName && !validateFullName(formState.fullName)) {
      alert("Please enter a valid full name format.");
      return;
    }

    const updatedUser = {
      ...currentUser,
      fullName: formState.fullName || currentUser.fullName,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = existingUsers.map((user) => {
      if (user.id === currentUser?.id) {
        return {
          ...user,
          fullName: formState.fullName || user.fullName,
        };
      }
      return user;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setShowEditProfileModal(false);
    window.location.reload();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...currentUser, profileImage: reader.result };
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = existingUsers.map((user) => {
          if (user.id === currentUser?.id) {
            return {
              ...user,
              profileImage: reader.result,
            };
          }
          return user;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(currentUser);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Profile Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.fullName || "User"}!
              <button
                onClick={checkTokens}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                (Check Token Status)
              </button>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <div className="relative profile-picture w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    {currentUser.profileImage ? (
                      <img
                        src={currentUser.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <i className="fa-solid fa-user text-3xl text-gray-600"></i>
                    )}
                    <div className="overlay">
                      <i className="fa-solid fa-camera text-gray-400 camera-icon"></i>
                      <span className="sr-only">Change profile picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleProfileImageChange}
                      />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {currentUser.fullName}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {currentUser.email}
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      onClick={() => setShowEditProfileModal(true)}
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Account Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{currentUser.fullName}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User ID
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800 font-mono text-sm">
                          #{currentUser.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Date
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-800">
                        {formatDate(currentUser.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Quick Actions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/orders"
                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-box text-gray-600 mr-3"></i>
                    <div>
                      <h4 className="font-medium text-gray-800">My Orders</h4>
                      <p className="text-sm text-gray-600">
                        View order history
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-heart text-gray-600 mr-3"></i>
                    <div>
                      <h4 className="font-medium text-gray-800">Wishlist</h4>
                      <p className="text-sm text-gray-600">Saved items</p>
                    </div>
                  </Link>

                  <Link
                    to="/addresses"
                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-location-dot text-gray-600 mr-3"></i>
                    <div>
                      <h4 className="font-medium text-gray-800">Addresses</h4>
                      <p className="text-sm text-gray-600">Manage addresses</p>
                    </div>
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-gear text-gray-600 mr-3"></i>
                    <div>
                      <h4 className="font-medium text-gray-800">Settings</h4>
                      <p className="text-sm text-gray-600">Account settings</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fa-solid fa-sign-out-alt text-red-600"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout from your account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout} // ✅ Updated logout function
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      // ProfileDashboard.jsx-də showEditProfileModal section-unu düzəlt:
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Edit Profile
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.fullName}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(
                        /[0-9]/g,
                        ""
                      );
                      handleInputChange("fullName", filteredValue);
                    }}
                    maxLength={25}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    formState.fullName && !validateFullName(formState.fullName)
                  }
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    formState.fullName && !validateFullName(formState.fullName)
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {formState.fullName && !validateFullName(formState.fullName)
                    ? "Please fix validation errors"
                    : "Save Changes"}
                </button>
              </form>

              <button
                onClick={() => setShowEditProfileModal(false)}
                className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ProfileDashboard;
