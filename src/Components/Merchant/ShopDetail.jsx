import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShops } from "../../hooks/useShops";
import Header from "../Header";
import Footer from "../Footer";

const ShopDetail = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { getShopById, loading } = useShops();

  const shop = getShopById(shopId);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!shop) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Shop Not Found
            </h2>
            <button
              onClick={() => navigate("/merchant/shops")}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
            >
              Back to Shops
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate("/merchant/shops")}
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Back to Shops
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {shop.shopName}
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                {shop.description}
              </p>

              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="flex text-yellow-400 text-2xl justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold mt-2 block">
                    {shop.rating} Rating
                  </span>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {shop.productCount || "0"}
                  </div>
                  <span className="text-gray-700 font-semibold">Products</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Products from {shop.shopName}
            </h2>

            <div className="text-center py-16 text-gray-500">
              <i className="fa-solid fa-box text-6xl mb-4"></i>
              <p className="text-xl">Products will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopDetail;
