import React, { useEffect, useState } from "react";
import {
  applyAuthHeaderForMode,
  clearMerchantSession,
  setAppMode,
} from "../../utils/roleMode";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  useEffect(() => {
    setAppMode("merchant");
  }, []);

const stats = [
    {
      icon: "fa-solid fa-box",
      title: "Total Products",
      value: "127",
      change: "+12%",
      color: "blue",
    },
    {
      icon: "fa-solid fa-shopping-cart",
      title: "Total Orders",
      value: "456",
      change: "+8%",
      color: "green",
    },
    {
      icon: "fa-solid fa-dollar-sign",
      title: "Revenue",
      value: "$12,847",
      change: "+23%",
      color: "purple",
    },
    {
      icon: "fa-solid fa-users",
      title: "Customers",
      value: "234",
      change: "+5%",
      color: "orange",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      amount: "$125.99",
      status: "Pending",
      date: "2025-08-14",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      amount: "$89.50",
      status: "Shipped",
      date: "2025-08-13",
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      amount: "$234.00",
      status: "Delivered",
      date: "2025-08-12",
    },
    {
      id: "#ORD-004",
      customer: "Sarah Wilson",
      amount: "$67.25",
      status: "Processing",
      date: "2025-08-11",
    },
  ];

  const topProducts = [
    { name: "Organic Bananas", sales: 145, revenue: "$1,450" },
    { name: "Fresh Tomatoes", sales: 123, revenue: "$1,230" },
    { name: "Green Apples", sales: 98, revenue: "$980" },
    { name: "Carrots", sales: 87, revenue: "$435" },
  ];

  const handleMerchantLogout = () => {
    clearMerchantSession();
    applyAuthHeaderForMode();
    window.location.href = "/";
  };

  const handleSwitchToCustomer = () => {
    setShowSwitchModal(true);
  };

  const confirmSwitchToCustomer = () => {
    setShowSwitchModal(false);
    setAppMode("customer");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Merchant Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleMerchantLogout}
                className="w-full sm:w-auto bg-red-50 text-red-600 px-3 py-2 text-sm rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                <i className="fa-solid fa-right-from-bracket mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
              <button className="w-full sm:w-auto bg-green-600 text-white px-3 py-2 text-sm rounded-lg font-medium hover:bg-green-700 transition-colors">
                <i className="fa-solid fa-plus mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </button>

              <button
                onClick={handleSwitchToCustomer}
                className="w-full sm:w-auto bg-blue-600 text-white px-3 py-2 text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <i className="fa-solid fa-user mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Shop as Customer</span>
                <span className="sm:hidden">Shop</span>
              </button>

              <div className="relative">
                <i className="fa-solid fa-bell text-gray-600 text-lg sm:text-xl cursor-pointer hover:text-gray-800"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <nav className="flex flex-wrap justify-center sm:justify-start gap-2 sm:space-x-4 sm:gap-0">
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                icon: "fa-solid fa-chart-line",
              },
              { id: "products", label: "Products", icon: "fa-solid fa-box" },
              {
                id: "orders",
                label: "Orders",
                icon: "fa-solid fa-shopping-cart",
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: "fa-solid fa-chart-bar",
              },
              { id: "settings", label: "Settings", icon: "fa-solid fa-cog" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-green-100 text-green-700 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <i
                  className={`${tab.icon} mr-1 sm:mr-2 text-xs sm:text-sm`}
                ></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.label === "Dashboard"
                    ? "Home"
                    : tab.label === "Products"
                    ? "Items"
                    : tab.label === "Orders"
                    ? "Orders"
                    : tab.label === "Analytics"
                    ? "Stats"
                    : "Config"}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-full bg-${stat.color}-100`}>
                  <i
                    className={`${stat.icon} text-${stat.color}-600 text-sm sm:text-lg lg:text-xl`}
                  ></i>
                </div>
                <span className="text-green-600 text-xs sm:text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-xs sm:text-sm font-medium">
                {stat.title}
              </h3>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h3>
                  <button className="text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-3 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="pb-2 sm:pb-3">Order ID</th>
                        <th className="pb-2 sm:pb-3 hidden sm:table-cell">
                          Customer
                        </th>
                        <th className="pb-2 sm:pb-3">Amount</th>
                        <th className="pb-2 sm:pb-3">Status</th>
                        <th className="pb-2 sm:pb-3 hidden md:table-cell">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-2 sm:py-3 font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="py-2 sm:py-3 text-gray-700 hidden sm:table-cell">
                            {order.customer}
                          </td>
                          <td className="py-2 sm:py-3 font-medium text-gray-900">
                            {order.amount}
                          </td>
                          <td className="py-2 sm:py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Processing"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2 sm:py-3 text-gray-600 hidden md:table-cell">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Top Products
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {product.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {product.sales} sales
                        </p>
                      </div>
                      <p className="font-semibold text-green-600 text-sm sm:text-base">
                        {product.revenue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  <button className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <i className="fa-solid fa-plus text-green-600 mr-2 sm:mr-3 text-sm"></i>
                      <span className="font-medium text-sm sm:text-base">
                        Add New Product
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                  </button>

                  <button className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <i className="fa-solid fa-edit text-blue-600 mr-2 sm:mr-3 text-sm"></i>
                      <span className="font-medium text-sm sm:text-base">
                        Manage Inventory
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                  </button>

                  <button
                    onClick={handleSwitchToCustomer}
                    className="w-full flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <i className="fa-solid fa-shopping-bag text-blue-600 mr-2 sm:mr-3 text-sm"></i>
                      <span className="font-medium text-blue-700 text-sm sm:text-base">
                        Shop as Customer
                      </span>
                    </div>
                    <i className="fa-solid fa-external-link-alt text-blue-400 text-xs"></i>
                  </button>

                  <button className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <i className="fa-solid fa-truck text-purple-600 mr-2 sm:mr-3 text-sm"></i>
                      <span className="font-medium text-sm sm:text-base">
                        Shipping Settings
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                  </button>

                  <button className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <i className="fa-solid fa-chart-line text-orange-600 mr-2 sm:mr-3 text-sm"></i>
                      <span className="font-medium text-sm sm:text-base">
                        View Reports
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSwitchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full mr-3 sm:mr-4">
                <i className="fa-solid fa-user-tag text-blue-600 text-lg sm:text-xl"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Switch to Customer Mode
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Shop products as a customer
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <div className="flex items-start">
                <i className="fa-solid fa-info-circle text-blue-600 mr-2 sm:mr-3 mt-0.5"></i>
                <div className="text-xs sm:text-sm text-blue-800">
                  <p className="font-medium mb-1">
                    You will be switched to customer mode
                  </p>
                  <p>
                    You can return to merchant dashboard anytime from the header
                    menu.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowSwitchModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitchToCustomer}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <i className="fa-solid fa-shopping-bag mr-2"></i>
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;
