import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { hasMerchantAccount } from "../../utils/roleMode";
import axios from "axios";
import { apiURL } from "../../Backend/Api/api";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [pageSize] = useState(12);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const [notification, setNotification] = useState(null);

  const searchTimeoutRef = useRef(null);

  const fetchShops = async (searchQuery = "", showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }
      setError("");

      const params = {
        page: currentPage,
        size: pageSize,
        sort: `${sortBy},${sortDirection}`,
      };

      if (searchQuery.trim()) {
        params.shopName = searchQuery.trim();
      }

      console.log("🔍 Search Query:", searchQuery);
      console.log("📊 API Parameters:", params);
      console.log("🌐 Full URL:", `${apiURL}/shops`);

      console.log("API Parameters:", params);

      const response = await axios.get(`${apiURL}/shops`, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Shops API Response:", response.data);

      if (response.data.status === "OK" && response.data.data) {
        const pageData = response.data.data;

        setShops(pageData.content || []);
        setTotalPages(pageData.totalPages || 1);
        setTotalElements(pageData.totalElements || 0);
        setCurrentPage(pageData.pageable?.pageNumber || 0);
        setLastSearchTerm(searchQuery);
      } else {
        setShops([]);
        setTotalPages(1);
        setTotalElements(0);
        setLastSearchTerm(searchQuery);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      setError("Failed to load shops. Please try again.");
      setShops([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setSearchLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchShops(lastSearchTerm, true);
  }, [currentPage, sortBy, sortDirection]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm === "") {
      setCurrentPage(0);
      fetchShops("", false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(0);
      fetchShops(searchTerm, false);
    }, 800);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setCurrentPage(0);
    fetchShops(searchTerm, false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(0);
    fetchShops("", false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    } else if (formData.shopName.trim().length < 3) {
      newErrors.shopName = "Shop name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateShop = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("merchantAccessToken");

    if (!token) {
      showNotification("You must be a merchant to create a shop", "error");
      return;
    }

    setCreateLoading(true);

    try {
      const response = await axios.post(
        `${apiURL}/users/me/shop`,
        {
          shopName: formData.shopName.trim(),
          description: formData.description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "OK") {
        showNotification("Shop created successfully!", "success");

        setFormData({ shopName: "", description: "" });
        setFormErrors({});
        setShowCreateModal(false);

        setTimeout(() => {
          fetchShops(lastSearchTerm, false);
        }, 1000);
      }
    } catch (error) {
      console.error("failed when creating shop", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Failed to create shop";
        showNotification(errorMessage, "error");
      } else if (error.request) {
        showNotification(
          "Network error. Please check your connection.",
          "error"
        );
      } else {
        showNotification("An unexpected error occurred", "error");
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setFormData({ shopName: "", description: "" });
    setFormErrors({});
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-300 animate-pulse"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">
              Discovering amazing shops...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i
                className={`mr-2 ${
                  notification.type === "success"
                    ? "fa-solid fa-check-circle"
                    : "fa-solid fa-exclamation-triangle"
                }`}
              ></i>
              <span className="font-medium">{notification.message}</span>
            </div>
            <button
              onClick={hideNotification}
              className="ml-4 text-white hover:text-gray-200 transition-colors"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-600 to-gray-700">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-8">
            <nav className="flex items-center space-x-2 text-sm text-emerald-100 mb-8">
              <Link
                to="/"
                className="hover:text-white transition-colors flex items-center"
              >
                <i className="fa-solid fa-home mr-1"></i>
                Home
              </Link>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <span className="text-white font-medium">Shops</span>
            </nav>

            <div className="text-center text-white py-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Discover Amazing Shops
                </span>
              </h1>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
                Explore a curated collection of unique stores offering quality
                products and exceptional service
              </p>
            </div>
          </div>
        </div>
        <div className="relative -mt-8 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-4 mb-8 border border-gray-100 transform transition-all duration-300 h-[100px]">
              <form
                onSubmit={handleManualSearch}
                className="flex flex-col lg:flex-row gap-6"
              >
                <div className="flex-1">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search for shops by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                      {searchLoading ? (
                        <i className="fa-solid fa-spinner animate-spin text-xl"></i>
                      ) : (
                        <i className="fa-solid fa-search text-xl"></i>
                      )}
                    </div>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {searchLoading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-search mr-2"></i>
                      Search
                    </>
                  )}
                </button>
              </form>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:sticky lg:top-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <i className="fa-solid fa-filter mr-2 text-emerald-600"></i>
                    Filters
                  </h3>

                  <div className="space-y-6 lg:space-y-6">
                    <div className="flex-1 lg:flex-none">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <i className="fa-solid fa-sort mr-2 text-emerald-600"></i>
                        Sort By
                      </label>
                      <select
                        value={`${sortBy},${sortDirection}`}
                        onChange={(e) => {
                          const [field, direction] = e.target.value.split(",");
                          setSortBy(field);
                          setSortDirection(direction);
                          setCurrentPage(0);
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm font-medium bg-gray-50 hover:bg-white transition-all"
                      >
                        <option value="createdAt,desc">🆕 Newest First</option>
                        <option value="createdAt,asc">⏰ Oldest First</option>
                        <option value="shopName,asc">🔤 Name A-Z</option>
                        <option value="shopName,desc">🔤 Name Z-A</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:gap-6">
                      <div className="flex-1 lg:flex-none bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-gray-600 text-sm font-medium">
                          <i className="fa-solid fa-store mr-2 text-emerald-600"></i>
                          <span className="hidden sm:inline">Showing </span>
                          {shops.length} of {totalElements} shops
                          {lastSearchTerm && (
                            <div className="mt-2 text-emerald-600 truncate">
                              for "{lastSearchTerm}"
                            </div>
                          )}
                        </div>
                      </div>

                      {hasMerchantAccount() && shops.length <= 1 && (
                        <div className="flex-1 lg:flex-none">
                          <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <i className="fa-solid fa-plus"></i>
                            <span className="hidden sm:inline">
                              Create Shop
                            </span>
                            <span className="sm:hidden">Create</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {error ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 text-center border border-red-100 transform transition-all duration-300">
                    <div className="text-red-500 mb-6">
                      <i className="fa-solid fa-exclamation-triangle text-4xl lg:text-6xl"></i>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
                      Oops! Something went wrong
                    </h3>
                    <p className="text-gray-600 mb-8 text-base lg:text-lg">
                      {error}
                    </p>
                    <button
                      onClick={() => fetchShops(lastSearchTerm, false)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 lg:px-8 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <i className="fa-solid fa-refresh mr-2"></i>
                      Try Again
                    </button>
                  </div>
                ) : searchLoading && shops.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 lg:p-16 text-center transform transition-all duration-300">
                    <div className="text-emerald-500 mb-8">
                      <i className="fa-solid fa-search text-6xl lg:text-8xl animate-pulse"></i>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                      Searching for shops...
                    </h3>
                    <p className="text-gray-600 text-base lg:text-lg">
                      Please wait while we find shops matching "{searchTerm}"
                    </p>
                  </div>
                ) : shops.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 lg:p-16 text-center transform transition-all duration-300">
                    <div className="text-gray-300 mb-8">
                      <i className="fa-solid fa-store text-6xl lg:text-8xl"></i>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                      {lastSearchTerm ? "No shops found" : "No shops available"}
                    </h3>
                    <p className="text-gray-600 mb-10 max-w-lg mx-auto text-base lg:text-lg leading-relaxed">
                      {lastSearchTerm
                        ? `We couldn't find any shops matching "${lastSearchTerm}". Please try a different search term or browse all shops.`
                        : "Be the pioneer! Create the first shop and start your entrepreneurial journey with us."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {lastSearchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="inline-flex items-center bg-gray-600 text-white px-6 lg:px-8 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300"
                        >
                          <i className="fa-solid fa-times mr-2"></i>
                          Clear Search
                        </button>
                      )}
                      {hasMerchantAccount() && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <i className="fa-solid fa-plus mr-2 lg:mr-3"></i>
                          Create Your Shop
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12 transition-all duration-300 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                      {shops.map((shop, index) => (
                        <div
                          key={shop.id || index}
                          className="bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 transform hover:-translate-y-2 cursor-pointer"
                        >
                          <div className="p-4 lg:p-6">
                            <h3 className="font-bold text-lg lg:text-xl text-gray-800 mb-2 lg:mb-3 truncate group-hover:text-emerald-600 transition-colors">
                              {shop.shopName || `Shop ${index + 1}`}
                            </h3>
                            <div className="text-gray-600 text-sm mb-4 h-12 lg:h-16 overflow-hidden">
                              <p className="leading-relaxed line-clamp-2 lg:line-clamp-3">
                                {shop.description ||
                                  "Discover amazing products and exceptional service at this wonderful shop"}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mb-4 lg:mb-6">
                              <div className="flex items-center">
                                <div className="flex text-yellow-400 text-base lg:text-lg">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className="fa-solid fa-star"
                                    ></i>
                                  ))}
                                </div>
                                <span className="text-gray-700 text-sm ml-2 font-semibold">
                                  {shop.rating || "4.8"}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-500 text-xs">
                                  Products
                                </div>
                                <div className="text-gray-800 font-bold">
                                  {shop.productCount || "0"}
                                </div>
                              </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2.5 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-base hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                              <i className="fa-solid fa-arrow-right mr-2"></i>
                              Visit Shop
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 h-[100px]">
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                          className="w-full sm:w-auto px-4 lg:px-6 py-2.5 lg:py-3 border-2 border-gray-200 rounded-lg lg:rounded-xl hover:border-emerald-500 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium transform hover:scale-105 text-sm lg:text-base"
                        >
                          <i className="fa-solid fa-chevron-left mr-1"></i>
                          Previous
                        </button>

                        <div className="flex gap-1 lg:gap-2 overflow-x-auto pb-2 sm:pb-0">
                          {getPageNumbers().map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 lg:w-12 h-10 lg:h-12 rounded-lg lg:rounded-xl font-bold transition-all text-sm lg:text-base flex-shrink-0 ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
                                  : "border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                          className="w-full sm:w-auto px-4 lg:px-6 py-2.5 lg:py-3 border-2 border-gray-200 rounded-lg lg:rounded-xl hover:border-emerald-500 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium transform hover:scale-105 text-sm lg:text-base"
                        >
                          Next
                          <i className="fa-solid fa-chevron-right ml-1"></i>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  <i className="fa-solid fa-store mr-3 text-emerald-600"></i>
                  Create Your Shop
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleCreateShop} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <i className="fa-solid fa-tag mr-2 text-emerald-600"></i>
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    placeholder="Enter your shop name"
                    className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white ${
                      formErrors.shopName
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    }`}
                  />
                  {formErrors.shopName && (
                    <p className="mt-2 text-red-600 text-sm flex items-center">
                      <i className="fa-solid fa-exclamation-circle mr-1"></i>
                      {formErrors.shopName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <i className="fa-solid fa-align-left mr-2 text-emerald-600"></i>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your shop and what makes it special..."
                    rows={5}
                    className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white resize-none ${
                      formErrors.description
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    }`}
                  />
                  {formErrors.description && (
                    <p className="mt-2 text-red-600 text-sm flex items-center">
                      <i className="fa-solid fa-exclamation-circle mr-1"></i>
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {createLoading ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-plus mr-2"></i>
                        Create Shop
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Shops;
