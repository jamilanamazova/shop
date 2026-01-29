import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchFeaturedProducts,
  ensureDetailsForProducts,
  fetchProductDetails,
  setFilters,
  clearFilters,
  clearErrors,
  selectAllProducts,
  selectFilteredProducts,
} from "../store/reducers/productReducer";

export const useProducts = () => {
  const dispatch = useDispatch();

  const products = useSelector(selectAllProducts);
  const filteredProducts = useSelector(selectFilteredProducts);
  const featuredProducts = useSelector((s) => s.products.featuredProducts);
  const productDetails = useSelector((s) => s.products.productDetails);

  const totalElements = useSelector((s) => s.products.totalElements);
  const totalPages = useSelector((s) => s.products.totalPages);
  const currentPage = useSelector((s) => s.products.currentPage);
  const pageSize = useSelector((s) => s.products.pageSize);

  const loading = useSelector((s) => s.products.loading);
  const featuredLoading = useSelector((s) => s.products.featuredLoading);
  const error = useSelector((s) => s.products.error);
  const featuredError = useSelector((s) => s.products.featuredError);
  const filters = useSelector((s) => s.products.filters);

  // Local state to track if featured was attempted
  const [featuredAttempted, setFeaturedAttempted] = useState(false);
  const featuredLoadedRef = useRef(false);

  const loadProducts = useCallback(
    ({ page = 0, size = pageSize || 20, sort = "createdAt,desc" } = {}) => {
      dispatch(fetchProducts({ page, size, sort }));
    },
    [dispatch, pageSize]
  );

  const loadMoreProducts = useCallback(() => {
    if (!loading && currentPage + 1 < totalPages) {
      dispatch(
        fetchProducts({
          page: currentPage + 1,
          size: pageSize || 20,
          sort: "createdAt,desc",
        })
      );
    }
  }, [dispatch, loading, currentPage, totalPages, pageSize]);

  const refreshProducts = useCallback(() => {
    dispatch(
      fetchProducts({ page: 0, size: pageSize || 20, sort: "createdAt,desc" })
    );
  }, [dispatch, pageSize]);

  const loadFeaturedProducts = useCallback(async () => {
    if (featuredLoadedRef.current) return;
    featuredLoadedRef.current = true;
    setFeaturedAttempted(true);

    try {
      console.log("🔄 Loading featured products...");
      await dispatch(fetchFeaturedProducts()).unwrap();
      console.log("✅ Featured products loaded successfully");
    } catch (err) {
      console.error("❌ Failed to load featured products:", err);
      setFeaturedAttempted(true);
    }
  }, [dispatch]);

  const loadProductDetails = useCallback(
    (productId) => dispatch(fetchProductDetails(productId)),
    [dispatch]
  );

  const filterProducts = useCallback(
    (newFilters) => {
      console.log("🎯 Filtering products:", newFilters);
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const clearProductErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Load products and featured products once
  useEffect(() => {
    let shouldLoadProducts = false;
    let shouldLoadFeatured = false;

    if (products.length === 0 && !loading) {
      shouldLoadProducts = true;
    }

    if (!featuredLoadedRef.current && !featuredLoading && !featuredAttempted) {
      shouldLoadFeatured = true;
    }

    if (shouldLoadProducts) {
      console.log("📦 Loading initial products...");
      loadProducts({ page: 0 });
    }

    if (shouldLoadFeatured) {
      console.log("⭐ Loading featured products...");
      loadFeaturedProducts();
    }
  }, [
    products.length,
    loading,
    featuredLoading,
    featuredAttempted,
    loadProducts,
    loadFeaturedProducts,
  ]);

  // Handle product details fetching (remove duplicate effect)
  useEffect(() => {
    const needDetails = Boolean(filters.category) || Boolean(filters.condition);
    if (!needDetails || products.length === 0) return;

    const idsMissing = products
      .filter((p) => !productDetails[p.id])
      .map((p) => p.id);

    if (idsMissing.length > 0) {
      console.log("📥 Fetching details for filters:", idsMissing.length);
      dispatch(ensureDetailsForProducts(idsMissing));
    }
  }, [dispatch, products, productDetails, filters.category, filters.condition]);

  // Determine if featured products are actually loading or if we should show "not found"
  const isReallyLoading = featuredLoading;
  const shouldShowNotFound =
    featuredAttempted && !featuredLoading && featuredProducts.length === 0;

  useEffect(() => {
    console.log("🔍 Featured Debug:", {
      featuredProducts: featuredProducts.length,
      featuredLoading,
      featuredAttempted,
      shouldShowNotFound,
      isReallyLoading,
      storeProducts: featuredProducts,
    });
  }, [
    featuredProducts,
    featuredLoading,
    featuredAttempted,
    shouldShowNotFound,
    isReallyLoading,
  ]);

  return {
    products,
    filteredProducts,
    featuredProducts,
    productDetails,

    totalElements,
    totalPages,
    currentPage,
    pageSize,

    loading,
    featuredLoading: isReallyLoading,
    error,
    featuredError,
    filters,

    // Additional states for better UI control
    featuredAttempted,
    shouldShowNotFound,

    loadProducts,
    loadMoreProducts,
    refreshProducts,
    loadFeaturedProducts,
    loadProductDetails,
    filterProducts,
    resetFilters,
    clearProductErrors,
  };
};

export default useProducts;
