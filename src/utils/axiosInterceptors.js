import axios from "axios";
import { isTokenExpired, refreshAccessToken } from "./tokenService";
import { getAppMode } from "./roleMode";

// Queue system for multiple requests during refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};
  // Skip auth logic for refresh calls or when explicitly requested
  const isRefreshCall =
    (config.url || "").includes("/auth/refresh-token") ||
    (config.url || "").includes("/auth-refresh");
  const skipAuth =
    config.headers["X-Skip-Auth"] === "1" ||
    (config.meta && config.meta.skipAuth === true);

  if (isRefreshCall || skipAuth) {
    return config;
  }
  const mode = getAppMode();
  let customerAT = localStorage.getItem("accessToken");
  const merchantAT = localStorage.getItem("merchantAccessToken");

  const useMerchant =
    config.headers["X-Use-Merchant"] === "1" ||
    (config.meta && config.meta.useMerchant);

  const headerToken = (config.headers.Authorization || "").replace(
    /^Bearer\s+/i,
    ""
  );
  const headerIsCustomerToken = customerAT && headerToken === customerAT;

  if (headerIsCustomerToken && isTokenExpired(customerAT)) {
    if (!isRefreshing) {
      isRefreshing = true;
      customerAT = await refreshAccessToken();
      processQueue(null, customerAT);
      isRefreshing = false;
    } else {
      customerAT = await new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }
    config.headers.Authorization = `Bearer ${customerAT}`;
  }

  if (!config.headers.Authorization) {
    if (!useMerchant && customerAT && isTokenExpired(customerAT)) {
      if (!isRefreshing) {
        isRefreshing = true;
        customerAT = await refreshAccessToken();
        processQueue(null, customerAT);
        isRefreshing = false;
      } else {
        customerAT = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }
    }

    const token = useMerchant
      ? merchantAT
      : mode === "merchant"
      ? merchantAT
      : customerAT;

    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isRefreshCall =
      (originalRequest?.url || "").includes("/auth/refresh-token") ||
      (originalRequest?.url || "").includes("/auth-refresh");

    // 401 error və retry edilməyibsə
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall
    ) {
      // Əgər artıq refresh edirsə, queue-ya əlavə et
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 401 error, attempting token refresh...");
        const newToken = await refreshAccessToken();

        // Queue-daki bütün request-ləri yenilə
        processQueue(null, newToken);

        // Original request-i yenilənmiş token ilə təkrar et
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh failed on 401:", refreshError);
        processQueue(refreshError, null);

        // Refresh fail olsa logout
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Some backends return 403 on expired tokens. If we know the customer token is expired, try refresh once.
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !isRefreshCall
    ) {
      const headerToken = (
        originalRequest.headers?.Authorization || ""
      ).replace(/^Bearer\s+/i, "");
      const customerAT = localStorage.getItem("accessToken");
      const looksExpired =
        customerAT && headerToken === customerAT && isTokenExpired(customerAT);
      if (looksExpired) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }

    return Promise.reject(error);
  }
);

console.log("✅ Axios interceptors with auto-refresh initialized");
