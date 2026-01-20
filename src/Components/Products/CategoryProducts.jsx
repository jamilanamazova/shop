import React, {
  useState,
  useEffect,
  useCallback,
  lazy,
  memo,
  Suspense,
  useRef,
} from "react";
import { useParams, Link } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import { selectFilteredProducts } from "../../store/reducers/productReducer";
import { useSelector } from "react-redux";

const Header = lazy(() => import("../Header"));
const Footer = lazy(() => import("../Footer"));

const LoadingSpinner = memo(() => (
  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-500 mx-auto"></div>
));
LoadingSpinner.displayName = "LoadingSpinner";

const ProductCard = memo(({ product }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const discountPercentage =
    product.originalPrice && product.currentPrice
      ? Math.round(
          ((product.originalPrice - product.currentPrice) /
            product.originalPrice) *
            100,
        )
      : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden bg-gray-100 h-48">
        {!imageError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <i className="fa-solid fa-image text-4xl text-gray-300"></i>
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discountPercentage}%
          </div>
        )}

        {product.condition && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase">
            {product.condition}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
          {product.productName}
        </h3>

        <p className="text-gray-600 text-sm mb-3 h-12 overflow-hidden line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-emerald-600">
              ${product.currentPrice?.toFixed(2) || product.price?.toFixed(2)}
            </div>
            {product.originalPrice &&
              product.originalPrice > product.currentPrice && (
                <div className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </div>
              )}
          </div>

          {product.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {product.stockQuantity !== undefined && (
          <div className="text-xs text-gray-500 mb-3">
            {product.stockQuantity > 0 ? (
              <span className="text-green-600">
                <i className="fa-solid fa-check-circle mr-1"></i>
                {product.stockQuantity} in stock
              </span>
            ) : (
              <span className="text-red-600">
                <i className="fa-solid fa-times-circle mr-1"></i>
                Out of stock
              </span>
            )}
          </div>
        )}

        <button
          disabled={product.stockQuantity === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
            product.stockQuantity === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105"
          }`}
        >
          <i className="fa-solid fa-cart-plus"></i>
          {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
});
ProductCard.displayName = "ProductCard";

const CategoryProducts = memo(() => {
  const { categorySlug } = useParams();

  const categoryName = categorySlug
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const {
    products,
    loading,
    error,
    loadProducts,
    filterProducts,
    resetFilters,
  } = useProducts();

  const filteredProducts = useSelector(selectFilteredProducts);

  // Ref istifadə edərək filter callback'lərinin dəyişməsini əngəlləyirik
  const filterAppliedRef = useRef(false);

  useEffect(() => {
    if (categoryName && !filterAppliedRef.current) {
      filterAppliedRef.current = true;
      filterProducts({ category: categoryName.toUpperCase() });
    }

    return () => {
      filterAppliedRef.current = false;
      resetFilters();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);

  // Category mapping for icons and gradients
  const getCategoryInfo = useCallback((category) => {
    const categoryMap = {
      Electronics: { icon: "📱" },
      Clothing: { icon: "👕" },
      "Home & Garden": {
        icon: "🏠",
      },
      Books: { icon: "📚" },
      Sports: { icon: "⚽" },
      Automotive: { icon: "🚗" },
    };

    return categoryMap[category] || { icon: "🏷️" };
  }, []);

  const categoryInfo = getCategoryInfo(categoryName);

  if (loading) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-6 text-gray-600 font-medium">
              Loading {categoryName} products...
            </p>
          </div>
        </div>
        <Footer />
      </Suspense>
    );
  }

  if (error) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 mb-6">
              <i className="fa-solid fa-exclamation-triangle text-6xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => loadProducts()}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300"
            >
              <i className="fa-solid fa-refresh mr-2"></i>
              Try Again
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6 filter drop-shadow-lg">
              {categoryInfo.icon}
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              {categoryName}
            </h1>
            <p className="text-xl text-emerald-50 mb-6 max-w-2xl mx-auto drop-shadow-sm">
              Discover amazing {categoryName?.toLowerCase()} products from
              trusted sellers
            </p>

            <nav className="flex items-center justify-center text-emerald-100 text-sm">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <i className="fa-solid fa-chevron-right mx-2"></i>
              <Link
                to="/products"
                className="hover:text-white transition-colors"
              >
                Products
              </Link>
              <i className="fa-solid fa-chevron-right mx-2"></i>
              <span className="text-white">{categoryName}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {categoryName} Products
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <Link
              to="/products"
              className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <i className="fa-solid fa-grid"></i>
              View All Products
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="text-gray-300 mb-6">
                <div className="text-6xl mb-4">{categoryInfo.icon}</div>
                <i className="fa-solid fa-box-open text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No {categoryName} Products Yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We don't have any {categoryName?.toLowerCase()} products
                available right now. Check back soon or explore other
                categories!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <i className="fa-solid fa-grid mr-2"></i>
                  Browse All Products
                </Link>
                <Link
                  to="/"
                  className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <i className="fa-solid fa-home mr-2"></i>
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </Suspense>
  );
});

CategoryProducts.displayName = "CategoryProducts";
export default CategoryProducts;
