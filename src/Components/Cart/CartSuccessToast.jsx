import React, { memo, useEffect } from "react";
import useCart from "../../hooks/useCart";

const CartSuccessToast = memo(() => {
  const { showSuccessMessage, lastAddedItem, hideSuccessMessage, toggleCart } =
    useCart();

  useEffect(() => {
    if (showSuccessMessage) {
      const time = setTimeout(() => {
        hideSuccessMessage();
      }, 4000);
      return () => clearTimeout(time);
    }
  }, [showSuccessMessage, hideSuccessMessage]);

  if (!showSuccessMessage || !lastAddedItem) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-200 p-4 overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-check text-emerald-600 text-lg"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-sm">Added to Cart!</h4>
            <p className="text-gray-600 text-xs">Product successfully added</p>
          </div>
          <button
            onClick={hideSuccessMessage}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <i className="fa-solid fa-times text-sm"></i>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {lastAddedItem.imageUrl ? (
              <img
                src={lastAddedItem.imageUrl}
                alt={lastAddedItem.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className="fa-solid fa-image text-gray-300"></i>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-gray-800 text-sm truncate">
              {lastAddedItem.productName}
            </h5>
            <p className="text-emerald-600 font-bold text-sm">
              $
              {(lastAddedItem.currentPrice || lastAddedItem.price || 0).toFixed(
                2
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              toggleCart();
              hideSuccessMessage();
            }}
            className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-shopping-cart text-xs"></i>
            View Cart
          </button>
          <button
            onClick={hideSuccessMessage}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Continue
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-emerald-500 animate-progress"
            style={{ animationDuration: "4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
});

CartSuccessToast.displayName = "CartSuccessToast";
export default CartSuccessToast;
