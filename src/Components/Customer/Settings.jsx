import React, { useState, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { apiURL } from "../../Backend/Api/api";
import axios from "axios";

const initialState = {
  fullName: "",
  birthDate: "",
  gender: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ALL":
      return { ...state, ...action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const Settings = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
  });

  const handleGetUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${apiURL}/users/me/profile`, {
        headers: authHeaders(),
      });

      if (response.data?.status === "OK" && response.data?.data) {
        const user = response.data.data;
        setCurrentUser(user);
        const fullName =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.fullName ||
          "";
        dispatch({
          type: "SET_ALL",
          payload: {
            fullName,
            birthDate: user.dateOfBirth || user.birthDate || "",
            gender: user.gender || "",
          },
        });
      } else {
        setError("Failed to load profile");
      }
    } catch (e) {
      console.error("Error fetching user profile:", e);
      if (e.response?.status === 401) navigate("/signin");
      else setError("Could not fetch profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUserProfile();
  }, []);

  const handleInputChange = (field, value) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-gray-700">No profile data.</p>
        </div>
        <Footer />
      </>
    );
  }

  const settingsSections = [
    {
      id: "profile",
      title: "Profile Information",
      icon: "fa-user",
      description: "Update your personal information",
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: "fa-shield-halved",
      description: "Password and security settings",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "fa-bell",
      description: "Manage your notification preferences",
    },
    {
      id: "payment",
      title: "Payment Methods",
      icon: "fa-credit-card",
      description: "Manage your payment options",
    },
    {
      id: "preferences",
      title: "Preferences",
      icon: "fa-sliders",
      description: "Language, currency and other preferences",
    },
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formState.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={currentUser.email || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-gray-50"
              placeholder="Enter your email"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formState.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={formState.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-gray-50"
              disabled
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {/* {!supportsGender && (
              <p className="text-xs text-gray-500 mt-1">
                This field is not supported by the API yet.
              </p>
            )} */}
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="bg-black text-white px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors max-w-[150px] h-[48px] disabled:opacity-60"
              type="submit"
              disabled
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
            Profile updated successfully!
          </div>
        )} */}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Password & Security
        </h3>
        <p className="text-sm text-gray-600">Coming soon</p>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Notification Preferences
      </h3>
      <p className="text-sm text-gray-600">Coming soon</p>
    </div>
  );

  const renderPaymentSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Payment Methods
          </h3>
          <button
            className="bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            disabled
          >
            Add New Card
          </button>
        </div>
        <p className="text-sm text-gray-600">Coming soon</p>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        App Preferences
      </h3>
      <p className="text-sm text-gray-600">Coming soon</p>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "security":
        return renderSecuritySection();
      case "notifications":
        return renderNotificationsSection();
      case "payment":
        return renderPaymentSection();
      case "preferences":
        return renderPreferencesSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <Link to="/" className="hover:text-gray-800">
                Home
              </Link>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <Link to="/customer/profile" className="hover:text-gray-800">
                Profile
              </Link>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <span className="text-gray-800">Account Settings</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your account preferences and security settings
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-8">
                <div className="space-y-2">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        activeSection === section.id
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <i className={`fa-solid ${section.icon} text-sm`}></i>
                      <div>
                        <p className="font-medium text-sm">{section.title}</p>
                        <p
                          className={`text-xs ${
                            activeSection === section.id
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {section.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">{renderActiveSection()}</div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/customer/profile"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Profile
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Settings;
