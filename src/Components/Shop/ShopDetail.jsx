import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../../Backend/Api/api";

const Header = lazy(() => import("../Header"));
const Footer = lazy(() => import("../Footer"));

const LoadingSpinner = memo(() => (
  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-500 mx-auto"></div>
));
LoadingSpinner.displayName = "LoadingSpinner";

// const ProductCard = memo(({ index }) => (
//   <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
//     <div className="aspect-w-16 aspect-h-12 bg-gray-200">
//       <div className="flex items-center justify-center text-gray-400">
//         <i className="fa-solid fa-image text-4xl"></i>
//       </div>
//     </div>
//     <div className="p-4">
//       <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">
//         Sample Product {index + 1}
//       </h3>
//       <p className="text-gray-600 text-sm mb-3 h-12 overflow-hidden">
//         This is a placeholder product description for demonstration purposes.
//       </p>
//       <div className="flex items-center justify-between">
//         <div className="text-xl font-bold text-emerald-600">$29.99</div>
//         <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   </div>
// ));
// ProductCard.displayName = "ProductCard";

const ShopActions = memo(({ onAction }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
      <i className="fa-solid fa-shopping-bag mr-2 text-emerald-600"></i>
      Shop Actions
    </h3>
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => onAction("browse-products")}
        className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center group"
      >
        <i className="fa-solid fa-search text-2xl text-gray-600 group-hover:text-emerald-600 mb-2 block"></i>
        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">
          Browse Products
        </span>
      </button>
      <button
        onClick={() => onAction("contact-shop")}
        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
      >
        <i className="fa-solid fa-envelope text-2xl text-gray-600 group-hover:text-blue-600 mb-2 block"></i>
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
          Contact Shop
        </span>
      </button>
      <button
        onClick={() => onAction("view-reviews")}
        className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center group"
      >
        <i className="fa-solid fa-star text-2xl text-gray-600 group-hover:text-purple-600 mb-2 block"></i>
        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
          Reviews
        </span>
      </button>
    </div>
  </div>
));
ShopActions.displayName = "ShopActions";

const FeaturedProducts = memo(() => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <i className="fa-solid fa-star mr-2 text-emerald-600"></i>
        Featured Products
      </h3>
      <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
        View All
      </button>
    </div>
    <div className="text-center py-8">
      <i className="fa-solid fa-box text-4xl text-gray-300 mb-3"></i>
      <p className="text-gray-600">No products available yet</p>
      <p className="text-gray-500 text-sm mt-1">
        Check back later for amazing products!
      </p>
    </div>
  </div>
));
FeaturedProducts.displayName = "FeaturedProducts";

const ShopDetail = memo(() => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchShopData = useCallback(async () => {
    if (!shopId) {
      navigate("/shops");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${apiURL}/shops/id/${shopId}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "OK" && response.data.data) {
        setShopData(response.data.data);
        console.log("Shop Data:", response.data.data);
      } else {
        setError("Shop not found.");
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
      if (error.response?.status === 404) {
        setError("Shop not found.");
      } else {
        setError("Failed to load shop data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [shopId, navigate]);

  const handleShopAction = useCallback((action) => {
    console.log(`Shop action clicked: ${action}`);
  }, []);

  const handleBackToShops = useCallback(() => {
    navigate("/shops");
  }, [navigate]);

  const handleContactShop = useCallback(() => {
    console.log("Contact shop clicked");
  }, []);

  const handleShareShop = useCallback(() => {
    if (navigator.share && shopData) {
      navigator
        .share({
          title: shopData.shopName,
          text: shopData.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.log("Shop link copied to clipboard");
    }
  }, [shopData]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  if (loading) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-6 text-gray-600 font-medium">
              Loading shop details...
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
              <i className="fa-solid fa-store-slash text-6xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Shop Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              {error ||
                "The shop you're looking for doesn't exist or has been removed."}
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
                    <p className="text-emerald-100 mt-2">Welcome to our shop</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleContactShop}
                  className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 flex items-center gap-2"
                >
                  <i className="fa-solid fa-envelope"></i>
                  Contact Shop
                </button>
                <button
                  onClick={handleShareShop}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-400 transition-all duration-300 flex items-center gap-2"
                >
                  <i className="fa-solid fa-share"></i>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <ShopActions onAction={handleShopAction} />
            </div>

            <div className="lg:col-span-2">
              <FeaturedProducts products={[]} />
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <i className="fa-solid fa-info-circle mr-2 text-emerald-600"></i>
                About This Shop
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
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className="fa-solid fa-star text-sm"></i>
                      ))}
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {shopData.rating || "4.8"}
                    </span>
                    <span className="text-gray-500 text-sm">(127 reviews)</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Member Since
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {shopData.createdAt
                      ? new Date(shopData.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Products
                  </p>
                  <p className="text-gray-800 font-semibold">0 products</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600 text-sm font-medium">
                    Description
                  </p>
                  <p className="text-gray-800 leading-relaxed mt-1">
                    {shopData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <i className="fa-solid fa-box mr-2 text-emerald-600"></i>
                  All Products
                </h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:border-emerald-500 text-sm font-medium">
                    <i className="fa-solid fa-filter mr-2"></i>
                    Filter
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:border-emerald-500 text-sm font-medium">
                    <i className="fa-solid fa-sort mr-2"></i>
                    Sort
                  </button>
                </div>
              </div>

              <div className="text-center">
                <div className="text-center py-8">
                  <i className="fa-solid fa-box text-4xl text-gray-300 mb-3"></i>
                  <p className="text-gray-600">No products available yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Check back later for amazing products!
                  </p>
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

ShopDetail.displayName = "ShopDetail";
export default ShopDetail;
