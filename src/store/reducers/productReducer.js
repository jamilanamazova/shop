// src/store/reducers/productReducer.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

import { apiURL } from "../../Backend/Api/api";

const CACHE_TIMEOUT = 300000;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { page = 0, size = 20, sort = "createdAt,desc", force = false } = {},
    { rejectWithValue, getState },
  ) => {
    try {
      if (page === 0 && !force) {
        const state = getState();
        const { lastFetch, products } = state.products;

        if (lastFetch && products.length > 0) {
          const timeSinceLastFetch = Date.now() - new Date(lastFetch).getTime();
          if (timeSinceLastFetch < CACHE_TIMEOUT) {
            console.log(
              "✅ Using cached products, skipping fetch. Cache age:",
              Math.floor(timeSinceLastFetch / 1000),
              "seconds",
            );
            return {
              content: products,
              totalElements: state.products.totalElements,
              totalPages: state.products.totalPages,
              currentPage: state.products.currentPage,
              pageSize: state.products.pageSize,
              fromCache: true,
            };
          }
        }
      }

      console.log("🔄 Fetching products from API - page:", page);
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
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Cache kontrolü
      const state = getState();
      const { featuredLastFetch, featuredProducts } = state.products;

      // Eğer 5 dakika içinde fetch yapılmışsa ve data varsa, cache'den dön
      if (featuredLastFetch && featuredProducts.length > 0) {
        const timeSinceLastFetch =
          Date.now() - new Date(featuredLastFetch).getTime();
        if (timeSinceLastFetch < CACHE_TIMEOUT) {
          console.log("✅ Using cached featured products, skipping fetch");
          return featuredProducts;
        }
      }

      const { data } = await axios.get(`${apiURL}/products`, {
        params: {
          page: 0,
          size: 20,
          sort: "createdAt,desc",
        },
      });

      // Müxtəlif yollarla data çıxarın
      const products =
        data?.data?.content ||
        data?.content ||
        data?.data ||
        data?.products ||
        data ||
        [];

      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.error("❌ Featured products fetch error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products",
      );
    }
  },
);

// Async thunk - Product details al
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiURL}/products/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "OK" && response.data.data) {
        return response.data.data;
      }

      throw new Error("Product not found");
    } catch (error) {
      console.error("❌ Error fetching product details:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details",
      );
    }
  },
);

export const ensureDetailsForProducts = createAsyncThunk(
  "products/ensureDetailsForProducts",
  async (ids = [], { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const cached = state.products.productDetails || {};
      const missing = ids.filter((id) => !cached[id]);
      if (missing.length === 0) return [];

      // 6 paralel batch
      const chunk = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
          arr.slice(i * size, i * size + size),
        );

      const chunks = chunk(missing, 6);
      const results = [];

      for (const group of chunks) {
        const reqs = group.map((id) =>
          axios
            .get(`${apiURL}/products/${id}`, {
              headers: { "Content-Type": "application/json" },
            })
            .then((res) => ({ id, ok: true, data: res.data?.data }))
            .catch((err) => ({ id, ok: false, error: err })),
        );
        const settled = await Promise.all(reqs);
        results.push(...settled.filter((r) => r.ok));
      }

      return results; // [{id, ok:true, data}]
    } catch (error) {
      console.error("❌ Error ensuring product details:", error);
      return rejectWithValue("Failed to fetch product details batch");
    }
  },
);

const initialState = {
  products: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,

  featuredProducts: [],
  productDetails: {},

  loading: false,
  featuredLoading: false,
  detailsLoading: {},

  error: null,
  featuredError: null,
  detailsErrors: {},

  filters: { category: null, priceRange: null, condition: null },

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
      state.filters = { category: null, priceRange: null, condition: null };
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const {
          content,
          totalElements,
          totalPages,
          currentPage,
          pageSize,
          fromCache,
        } = action.payload;

        // Cache'den geldiyse state'i güncelleme
        if (fromCache) {
          return;
        }

        state.products =
          currentPage === 0 ? content : [...state.products, ...content];
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
      })
      .addCase(ensureDetailsForProducts.fulfilled, (state, action) => {
        for (const item of action.payload) {
          const { id, data } = item;
          state.productDetails[id] = {
            ...data,
            cachedAt: new Date().toISOString(),
          };
        }
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
export const selectProductDetails = (state) => state.products.productDetails;
export const selectPagination = (state) => ({
  totalElements: state.products.totalElements,
  totalPages: state.products.totalPages,
  currentPage: state.products.currentPage,
  pageSize: state.products.pageSize,
});

const getCategoryOf = (productDetails, p) =>
  p.category ?? productDetails[p.id]?.category ?? null;

const getConditionOf = (productDetails, p) =>
  p.condition ?? productDetails[p.id]?.condition ?? null;

const getPriceOf = (p) => {
  const raw = p.currentPrice ?? p.price ?? 0;
  if (typeof raw === "number") return raw;
  const cleaned = String(raw)
    .replace(/[^\d.,-]/g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilters, selectProductDetails],
  (products, filters, productDetails) => {
    return products.filter((product) => {
      // Category filter
      if (filters.category && String(filters.category).trim() !== "") {
        const cat = getCategoryOf(productDetails, product);
        if (
          !cat ||
          String(cat).toLowerCase() !== String(filters.category).toLowerCase()
        ) {
          return false;
        }
      }

      // Price filter
      if (
        filters.priceRange &&
        Array.isArray(filters.priceRange) &&
        filters.priceRange.length === 2
      ) {
        const [min, max] = filters.priceRange;
        const price = getPriceOf(product);
        if (price < Number(min) || price > Number(max)) {
          return false;
        }
      }

      // Condition filter
      if (filters.condition && String(filters.condition).trim() !== "") {
        const cond = getConditionOf(productDetails, product);
        if (
          !cond ||
          String(cond).toLowerCase() !== String(filters.condition).toLowerCase()
        ) {
          return false;
        }
      }

      return true;
    });
  },
);
