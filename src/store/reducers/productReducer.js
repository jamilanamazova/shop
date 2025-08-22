// src/store/reducers/productReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiURL = "https://shopery-api-staging-61f06384c4d8.herokuapp.com/api/v1";

// Async thunk - Bütün product-ları al
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { page = 0, size = 20, sort = "createdAt,desc" } = {},
    { rejectWithValue }
  ) => {
    try {
      console.log("🔍 Fetching products:", { page, size, sort });

      const response = await axios.get(`${apiURL}/products`, {
        params: {
          page,
          size,
          sort,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Products API response:", response.data);

      if (response.data.status === "OK" && response.data.data) {
        const productData = response.data.data;
        return {
          content: productData.content || [],
          totalElements: productData.totalElements || 0,
          totalPages: productData.totalPages || 0,
          currentPage: page,
          pageSize: size,
        };
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Async thunk - Featured products al (top discounts)
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🌟 Fetching featured products...");

      const response = await axios.get(`${apiURL}/products/top-discounts`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("⭐ Featured products response:", response.data);

      if (response.data.status === "OK" && response.data.data) {
        return response.data.data.content;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("❌ Error fetching featured products:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products"
      );
    }
  }
);

// Async thunk - Product details al
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching product details for:", productId);

      const response = await axios.get(`${apiURL}/products/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Product details response:", response.data);

      if (response.data.status === "OK" && response.data.data) {
        return response.data.data;
      }

      throw new Error("Product not found");
    } catch (error) {
      console.error("❌ Error fetching product details:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

const initialState = {
  // All products list
  products: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,

  // Featured products
  featuredProducts: [],

  // Product details cache
  productDetails: {},

  // Loading states
  loading: false,
  featuredLoading: false,
  detailsLoading: {},

  // Error states
  error: null,
  featuredError: null,
  detailsErrors: {},

  filters: {
    category: null,
    priceRange: null,
    condition: null,
  },

  // Last fetch timestamp
  lastFetch: null,
  featuredLastFetch: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        category: null,
        priceRange: null,
        condition: null,
      };
    },

    cacheProductDetails: (state, action) => {
      const { productId, productData } = action.payload;
      state.productDetails[productId] = {
        ...productData,
        cachedAt: new Date().toISOString(),
      };
    },

    clearProductCache: (state) => {
      state.productDetails = {};
    },

    clearErrors: (state) => {
      state.error = null;
      state.featuredError = null;
      state.detailsErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { content, totalElements, totalPages, currentPage, pageSize } =
          action.payload;

        if (currentPage === 0) {
          // İlk page - products-ı əvəz et
          state.products = content;
        } else {
          // Növbəti page - products-a əlavə et
          state.products = [...state.products, ...content];
        }

        state.totalElements = totalElements;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.pageSize = pageSize;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })

      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredProducts = action.payload;
        state.featuredLastFetch = new Date().toISOString();
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError =
          action.payload || "Failed to fetch featured products";
      })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state, action) => {
        const productId = action.meta.arg;
        state.detailsLoading[productId] = true;
        delete state.detailsErrors[productId];
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        const productData = action.payload;

        state.detailsLoading[productId] = false;
        state.productDetails[productId] = {
          ...productData,
          cachedAt: new Date().toISOString(),
        };
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.detailsLoading[productId] = false;
        state.detailsErrors[productId] =
          action.payload || "Failed to fetch product details";
      });
  },
});

export const {
  setFilters,
  clearFilters,
  cacheProductDetails,
  clearProductCache,
  clearErrors,
} = productSlice.actions;

export default productSlice.reducer;

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectFeaturedProducts = (state) =>
  state.products.featuredProducts;
export const selectProductById = (productId) => (state) =>
  state.products.productDetails[productId];
export const selectProductsLoading = (state) => state.products.loading;
export const selectFeaturedLoading = (state) => state.products.featuredLoading;
export const selectProductsError = (state) => state.products.error;
export const selectFilters = (state) => state.products.filters;
export const selectPagination = (state) => ({
  totalElements: state.products.totalElements,
  totalPages: state.products.totalPages,
  currentPage: state.products.currentPage,
  pageSize: state.products.pageSize,
});

// Filtered products selector
export const selectFilteredProducts = (state) => {
  const products = selectAllProducts(state);
  const filters = selectFilters(state);

  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.priceRange) {
      const price = product.currentPrice || 0;
      const [min, max] = filters.priceRange;
      if (price < min || price > max) return false;
    }

    if (filters.condition && product.condition !== filters.condition) {
      return false;
    }

    return true;
  });
};
