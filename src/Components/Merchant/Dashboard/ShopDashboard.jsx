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

const AddProductModal = memo(({ open, onClose, onProductAdded }) => {
  const [form, setForm] = useState({
    productName: "",
    description: "",
    condition: "NEW",
    category: "ELECTRONICS",
    price: "",
    stockQuantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        await axios.post(
          `${apiURL}/merchant/products`,
          {
            ...form,
            price: Number(form.price),
            stockQuantity: Number(form.stockQuantity),
          },
          { headers: { "Content-Type": "application/json" } }
        );
        onProductAdded();
        onClose();
      } catch (err) {
        setError("Failed to add product. Please check your input.", err);
      } finally {
        setLoading(false);
      }
    },
    [form, onProductAdded, onClose]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border rounded p-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded p-2"
            required
          />
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="NEW">NEW</option>
            <option value="USED">USED</option>
            <option value="REFURBISHED">REFURBISHED</option>
          </select>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="ELECTRONICS">ELECTRONICS</option>
            <option value="FASHION">FASHION</option>
            <option value="HOME">HOME</option>
            <option value="BEAUTY">BEAUTY</option>
            <option value="SPORTS">SPORTS</option>
            <option value="TOYS">TOYS</option>
          </select>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border rounded p-2"
            required
            min="0"
          />
          <input
            name="stockQuantity"
            type="number"
            value={form.stockQuantity}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="w-full border rounded p-2"
            required
            min="0"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded w-full font-semibold"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
});
AddProductModal.displayName = "AddProductModal";

const SuccessToast = memo(({ message, onClose }) => (
  <div className="fixed top-6 right-6 z-[9999]">
    <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in">
      <i className="fa-solid fa-circle-check text-2xl"></i>
      <span className="font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-emerald-200"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
    <style>
      {`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease;
        }
      `}
    </style>
  </div>
));
SuccessToast.displayName = "SuccessToast";

const ProductsSection = memo(({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <i className="fa-solid fa-box mr-2 text-emerald-600"></i>
          Your Products
        </h3>
        <div className="text-center py-8">
          <i className="fa-solid fa-box-open text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-600">No products yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Products you add will appear here.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <i className="fa-solid fa-box mr-2 text-emerald-600"></i>
        Your Products
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 flex flex-col gap-2 hover:shadow-md transition"
          >
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-cube text-emerald-500"></i>
              <span className="font-semibold">{product.productName}</span>
            </div>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-emerald-700 font-bold">
                ${product.currentPrice}
              </span>
              <span className="text-xs bg-gray-100 rounded px-2 py-1">
                {product.category}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Stock: {product.stockQuantity ?? "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
ProductsSection.displayName = "ProductsSection";

const ShopDashboard = memo(() => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasMerchantAccess = hasMerchantAccount();

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    const token = localStorage.getItem("merchantAccessToken");
    try {
      const response = await axios.get(`${apiURL}/merchant/products`, {
        params: {
          pageable: JSON.stringify({
            page: 0,
            size: 12,
            sort: ["createdAt, desc"],
          }),
        },

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "OK" && response.data.data) {
        setProducts(response.data.data.content);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

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
    if (action === "add-product") {
      setShowAddProduct(true);
    }
  }, []);

  const handleProductAdded = useCallback(() => {
    fetchDashboardData();
    fetchProducts();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [fetchDashboardData, fetchProducts]);

  const handleBackToShops = useCallback(() => {
    navigate("/shops");
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
    fetchProducts();
  }, [fetchDashboardData, fetchProducts]);

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
          {productsLoading ? (
            <LoadingSpinner />
          ) : (
            <ProductsSection products={products} />
          )}
        </div>
      </div>

      <AddProductModal
        open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onProductAdded={handleProductAdded}
      />

      {showSuccess && (
        <SuccessToast
          message="Product successfully added!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <Footer />
    </Suspense>
  );
});

ShopDashboard.displayName = "ShopDashboard";
export default ShopDashboard;
