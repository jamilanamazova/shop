import React, { memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useCart from "../../hooks/useCart";
import { selectProductDetailsCache } from "../../store/reducers/cartReducer";
import Header from "../Header";
import Footer from "../Footer";

const money = (n) => Number(n || 0).toFixed(2);
const pickFromCache = (cache, pid) =>
  cache instanceof Map
    ? cache.get(pid) ?? cache.get(String(pid)) ?? cache.get(Number(pid))
    : cache?.[pid];

const CartDisplay = memo(() => {
  const {
    cartItems = [],
    cartTotal = 0,
    itemCount = 0,
    increaseProductQuantity,
    decreaseProductQuantity,
    removeProductFromCart,
    clearCart,
  } = useCart();

  const detailsMap = useSelector(selectProductDetailsCache);

  const items = useMemo(() => {
    return (cartItems || []).map((ci, idx) => {
      const productId = ci?.productId ?? ci?.id ?? idx;
      const d = pickFromCache(detailsMap, productId) || {};
      const unitPrice = Number(
        ci?.price ??
          ci?.currentPrice ??
          d?.currentPrice ??
          d?.price ??
          ci?.productData?.currentPrice ??
          ci?.productData?.price ??
          0
      );
      return {
        key: String(productId),
        productId,
        name:
          d?.productName ||
          d?.name ||
          ci?.productData?.productName ||
          "Product",
        category:
          d?.category?.name || d?.category || ci?.productData?.category || "",
        imageUrl: ci?.imageUrl || d?.imageUrl || d?.thumbnail || "",
        quantity: Number(ci?.quantity || 1),
        unitPrice,
        total: unitPrice * Number(ci?.quantity || 1),
      };
    });
  }, [cartItems, detailsMap]);

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

  if (!items.length) {
    return (
      <>
        <Header />
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-28 h-28 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6"
            >
              <i className="fa-solid fa-shopping-cart text-5xl text-gray-300" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding products to see them here.
            </p>
            <Link
              to="/products"
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Browse products
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart</h2>
            <AnimatePresence>
              {items.map((it) => (
                <motion.div
                  key={it.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {it.imageUrl ? (
                        <img
                          src={it.imageUrl}
                          alt={it.name}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fa-solid fa-image text-gray-300 text-2xl" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 truncate">
                            {it.name}
                          </h4>
                          {it.category && (
                            <span className="inline-block mt-1 text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                              {it.category}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onRemove(it.productId)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50"
                          title="Remove"
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onDec(it.productId)}
                            disabled={it.quantity <= 1}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            <i className="fa-solid fa-minus text-gray-600 text-xs" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {it.quantity}
                          </span>
                          <button
                            onClick={() => onInc(it.productId)}
                            className="w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200"
                          >
                            <i className="fa-solid fa-plus text-emerald-600 text-xs" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            ${money(it.unitPrice)} each
                          </div>
                          <div className="text-lg font-bold text-emerald-600">
                            ${money(it.total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-emerald-600">${money(cartTotal)}</span>
              </div>
              <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
                Proceed to checkout
              </button>
              <button
                onClick={onClear}
                className="w-full bg-white text-gray-700 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              >
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
});

CartDisplay.displayName = "CartDisplay";
export default CartDisplay;
