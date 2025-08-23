import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "https://shopery-api-staging-61f06384c4d8.herokuapp.com/api/v1";

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return { productId, quantity, isLocal: true };
      }

      console.log("🛒 Adding product to backend cart:", {
        productId,
        quantity,
      });

      const response = await axios.post(
        `${apiUrl}/users/me/cart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("product added to backend cart: ", response.data);

      if (response.data.status === "OK") {
        return {
          productId,
          quantity,
          cartData: response.data.data,
          isLocal: false,
        };
      }

      throw new Error("Failed to add to cart");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return { productId, quantity, isLocal: true };
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return { item: [], totalPrice: 0, isLocal: true };
      }

      const response = await axios.get(`${apiUrl}/users/me/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("🛒 Fetched backend cart:", response.data);

      if (response.data.status === "OK") {
        return {
          cartData: response.data.data,
          isLocal: false,
        };
      }

      throw new Error("Failed to fetch cart");
    } catch (error) {
      console.error("❌ Error fetching cart:", error);

      // Backend error-sa, local cart istifadə et
      return { items: [], totalPrice: 0, isLocal: true };
    }
  }
);

const initialState = {
  localItems: [],
  localTotalPrice: 0,

  backendItems: [],
  backendTotalPrice: 0,

  loading: false,
  error: null,
  isLocal: true,

  showSuccessMessage: false,
  lastAddedItem: null,
  isCartOpen: false,

  productDetails: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToLocalCart: (state, action) => {
      const { productId, quantity = 1, productData } = action.payload;

      console.log("Adding to local cart: ", { productId, quantity });

      const existingItem = state.localItems.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        console.log("updated quantity: ", existingItem.quantity);
      } else {
        state.localItems.push({
          productId,
          quantity,
          addedAt: new Date().toISOString(),
          productData: productData || null,
        });
        console.log("added new item to local cart");
      }

      if (productData) {
        state.productDetails[productId] = productData;
      }

      cartSlice.caseReducers.recalculateLocalTotal(state);
      state.showSuccessMessage = true;
      state.lastAddedItem = action.payload.productData;
    },

    removeFromLocalCart: (state, action) => {
      const { productId } = action.payload;
      console.log("removing from local cart", productId);

      state.localItems = state.localItems.filter(
        (item) => item.productId !== productId
      );
      cartSlice.caseReducers.recalculateLocalTotal(state);
    },

    updateLocalCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      const item = state.localItems.find(
        (item) => item.productId === productId
      );

      if (item) {
        if (quantity <= 0) {
          state.localItems = state.localItems.filter(
            (item) => item.productId !== productId
          );
        } else {
          item.quantity = quantity;
        }
      }
      cartSlice.caseReducers.recalculateLocalTotal(state);
    },

    clearLocalCart: (state) => {
      state.localItems = [];
      state.localTotalPrice = 0;
    },

    recalculateLocalTotal: (state) => {
      state.localTotalPrice = state.localItems.reduce((total, item) => {
        const productPrice =
          state.productDetails[item.productId]?.currentPrice || 0;
        return total + productPrice * item.quantity;
      }, 0);
    },

    setCartMode: (state, action) => {
      state.isLocal = action.payload;
    },

    mergeLocalCartToBackend: (state) => {
      // Login olduqda local cart-ı backend-ə merge et
      // Bu action async thunk-da işlənəcək
      console.log("🔄 Merging local cart to backend...");
    },

    cacheProductDetails: (state, action) => {
      const { productId, productData } = action.payload;
      state.productDetails[productId] = productData;
    },

    clearError: (state) => {
      state.error = null;
    },

    showCartSuccess: (state, action) => {
      state.showSuccessMessage = true;
      state.lastAddedItem = action.payload;
    },

    hideCartSuccess: (state) => {
      state.showSuccessMessage = false;
      state.lastAddedItem = null;
    },

    toggleCartSidebar: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },

    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.loading = false;

        const { productId, quantity, cartData, isLocal } = action.payload;

        if (isLocal) {
          cartSlice.caseReducers.addToLocalCart(state, {
            payload: { productId, quantity },
          });
        } else {
          state.backendItems = cartData?.items || [];
          state.backendTotalPrice = cartData?.totalPrice || 0;
          state.isLocal = false;
        }
        state.showSuccessMessage = true;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add product to cart";
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        const { cartData, isLocal } = action.payload;

        if (isLocal) {
          state.isLocal = true;
        } else {
          state.backendItems = cartData?.items || [];
          state.backendTotalPrice = cartData?.totalPrice || 0;
          state.isLocal = false;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
        state.isLocal = true;
      });
  },
});

export const {
  addToLocalCart,
  removeFromLocalCart,
  updateLocalCartQuantity,
  clearLocalCart,
  setCartMode,
  mergeLocalCartToBackend,
  cacheProductDetails,
  clearError,
  recalculateLocalTotal,
  showCartSuccess,
  hideCartSuccess,
  toggleCartSidebar,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) =>
  state.cart.isLocal ? state.cart.localItems : state.cart.backendItems;

export const selectCartTotal = (state) =>
  state.cart.isLocal
    ? state.cart.localTotalPrice
    : state.cart.backendTotalPrice;
export const selectCartItemCount = (state) =>
  selectCartItems(state).reduce((total, item) => total + item.quantity, 0);

export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectIsLocalCart = (state) => state.cart.isLocal;
export const selectShowSuccessMessage = (state) =>
  state.cart.showSuccessMessage;
export const selectLastAddedItem = (state) => state.cart.lastAddedItem;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
