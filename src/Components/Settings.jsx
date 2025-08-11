import React, { useState, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const initialState = {
  fullName: "",
  birthDate: "",
  gender: "",
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

const Settings = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/signin");
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      fullName: formState.fullName || currentUser.fullName,
      birthDate: formState.birthDate || currentUser.birthDate,
      gender: formState.gender || currentUser.gender,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = existingUsers.map((user) => {
      if (user.email === currentUser.email) {
        return {
          ...user,
          fullName: formState.fullName || user.fullName,
          birthDate: formState.birthDate || user.birthDate,
          gender: formState.gender || user.gender,
        };
      }
      return user;
    });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
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
      id: "addresses",
      title: "Addresses",
      icon: "fa-location-dot",
      description: "Manage shipping and billing addresses",
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
        <form
          className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleEditSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={currentUser.fullName}
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
              defaultValue={currentUser.email}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              defaultValue={currentUser.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              defaultValue={currentUser.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-black text-white px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors max-w-[150px] h-[60px]"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
            Profile updated successfully!
          </div>
        )}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Password & Security
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Enter current password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="bg-black text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Notification Preferences
      </h3>

      <div className="space-y-4">
        {[
          {
            title: "Order Updates",
            description: "Get notified about your order status",
          },
          {
            title: "Promotional Emails",
            description: "Receive offers and promotional content",
          },
          {
            title: "New Arrivals",
            description: "Be the first to know about new products",
          },
          {
            title: "Price Drops",
            description: "Get alerts when items in your wishlist go on sale",
          },
          {
            title: "Account Security",
            description: "Important security and account updates",
          },
        ].map((notification, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 className="font-medium text-gray-800">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600">
                {notification.description}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked={index < 2}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddressesSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Saved Addresses
          </h3>
          <button className="bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Add New Address
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { type: "Home", address: "123 Main Street, City, State 12345" },
            {
              type: "Work",
              address: "456 Business Ave, Downtown, State 67890",
            },
          ].map((addr, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                  {addr.type}
                </span>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{addr.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPaymentSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Payment Methods
          </h3>
          <button className="bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Add New Card
          </button>
        </div>

        <div className="space-y-4">
          {[
            { type: "Visa", last4: "1234", expiry: "12/25" },
            { type: "Mastercard", last4: "5678", expiry: "08/26" },
          ].map((card, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <i className="fa-solid fa-credit-card text-gray-400 text-xl"></i>
                <div>
                  <p className="font-medium text-gray-800">
                    {card.type} ending in {card.last4}
                  </p>
                  <p className="text-sm text-gray-600">Expires {card.expiry}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        App Preferences
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
            <option value="en">English</option>
            <option value="az">Azerbaijani</option>
            <option value="tr">Turkish</option>
            <option value="ru">Russian</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
            <option value="azn">AZN (Azerbaijani Manat)</option>
            <option value="usd">USD (US Dollar)</option>
            <option value="eur">EUR (Euro)</option>
            <option value="try">TRY (Turkish Lira)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Zone
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
            <option value="asia/baku">Asia/Baku (GMT+4)</option>
            <option value="europe/istanbul">Europe/Istanbul (GMT+3)</option>
            <option value="europe/moscow">Europe/Moscow (GMT+3)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
            <option value="yyyy-mm-dd">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="bg-black text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Save Preferences
        </button>
      </div>
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
      case "addresses":
        return renderAddressesSection();
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
              <Link to="/profile" className="hover:text-gray-800">
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
              to="/profile"
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
