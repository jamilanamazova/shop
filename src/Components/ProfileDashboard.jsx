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
import { apiURL } from "../Backend/Api/api";
import axios from "axios";

const initialState = {
  firstName: "",
  lastName: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_INITIAL_DATA":
      return {
        ...state,
        firstName: action.data.firstName || "",
        lastName: action.data.lastName || "",
        phone: action.data.phone || "",
        dateOfBirth: action.data.dateOfBirth || "",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(`${apiURL}/customers/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("RESPONSE DATA", response.data);
      console.log("RESPONSE DATA STATUS", response.data.status);
      console.log(response.data.data);

      if (response.data.status === "OK" && response.data.data) {
        setCurrentUser(response.data.data);
        dispatch({
          type: "SET_INITIAL_DATA",
          data: response.data.data,
        });
      }
    } catch (error) {
      console.error("Profile fetch error:", error);

      if (error.response?.status === 401) {
        logout();
        navigate("/signin");
      } else {
        setError("Failed to fetch user profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updateData) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.put(
        `${apiURL}/customers/me/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("RESPONSE", response);
      console.log("RESPONSE DATA", response.data);
      console.log("RESPONSE DATA STATUS", response.data.status);

      if (response.data.status === "OK") {
        await fetchUserProfile();
        setShowEditProfileModal(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/signin");
      } else {
        alert("Failed to update profile");
      }
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const response = await axios.post(
        `${apiURL}/customers/me/profile-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "100 CONTINUE") {
        await fetchUserProfile();
        alert("Profile image updated successfully!");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/signin");
      } else {
        alert("Failed to update profile image");
      }
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchUserProfile();
    } else {
      navigate("/signin");
    }
  }, [authenticated, navigate]);

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <div>No user data available</div>;
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

  const handleInputChange = (field, value) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value,
    });
  };

  const validateName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 25) {
      return false;
    }
    if (/\d/.test(trimmedName)) {
      return false;
    }
    return /^[A-Za-zƏÖÜÇŞĞİəıöüçşğ\s]+$/.test(trimmedName);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (formState.firstName && !validateName(formState.firstName)) {
      alert("Please enter a valid first name format.");
      return;
    }

    if (formState.lastName && !validateName(formState.lastName)) {
      alert("Please enter a valid last name format.");
      return;
    }

    const updateData = {};
    if (formState.firstName) updateData.firstName = formState.firstName;
    if (formState.lastName) updateData.lastName = formState.lastName;

    if (Object.keys(updateData).length > 0) {
      await updateUserProfile(updateData);
    } else {
      setShowEditProfileModal(false);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      await uploadProfileImage(file);
    }
  };

  // const fullName = `${currentUser.firstName || ""} ${
  //   currentUser.lastName || ""
  // }`.trim();

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
              Welcome back, {currentUser.fullName || "User"}!
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
                    {currentUser.profilePhotoUrl ? (
                      <img
                        src={currentUser.profilePhotoUrl}
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
                        First Name
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">
                          {currentUser.firstName || "Not set"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">
                          {currentUser.lastName || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{currentUser.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">
                          {currentUser.phone || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">
                          {currentUser.dateOfBirth
                            ? formatDate(currentUser.dateOfBirth)
                            : "Not set"}
                        </p>
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
              </div>

              {/* ...existing code... */}
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
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.firstName}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(
                        /[0-9]/g,
                        ""
                      );
                      handleInputChange("firstName", filteredValue);
                    }}
                    maxLength={25}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.lastName}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(
                        /[0-9]/g,
                        ""
                      );
                      handleInputChange("lastName", filteredValue);
                    }}
                    maxLength={25}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your last name"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    (formState.firstName &&
                      !validateName(formState.firstName)) ||
                    (formState.lastName && !validateName(formState.lastName))
                  }
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    (formState.firstName &&
                      !validateName(formState.firstName)) ||
                    (formState.lastName && !validateName(formState.lastName))
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Save Changes
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
