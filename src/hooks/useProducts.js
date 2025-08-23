import { useCallback, useEffect } from "react";
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

  const loadFeaturedProducts = useCallback(() => {
    dispatch(fetchFeaturedProducts());
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

  useEffect(() => {
    if (products.length === 0 && !loading) {
      loadProducts({ page: 0 });
      loadFeaturedProducts();
    }
  }, []);

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

  useEffect(() => {
    const needDetails = Boolean(filters.category) || Boolean(filters.condition);
    if (!needDetails || products.length === 0) return;

    const newMissing = products
      .filter((p) => !productDetails[p.id])
      .map((p) => p.id);
    if (newMissing.length > 0) {
      dispatch(ensureDetailsForProducts(newMissing));
    }
  }, [dispatch, products]);

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
    featuredLoading,
    error,
    featuredError,
    filters,

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
