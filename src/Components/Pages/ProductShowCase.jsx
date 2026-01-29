import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import "../../CSS/ProductShowcase.css";
import catWithToys from "../../Images/catwithtoys.jpg";

const TimerDisplay = memo(({ timeLeft }) => {
  const formattedTime = useMemo(
    () => ({
      days: timeLeft.days.toString().padStart(2, "0"),
      hours: timeLeft.hours.toString().padStart(2, "0"),
      minutes: timeLeft.minutes.toString().padStart(2, "0"),
      seconds: timeLeft.seconds.toString().padStart(2, "0"),
    }),
    [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
  );

  return (
    <div className="flex justify-center gap-2 text-2xl font-bold">
      <div className="bg-white text-black px-3 py-2 rounded">
        {formattedTime.days}
      </div>
      <div className="bg-white text-black px-3 py-2 rounded">
        {formattedTime.hours}
      </div>
      <span className="text-white">:</span>
      <div className="bg-white text-black px-3 py-2 rounded">
        {formattedTime.minutes}
      </div>
      <div className="bg-white text-black px-3 py-2 rounded">
        {formattedTime.seconds}
      </div>
    </div>
  );
});
TimerDisplay.displayName = "TimerDisplay";

const ProductCard = memo(({ product, onAddToCart, onToggleWishlist }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToCart(product);
    },
    [product, onAddToCart]
  );

  const handleToggleWishlist = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsWishlisted((prev) => !prev);
      onToggleWishlist(product);
    },
    [product, onToggleWishlist]
  );

  const formattedPrice = useMemo(() => {
    const currentPrice = product.price ? parseFloat(product.price) : 0;
    const originalPrice = product.originalPrice
      ? parseFloat(product.originalPrice)
      : 0;

    return {
      current: !isNaN(currentPrice) ? currentPrice.toFixed(2) : "0.00",
      original: !isNaN(originalPrice) ? originalPrice.toFixed(2) : "0.00",
    };
  }, [product.price, product.originalPrice]);

  return (
    <Link
      to={`/customer/product/${product.id}`}
      className="block"
      aria-label={`View ${product.name} details`}
    >
      <div className="bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative group">
          <div className="h-40 bg-gray-300 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center  bg-opacity-20">
            <button
              onClick={handleAddToCart}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer transform hover:scale-105"
              aria-label={`Add ${product.name} to cart`}
            >
              Add to cart
            </button>
          </div>

          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <i
              className={`fa-${isWishlisted ? "solid" : "regular"} fa-heart`}
            ></i>
          </button>
        </div>

        <div className="p-4">
          <h4
            className="font-medium text-gray-800 mb-2 truncate"
            title={product.name}
          >
            {product.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">
              ${formattedPrice.current}
            </span>
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${formattedPrice.original}
                </span>
              )}
          </div>
        </div>
      </div>
    </Link>
  );
});
ProductCard.displayName = "ProductCard";

const Sidebar = memo(({ timeLeft, onExploreClick }) => (
  <div className="lg:col-span-1 space-y-6">
    <div className="bg-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <i className="fa-solid fa-gift" aria-hidden="true"></i>
        Special Deals
      </h3>
    </div>

    <div className="bg-gray-200 rounded-lg p-6 text-center">
      <h4 className="text-xl font-bold mb-2">Featured</h4>
      <p className="text-sm text-gray-600 mb-4">Introducing Fresh</p>
      <div className="flex justify-center items-center mb-4">
        <div className="relative">
          <img
            src={catWithToys}
            alt="Featured cat with toys - 20% off"
            className="w-32 h-25 rounded-lg object-cover"
            loading="lazy"
          />
          <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full">
            20% OFF
          </span>
        </div>
      </div>
      <button
        onClick={onExploreClick}
        className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full"
        aria-label="Explore featured deals"
      >
        Explore Now
      </button>
    </div>

    <div className="bg-black rounded-lg p-6 text-center text-white">
      <h4 className="text-lg font-bold mb-2">LIMITED TIME</h4>
      <p className="text-sm mb-4">Hurry, ends soon!</p>
      <TimerDisplay timeLeft={timeLeft} />
    </div>
  </div>
));
Sidebar.displayName = "Sidebar";

const CategoriesSection = memo(({ onCategoryClick }) => (
  <>
    <div className="bg-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <i className="fa-solid fa-paw" aria-hidden="true"></i>
        Popular Categories
      </h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-300 rounded-lg p-18 relative overflow-hidden cat-background">
        <div className="relative z-99 flex flex-col items-center">
          <h4 className="text-xl font-bold text-gray-800 mb-2">
            Gourmet Cat Treats
          </h4>
          <p className="text-gray-600 mb-4">Tasty options for your feline</p>
          <button
            onClick={() => onCategoryClick("cat-treats")}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            aria-label="Shop cat treats"
          >
            Shop Now
          </button>
        </div>
        <div className="absolute right-4 top-4 opacity-20" aria-hidden="true">
          <i className="fa-solid fa-cat text-6xl text-gray-600"></i>
        </div>
      </div>

      <div className="bg-gray-300 rounded-lg p-6 relative overflow-hidden dog-background flex justify-center items-center">
        <div className="relative z-99 flex flex-col items-center">
          <h4 className="text-xl font-bold text-gray-800 mb-2">
            Pet Accessories
          </h4>
          <p className="text-gray-600 mb-4">Collars, Leashes, and more</p>
          <button
            onClick={() => onCategoryClick("pet-accessories")}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            aria-label="Browse pet accessories"
          >
            Browse
          </button>
        </div>
        <div className="absolute right-4 top-4 opacity-20" aria-hidden="true">
          <i className="fa-solid fa-dog text-6xl text-gray-600"></i>
        </div>
      </div>
    </div>
  </>
));
CategoriesSection.displayName = "CategoriesSection";

const ProductShowCase = memo(({ products = [] }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 1,
    minutes: 5,
    seconds: 7,
  });

  const timerRef = useRef(null);

  const memoizedProducts = useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  const updateTimer = useCallback(() => {
    setTimeLeft((prevTime) => {
      let { days, hours, minutes, seconds } = prevTime;

      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      } else if (days > 0) {
        days--;
        hours = 23;
        minutes = 59;
        seconds = 59;
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return { days, hours, minutes, seconds };
    });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [updateTimer]);

  const handleAddToCart = useCallback((product) => {
    console.log("Adding to cart:", product);
  }, []);

  const handleToggleWishlist = useCallback((product) => {
    console.log("Toggle wishlist:", product);
  }, []);

  const handleExploreClick = useCallback(() => {
    console.log("Explore featured deals clicked");
  }, []);

  const handleCategoryClick = useCallback((category) => {
    console.log("Category clicked:", category);
  }, []);

  const handleCarouselPrev = useCallback(() => {
    console.log("Previous products");
  }, []);

  const handleCarouselNext = useCallback(() => {
    console.log("Next products");
  }, []);

  if (!memoizedProducts.length) {
    return (
      <section className="product-showcase py-8 px-4">
        <div className="max-w-[95%] lg:max-w-[90%] m-auto">
          <div className="text-center py-12">
            <i className="fa-solid fa-box-open text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-500">Check back later for amazing deals!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="product-showcase py-8 px-4"
      role="region"
      aria-label="Product showcase"
    >
      <div className="max-w-[95%] lg:max-w-[90%] m-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar timeLeft={timeLeft} onExploreClick={handleExploreClick} />

          <div className="lg:col-span-3">
            <div className="bg-gray-200 rounded-lg p-4 mb-6 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-star" aria-hidden="true"></i>
                Top Picks
              </h3>
              <div
                className="flex gap-2"
                role="group"
                aria-label="Product carousel navigation"
              >
                <button
                  onClick={handleCarouselPrev}
                  className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                  aria-label="Previous products"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  onClick={handleCarouselNext}
                  className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                  aria-label="Next products"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {memoizedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>

            <CategoriesSection onCategoryClick={handleCategoryClick} />
          </div>
        </div>
      </div>
    </section>
  );
});

ProductShowCase.displayName = "ProductShowCase";
export default ProductShowCase;
