import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductDetails,
  setFilters,
  clearFilters,
  clearErrors,
} from "../store/reducers/productReducer";

export const useProducts = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products);
  const featuredProducts = useSelector(
    (state) => state.products.featuredProducts
  );
  const productDetails = useSelector((state) => state.products.productDetails);
  const totalElements = useSelector((state) => state.products.totalElements);
  const totalPages = useSelector((state) => state.products.totalPages);
  const currentPage = useSelector((state) => state.products.currentPage);
  const loading = useSelector((state) => state.products.loading);
  const featuredLoading = useSelector(
    (state) => state.products.featuredLoading
  );
  const error = useSelector((state) => state.products.error);
  const featuredError = useSelector((state) => state.products.featuredError);
  const filters = useSelector((state) => state.products.filters);
  const lastFetch = useSelector((state) => state.products.lastFetch);
  const featuredLastFetch = useSelector(
    (state) => state.products.featuredLastFetch
  );

  const loadProducts = useCallback(
    (options = {}) => {
      const {
        page = 0,
        size = 20,
        sort = "createdAt,desc",
        reset = false,
      } = options;

      if (reset || page === 0) {
        dispatch(fetchProducts({ page: 0, size, sort }));
      } else {
        dispatch(fetchProducts({ page, size, sort }));
      }
    },
    [dispatch]
  );

  const loadFeaturedProducts = useCallback(() => {
    console.log("⭐ Loading featured products...");
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const loadProductDetails = useCallback(
    (productId) => {
      const cached = productDetails[productId];
      const now = Date.now();
      const cacheExpiry = 5 * 60 * 1000;

      if (cached && cached.cachedAt) {
        const cacheAge = now - new Date(cached.cachedAt);
        if (cacheAge < cacheExpiry) {
          console.log("using cached product details", productId);
          return Promise.resolve(cached);
        }
      }

      console.log("loading product details: ", productId);
      return dispatch(fetchProductDetails(productId));
    },
    [dispatch, productDetails]
  );

  const filterProducts = useCallback(
    (newFilters) => {
      console.log("🎯 Filtering products:", newFilters);
      dispatch(setFilters(newFilters));

      // Filter API çağırışı
      // dispatch(fetchProducts({ page: 0, filters: newFilters }));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    console.log("🔄 Resetting filters");
    dispatch(clearFilters());
    dispatch(fetchProducts({ page: 0 }));
  }, [dispatch]);

  const refreshProducts = useCallback(() => {
    console.log("🔄 Refreshing products");
    dispatch(fetchProducts({ page: 0 }));
  }, [dispatch]);

  const loadMoreProducts = useCallback(() => {
    if (currentPage + 1 < totalPages && !loading) {
      console.log("📄 Loading more products, page:", currentPage + 1);
      dispatch(fetchProducts({ page: currentPage + 1 }));
    }
  }, [dispatch, currentPage, totalPages, loading]);

  const clearProductErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const hasMoreProducts = currentPage + 1 < totalPages;
  const isFirstLoad = products.length === 0 && !loading && !error;

  const shouldRefreshFeatured = useCallback(() => {
    if (!featuredLastFetch) return true;

    const now = new Date();
    const lastFetchTime = new Date(featuredLastFetch);
    const cacheExpiry = 10 * 60 * 1000;

    return now - lastFetchTime > cacheExpiry;
  }, [featuredLastFetch]);

  useEffect(() => {
    if (shouldRefreshFeatured() && !featuredLoading) {
      loadFeaturedProducts();
    }
  }, [shouldRefreshFeatured, featuredLoading, loadFeaturedProducts]);

  const getProductById = useCallback(
    (productId) => {
      if (productDetails[productId]) {
        return productDetails[productId];
      }

      return products.find((product) => product.id === productId);
    },
    [products, productDetails]
  );

  const getFilteredProducts = useCallback(() => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(
        (product) => product.currentPrice >= min && product.currentPrice <= max
      );
    }

    if (filters.condition) {
      filtered = filtered.filter(
        (product) => product.condition === filters.condition
      );
    }

    return filtered;
  }, [products, filters]);

  return {
    // Data
    products,
    featuredProducts,
    productDetails,
    filteredProducts: getFilteredProducts(),

    // Pagination
    totalElements,
    totalPages,
    currentPage,
    hasMoreProducts,

    // States
    loading,
    featuredLoading,
    error,
    featuredError,
    isFirstLoad,

    filters,

    // Actions
    loadProducts,
    loadFeaturedProducts,
    loadProductDetails,
    filterProducts,
    resetFilters,
    refreshProducts,
    loadMoreProducts,
    clearProductErrors,

    // Helpers
    getProductById,
  };
};

export default useProducts;
