import React, { useEffect, useReducer, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import axios from "axios";
import { apiURL } from "../Backend/Api/api";
import Header from "./Header";
import Footer from "./Footer";

const initialState = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  country: "",
  postalCode: "",
  default: false,
};

const countries = [
  { value: "", label: "Select Country" },
  { value: "Azerbaijan", label: "Azerbaijan" },
  { value: "Turkey", label: "Turkey" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Russia", label: "Russia" },
];

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_INITIAL_DATA":
      return {
        ...state,
        addressLine1: action.payload.addressLine1 || "",
        addressLine2: action.payload.addressLine2 || "",
        city: action.payload.city || "",
        country: action.payload.country || "",
        postalCode: action.payload.postalCode || "",
        default: action.payload.default || false,
      };
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

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formState, dispatch] = useReducer(formReducer, initialState);

  const [loadingStates, setLoadingStates] = useState({});
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const setAddressLoading = (addressId, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [addressId]: isLoading,
    }));
  };

  const isAddressLoading = (addressId) => {
    return loadingStates[addressId] || false;
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage("");
    }, 3000);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      console.log("📥 Fetching addresses from backend...");

      const response = await axios.get(`${apiURL}/customers/me/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "OK" && response.data.data) {
        console.log("📥 Fetched addresses:", response.data.data);
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error("Addresses fetch error:", error);

      if (error.response?.status === 401) {
        logout();
        navigate("/signin");
      } else {
        setError("Failed to fetch addresses");
      }
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async () => {
    try {
      setModalSubmitting(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const addressData = {
        addressLine1: formState.addressLine1,
        addressLine2: formState.addressLine2,
        city: formState.city,
        country: formState.country,
        postalCode: formState.postalCode,
        default: formState.default,
      };

      const response = await axios.post(
        `${apiURL}/customers/me/addresses`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "OK") {
        if (formState.default) {
          setAddresses((prevAddresses) => [
            ...prevAddresses.map((addr) => ({ ...addr, default: false })),
            response.data.data,
          ]);
        } else {
          setAddresses((prevAddresses) => [
            ...prevAddresses,
            response.data.data,
          ]);
        }

        dispatch({ type: "RESET_FORM" });
        setShowAddModal(false);

        showSuccess("Address added successfully!");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/signin");
      } else {
        alert("Failed to add address. Please try again.");
      }
    } finally {
      setModalSubmitting(false);
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      setModalSubmitting(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      console.log("🔄 Starting updateAddress function");
      console.log("📥 Received addressId:", addressId);
      console.log("📥 Received addressData:", addressData);

      const currentAddress = addresses.find((addr) => addr.id === addressId);
      console.log("📍 Current address found:", currentAddress);

      if (!currentAddress?.default && addressData.default) {
        setAddresses((prevAddresses) =>
          prevAddresses.map((address) =>
            address.id === addressId ? address : { ...address, default: false }
          )
        );
      }

      console.log("📤 Making PUT request to backend...");

      const response = await axios.put(
        `${apiURL}/customers/me/addresses/${addressId}`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Backend response:", response.data);
      console.log("✅ Backend status:", response.data.status);
      console.log("📄 Backend data:", response.data.data);

      if (response.data.status === "OK" && response.data.data) {
        console.log("✅ Update successful, updating local state");
        if (addressData.default) {
          console.log(
            "🔄 Setting this address as default, making others false"
          );
          setAddresses((prevAddresses) =>
            prevAddresses.map((address) =>
              address.id === addressId
                ? response.data.data
                : { ...address, default: false }
            )
          );
        } else {
          setAddresses((prevAddresses) =>
            prevAddresses.map((address) =>
              address.id === addressId ? response.data.data : address
            )
          );
        }

        dispatch({ type: "RESET_FORM" });
        setShowEditModal(false);
        setSelectedAddress(null);

        showSuccess("Address updated successfully!");
      }
    } catch (error) {
      console.error("Error updating address: ", error);

      if (error.response?.status === 401) {
        logout();
        navigate("/signin");
      } else {
        alert("Failed to update address");
      }
    } finally {
      setModalSubmitting(false);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      setModalSubmitting(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.delete(
        `${apiURL}/customers/me/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "OK") {
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address.id !== addressId)
        );

        setShowDeleteModal(false);
        setSelectedAddress(null);

        showSuccess("Address deleted successfully!");
      } else {
        alert("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);

      if (error.response?.status === 401) {
        logout();
        navigate("/signin");
      } else {
        alert("Failed to delete address. Please try again.");
      }
    } finally {
      setModalSubmitting(false);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      setAddressLoading(addressId, true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const currentAddress = addresses.find((addr) => addr.id === addressId);

      if (!currentAddress) {
        alert("address not found");
        return;
      }

      const addressData = {
        addressLine1: currentAddress.addressLine1,
        addressLine2: currentAddress.addressLine2,
        city: currentAddress.city,
        country: currentAddress.country,
        postalCode: currentAddress.postalCode,
        default: true,
      };

      console.log("🔄 Setting default address:", addressId);
      console.log("📤 Sending data:", addressData);

      const response = await axios.put(
        `${apiURL}/customers/me/addresses/${addressId}`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Backend response:", response.data);

      if (response.data.status === "OK" && response.data.data) {
        console.log("✅ Backend confirmed success, updating local state");

        setAddresses((prevAddresses) => {
          const updatedAddresses = prevAddresses.map((address) => ({
            ...address,
            default: address.id === addressId ? true : false,
          }));
          console.log("🔄 Updated local addresses:", updatedAddresses);
          return updatedAddresses;
        });

        showSuccess("Default address updated successfully!");
      } else {
        console.error("❌ Backend did not confirm success");
        alert("Failed to set default address");
      }
    } catch (error) {
      console.error("💥 Error setting default address:", error);
      console.error("💥 Error response:", error.response?.data);
      if (error.response?.status === 401) {
        logout();
        navigate("/signin");
      } else {
        alert("Failed to set default address. Please try again.");
      }
    } finally {
      setAddressLoading(addressId, false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading addresses...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAddresses}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleInputChange = (field, value) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (
      !formState.addressLine1.trim() ||
      !formState.city.trim() ||
      !formState.country.trim() ||
      !formState.postalCode.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    await addAddress();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (
      !formState.addressLine1.trim() ||
      !formState.city.trim() ||
      !formState.country.trim() ||
      !formState.postalCode.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!selectedAddress) {
      alert("No address selected for editing");
      return;
    }

    const addressData = {
      addressLine1: formState.addressLine1,
      addressLine2: formState.addressLine2,
      city: formState.city,
      country: formState.country,
      postalCode: formState.postalCode,
      default: formState.default,
    };

    console.log("🔄 Editing address:", selectedAddress.id);
    console.log("📝 Form state:", formState);
    console.log("📤 Sending address data:", addressData);
    console.log("🎯 Default checkbox value:", formState.default);
    console.log("📍 Selected address before edit:", selectedAddress);

    await updateAddress(selectedAddress.id, addressData);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAddress) {
      alert("No address selected for deletion");
      return;
    }

    await deleteAddress(selectedAddress.id);
  };

  const openEditModal = (address) => {
    setSelectedAddress(address);
    dispatch({
      type: "SET_INITIAL_DATA",
      payload: {
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        country: address.country,
        postalCode: address.postalCode,
        default: address.default,
      },
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (address) => {
    setSelectedAddress(address);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  return (
    <>
      <Header />

      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
            <div className="flex-shrink-0">
              <i className="fa-solid fa-check-circle text-xl"></i>
            </div>
            <div className="flex-1">
              <p className="font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => {
                setShowSuccessMessage(false);
                setSuccessMessage("");
              }}
              className="flex-shrink-0 text-white hover:text-green-200"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  My Addresses
                </h1>
                <p className="text-gray-600">Manage your delivery addresses</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i>
                Add New Address
              </button>
            </div>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <i className="fa-solid fa-location-dot text-6xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No addresses found
              </h3>
              <p className="text-gray-600 mb-6">
                Add your first delivery address to get started
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
                    address.default ? "border-green-500" : "border-transparent"
                  }`}
                >
                  {address.default && (
                    <div className="mb-4">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        <i className="fa-solid fa-star mr-1"></i>
                        Default Address
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="font-bold text-gray-800 mb-2">
                      <i className="fa-solid fa-location-dot mr-2 text-gray-600"></i>
                      Address
                    </h3>
                    <div className="text-gray-700 text-sm space-y-1">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.country}
                      </p>
                      <p>{address.postalCode}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!address.default && (
                      <button
                        onClick={() => setDefaultAddress(address.id)}
                        disabled={isAddressLoading(address.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          isAddressLoading(address.id)
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        {isAddressLoading(address.id)
                          ? "Setting..."
                          : "Set Default"}
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(address)}
                      className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors bg-gray-50 text-gray-600 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(address)}
                      className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Add New Address
              </h3>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Country or region <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formState.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.addressLine1}
                    onChange={(e) =>
                      handleInputChange("addressLine1", e.target.value)
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formState.addressLine2}
                    onChange={(e) =>
                      handleInputChange("addressLine2", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter postal code"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    modalSubmitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {modalSubmitting ? "Adding..." : "Add Address"}
                </button>
              </form>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Edit Address
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={formState.addressLine1}
                    onChange={(e) =>
                      handleInputChange("addressLine1", e.target.value)
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formState.addressLine2}
                    onChange={(e) =>
                      handleInputChange("addressLine2", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formState.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Country *
                    </label>
                    <select
                      value={formState.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formState.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter postal code"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    modalSubmitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {modalSubmitting ? "Updating..." : "Update Address"}
                </button>
              </form>

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAddress(null);
                  resetForm();
                }}
                className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fa-solid fa-trash text-red-600"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Delete Address
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this address?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-700">
                  {selectedAddress.addressLine1}
                </p>
                {selectedAddress.addressLine2 && (
                  <p className="text-sm text-gray-700">
                    {selectedAddress.addressLine2}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  {selectedAddress.city}, {selectedAddress.country}
                </p>
                <p className="text-sm text-gray-700">
                  {selectedAddress.postalCode}
                </p>
              </div>
              <p className="text-red-600 text-sm mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedAddress(null);
                  }}
                  disabled={modalSubmitting}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={modalSubmitting}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    modalSubmitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {modalSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Addresses;
