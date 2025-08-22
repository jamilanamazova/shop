import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  addProductToCart,
  addToLocalCart,
  removeFromLocalCart,
  updateLocalCartQuantity,
  clearLocalCart,
  fetchCart,
  cacheProductDetails,
  clearError,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartLoading,
  selectCartError,
  selectIsLocalCart,
} from "../store/reducers/cartReducer";

export const useCart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const isLocal = useSelector(selectIsLocalCart);

  const addToCart = useCallback(
    (productId, quantity = 1, productData = null) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        dispatch(addProductToCart({ productId, quantity }));
      } else {
        dispatch(addToLocalCart({ productId, quantity, productData }));
      }

      if (productData) {
        dispatch(cacheProductDetails({ productId, productData }));
      }
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (productId) => {
      if (isLocal) {
        dispatch(removeFromLocalCart({ productId }));
      } else {
        console.log("Backend remove api call needed");
      }
    },
    [dispatch, isLocal]
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (isLocal) {
        dispatch(updateLocalCartQuantity({ productId, quantity }));
      } else {
        // Backend update API çağırışı (henüz implement edilməyib)
        console.log("Backend update API call needed");
      }
    },
    [dispatch, isLocal]
  );

  const clearCart = useCallback(() => {
    if (isLocal) {
      dispatch(clearLocalCart());
    } else {
      // Backend clear API çağırışı (henüz implement edilməyib)
      console.log("Backend clear API call needed");
    }
  }, [dispatch, isLocal]);

  const refreshCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const clearCartError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getItemQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((item) => item.productId === productId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const isItemInCart = useCallback(
    (productId) => {
      return cartItems.some((item) => item.productId === productId);
    },
    [cartItems]
  );

  const getCartItemById = useCallback(
    (productId) => {
      return cartItems.find((item) => item.productId === productId);
    },
    [cartItems]
  );

  return {
    cartItems,
    cartTotal,
    itemCount,
    loading,
    error,
    isLocal,

    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    clearCartError,

    getItemQuantity,
    isItemInCart,
    getCartItemById,
  };
};

export default useCart;
