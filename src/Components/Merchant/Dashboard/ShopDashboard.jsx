import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../../../Backend/Api/api";
import { hasMerchantAccount } from "../../../utils/roleMode";

const Header = lazy(() => import("../../Header"));
const Footer = lazy(() => import("../../Footer"));

const LoadingSpinner = memo(() => (
  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-500 mx-auto"></div>
));
LoadingSpinner.displayName = "LoadingSpinner";

const QuickActions = memo(({ onAction }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
      <i className="fa-solid fa-bolt mr-2 text-emerald-600"></i>
      Quick Actions
    </h3>
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => onAction("add-product")}
        className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center group"
      >
        <i className="fa-solid fa-plus text-2xl text-gray-600 group-hover:text-emerald-600 mb-2 block"></i>
        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">
          Add Product
        </span>
      </button>
      <button
        onClick={() => onAction("view-orders")}
        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
      >
        <i className="fa-solid fa-shopping-cart text-2xl text-gray-600 group-hover:text-blue-600 mb-2 block"></i>
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
          View Orders
        </span>
      </button>
      <button
        onClick={() => onAction("shop-settings")}
        className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center group"
      >
        <i className="fa-solid fa-cog text-2xl text-gray-600 group-hover:text-purple-600 mb-2 block"></i>
        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
          Settings
        </span>
      </button>
      <button
        onClick={() => onAction("analytics")}
        className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-center group"
      >
        <i className="fa-solid fa-chart-line text-2xl text-gray-600 group-hover:text-orange-600 mb-2 block"></i>
        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">
          Analytics
        </span>
      </button>
    </div>
  </div>
));
QuickActions.displayName = "QuickActions";

const RecentOrders = memo(() => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <i className="fa-solid fa-receipt mr-2 text-emerald-600"></i>
        Recent Orders
      </h3>
    </div>
    <div className="text-center py-8">
      <i className="fa-solid fa-shopping-cart text-4xl text-gray-300 mb-3"></i>
      <p className="text-gray-600">No orders yet</p>
      <p className="text-gray-500 text-sm mt-1">
        Orders will appear here when customers make purchases
      </p>
    </div>
  </div>
));
RecentOrders.displayName = "RecentOrders";

const ShopDashboard = memo(() => {
  const navigate = useNavigate();

  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasMerchantAccess = hasMerchantAccount();

  const fetchDashboardData = useCallback(async () => {
    if (!hasMerchantAccess) {
      navigate("/shops");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const shopResponse = await axios.get(
        `${apiURL}/merchant/shops/dashboard`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (shopResponse.data.status === "OK" && shopResponse.data.data) {
        setShopData(shopResponse.data.data);
        console.log("Shop Data:", shopResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [hasMerchantAccess, navigate]);

  const handleQuickAction = useCallback((action) => {
    console.log(`Quick action clicked: ${action}`);
  }, []);

  const handleBackToShops = useCallback(() => {
    navigate("/shops");
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-6 text-gray-600 font-medium">
              Loading your shop dashboard...
            </p>
          </div>
        </div>
        <Footer />
      </Suspense>
    );
  }

  if (error || !shopData) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 mb-6">
              <i className="fa-solid fa-exclamation-triangle text-6xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Access Denied
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "You do not have access to this shop dashboard."}
            </p>
            <button
              onClick={handleBackToShops}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Shops
            </button>
          </div>
        </div>
        <Footer />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <button
                    onClick={handleBackToShops}
                    className="mr-4 p-2 hover:bg-emerald-500 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-arrow-left text-xl"></i>
                  </button>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {shopData.shopName}
                    </h1>
                    <p className="text-emerald-100 mt-2">Shop Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <QuickActions onAction={handleQuickAction} />
            </div>

            <div className="lg:col-span-2">
              <RecentOrders orders={[]} />
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <i className="fa-solid fa-info-circle mr-2 text-emerald-600"></i>
                Shop Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Shop Name</p>
                  <p className="text-gray-800 font-semibold">
                    {shopData.shopName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Rating</p>
                  <p className="text-gray-800 font-semibold">
                    {shopData.rating || "No rating yet"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Income
                  </p>
                  <p className="text-gray-800 font-semibold">
                    ${shopData.totalIncome || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Created</p>
                  <p className="text-gray-800 font-semibold">
                    {shopData.createdAt
                      ? new Date(shopData.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600 text-sm font-medium">
                    Description
                  </p>
                  <p className="text-gray-800">{shopData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </Suspense>
  );
});

ShopDashboard.displayName = "ShopDashboard";
export default ShopDashboard;
