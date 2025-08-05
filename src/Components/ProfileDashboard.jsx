import React, { useState, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../CSS/ProfileDashboard.css";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/signin");
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setShowLogoutModal(false);
    navigate("/");
    window.location.reload();
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
      field: field,
      value: value,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      fullName: formState.fullName || currentUser.fullName,
      email: formState.email || currentUser.email,
      phone: formState.phone || currentUser.phone,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = existingUsers.map((user) => {
      if (user.id === currentUser?.id) {
        return {
          ...user,
          fullName: formState.fullName || user.fullName,
          email: formState.email || user.email,
          phone: formState.phone || user.phone,
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
              Manage your account information and settings
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
                        Phone Number
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{currentUser.phone}</p>
                      </div>
                    </div>
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
                        {formatDate(currentUser.registrationDate)}
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
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Edit Profile
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={currentUser.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={currentUser.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    pattern="(^\d{3}\s\d{3}\s\d{2}\s\d{2}$)|(^\d{10}$)"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
