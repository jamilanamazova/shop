import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  addProductToCart,
  addToLocalCart,
  removeFromLocalCart,
  updateLocalCartQuantity,
  clearLocalCart,
  fetchCart, // varsa saxlayın, yoxdursa silin
  cacheProductDetails,
  clearError,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartLoading,
  selectCartError,
  selectIsLocalCart,
  showCartSuccess,
  hideCartSuccess,
  toggleCartSidebar,
  setCartOpen,
  selectShowSuccessMessage,
  selectLastAddedItem,
  selectIsCartOpen,
} from "../store/reducers/cartReducer";

export const useCart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const isLocal = useSelector(selectIsLocalCart);
  const showSuccessMessage = useSelector(selectShowSuccessMessage);
  const lastAddedItem = useSelector(selectLastAddedItem);
  const isCartOpen = useSelector(selectIsCartOpen);

  const addToCart = useCallback(
    async (productId, quantity = 1, productData = null) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        const action = await dispatch(
          addProductToCart({ productId, quantity, productData })
        );

        // Thunk fallback verdiyində və ya reject olduqda local-a əlavə et
        if (
          addProductToCart.rejected.match(action) ||
          action?.payload?.fallbackToLocal
        ) {
          dispatch(addToLocalCart({ productId, quantity, productData }));
        }
      } else {
        dispatch(addToLocalCart({ productId, quantity, productData }));
      }

      if (productData) {
        dispatch(cacheProductDetails({ productId, productData }));
        dispatch(showCartSuccess(productData));
      }
    },
    [dispatch]
  );

  const hideSuccessMessage = useCallback(() => {
    dispatch(hideCartSuccess());
  }, [dispatch]);

  const toggleCart = useCallback(() => {
    dispatch(toggleCartSidebar());
  }, [dispatch]);

  const openCart = useCallback(() => {
    dispatch(setCartOpen(true));
  }, [dispatch]);

  const closeCart = useCallback(() => {
    dispatch(setCartOpen(false));
  }, [dispatch]);

  const removeFromCart = useCallback(
    (productId) => {
      dispatch(removeFromLocalCart({ productId }));
    },
    [dispatch]
  );

  const removeProductFromCart = useCallback(
    (productId) => {
      removeFromCart(productId);
    },
    [removeFromCart]
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      dispatch(updateLocalCartQuantity({ productId, quantity }));
    },
    [dispatch]
  );

  const increaseProductQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((i) => i.productId === productId);
      if (item) updateQuantity(productId, item.quantity + 1);
    },
    [cartItems, updateQuantity]
  );

  const decreaseProductQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((i) => i.productId === productId);
      if (item && item.quantity > 1)
        updateQuantity(productId, item.quantity - 1);
      else if (item) removeFromCart(productId);
    },
    [cartItems, updateQuantity, removeFromCart]
  );

  const clearCart = useCallback(() => {
    dispatch(clearLocalCart());
  }, [dispatch]);

  const refreshCart = useCallback(() => {
    if (typeof fetchCart === "function") dispatch(fetchCart());
  }, [dispatch]);

  const clearCartError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getItemQuantity = useCallback(
    (productId) =>
      cartItems.find((i) => i.productId === productId)?.quantity || 0,
    [cartItems]
  );

  const isItemInCart = useCallback(
    (productId) => cartItems.some((i) => i.productId === productId),
    [cartItems]
  );

  const getCartItemById = useCallback(
    (productId) => cartItems.find((i) => i.productId === productId),
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
    increaseProductQuantity,
    decreaseProductQuantity,
    clearCart,
    refreshCart,
    clearCartError,

    showSuccessMessage,
    lastAddedItem,
    isCartOpen,

    hideSuccessMessage,
    removeProductFromCart,
    toggleCart,
    openCart,
    closeCart,

    getItemQuantity,
    isItemInCart,
    getCartItemById,
  };
};

export default useCart;
