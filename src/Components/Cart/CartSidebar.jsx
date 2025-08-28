import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import useCart from "../../hooks/useCart";
import { selectProductDetailsCache } from "../../store/reducers/cartReducer";

const formatMoney = (v) => Number(v || 0).toFixed(2);

const CartItemCard = memo(({ item, onInc, onDec, onRemove }) => {
  const productId = item?.productId ?? item?.id;
  const quantity = item?.quantity ?? 1;
  const product = item?.originalProduct || {};

  const unitPrice = Number(
    item?.price ??
      item?.currentPrice ??
      product?.currentPrice ??
      product?.price ??
      0
  );
  const total = Number(item?.totalPrice ?? unitPrice * quantity);

  const imageUrl =
    item?.imageUrl || product?.imageUrl || product?.thumbnail || "";
  const name =
    item?.productName || product?.productName || product?.name || "Product";
  const category =
    item?.category || product?.category?.name || product?.category || "";

  if (!productId) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fa-solid fa-image text-gray-300 text-xl" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
            {name}
          </h4>

          {category && (
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium mb-2">
              {category}
            </span>
          )}

          <div className="flex items-center justify-between">
            <div className="text-emerald-600 font-bold text-lg">
              ${formatMoney(total)}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => quantity > 1 && onDec?.(productId)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-minus text-xs text-gray-600" />
              </button>
              <span className="w-8 text-center font-semibold text-gray-800">
                {quantity}
              </span>
              <button
                onClick={() => onInc?.(productId)}
                className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200"
              >
                <i className="fa-solid fa-plus text-xs text-emerald-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-500 text-xs">
              ${formatMoney(unitPrice)} each
            </span>
            <button
              onClick={() => onRemove?.(productId)}
              className="text-red-500 hover:text-red-700 p-1 rounded"
              title="Remove from cart"
            >
              <i className="fa-solid fa-trash text-xs" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
CartItemCard.displayName = "CartItemCard";

const EmptyCart = memo(({ onContinue }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
    >
      <i className="fa-solid fa-shopping-cart text-4xl text-gray-300" />
    </motion.div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
    <p className="text-gray-600 mb-8">
      Start shopping to add items to your cart.
    </p>
    <button
      onClick={onContinue}
      className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
    >
      <i className="fa-solid fa-shopping-bag mr-2" />
      Continue shopping
    </button>
  </div>
));
EmptyCart.displayName = "EmptyCart";

const CartSidebar = memo(() => {
  const {
    cartItems = [],
    cartTotal = 0,
    itemCount = 0,
    isCartOpen = false,
    toggleCart,
    increaseProductQuantity,
    decreaseProductQuantity,
    removeProductFromCart,
    clearCart,
  } = useCart();

  // Optional: use details cache if mövcudsa (enrichment üçün)
  const detailsMap = useSelector(selectProductDetailsCache);

  const pickFromCache = (cache, pid) =>
    cache instanceof Map
      ? cache.get(pid) ?? cache.get(String(pid)) ?? cache.get(Number(pid))
      : cache?.[pid];
  // Enrich only for display fallbacks (img/name/category/price)
  const enrichedItems = useMemo(() => {
    return cartItems.map((ci) => {
      const pid = ci?.productId ?? ci?.id;
      const fromCache = pickFromCache(detailsMap, pid) || {};
      return {
        ...ci,
        productId: pid,
        price:
          ci?.price ??
          ci?.currentPrice ??
          fromCache?.currentPrice ??
          fromCache?.price ??
          ci?.originalProduct?.currentPrice ??
          ci?.originalProduct?.price ??
          0,
        imageUrl:
          ci?.imageUrl || fromCache?.imageUrl || fromCache?.thumbnail || "",
        productName:
          ci?.productName ||
          fromCache?.productName ||
          fromCache?.name ||
          ci?.originalProduct?.productName ||
          "Product",
        category:
          ci?.category ||
          fromCache?.category?.name ||
          fromCache?.category ||
          ci?.originalProduct?.category ||
          "",
      };
    });
  }, [cartItems, detailsMap]);

  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && isCartOpen) {
        toggleCart?.();
      }
    };
    if (isCartOpen) {
      document.addEventListener("mousedown", onDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, toggleCart]);

  const onInc = useCallback(
    (pid) => increaseProductQuantity?.(pid),
    [increaseProductQuantity]
  );
  const onDec = useCallback(
    (pid) => decreaseProductQuantity?.(pid),
    [decreaseProductQuantity]
  );
  const onRemove = useCallback(
    (pid) => removeProductFromCart?.(pid),
    [removeProductFromCart]
  );
  const onClear = useCallback(() => clearCart?.(), [clearCart]);
  const onClose = useCallback(() => toggleCart?.(), [toggleCart]);

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.aside
            ref={ref}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-emerald-500 rounded-lg transition"
                >
                  <i className="fa-solid fa-times text-xl" />
                </button>
              </div>
              <div className="flex items-center justify-between text-emerald-100">
                <span>
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
                {enrichedItems.length > 0 && (
                  <button
                    onClick={onClear}
                    className="text-emerald-200 hover:text-white transition text-sm"
                  >
                    <i className="fa-solid fa-trash mr-1" />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {enrichedItems.length === 0 ? (
                <EmptyCart onContinue={onClose} />
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {enrichedItems.map((it, idx) => (
                        <CartItemCard
                          key={String(it.productId ?? idx)}
                          item={it}
                          onInc={onInc}
                          onDec={onDec}
                          onRemove={onRemove}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <h3 className="font-bold text-gray-800 text-lg mb-2">
                        Order Summary
                      </h3>
                      <div className="flex justify-between text-gray-600">
                        <span>Items ({itemCount})</span>
                        <span>${formatMoney(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-emerald-600 font-medium">
                          Free
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-bold text-gray-800">
                          <span>Total</span>
                          <span className="text-emerald-600">
                            ${formatMoney(cartTotal)}
                          </span>
                        </div>
                      </div>
                      <button className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition">
                        <i className="fa-solid fa-credit-card mr-2" />
                        Proceed to Checkout
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition"
                      >
                        <i className="fa-solid fa-arrow-left mr-2" />
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
});
CartSidebar.displayName = "CartSidebar";

export default CartSidebar;
