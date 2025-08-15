import axios from "axios";
import { isTokenExpired, refreshAccessToken } from "./tokenService";
import { getAppMode } from "./roleMode";
import { apiURL } from "../Backend/Api/api";

// Queue system for multiple requests during refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

axios.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};

  // Skip auth logic for refresh calls or when explicitly requested
  const isRefreshCall =
    (config.url || "").includes("/auth/refresh-token") ||
    (config.url || "").includes("/auth-refresh");

  // Prefer meta flag; if header exists, use it but DO NOT send it to server
  const hasSkipHeader = config.headers["X-Skip-Auth"] === "1";
  const skipAuth =
    hasSkipHeader || (config.meta && config.meta.skipAuth === true);
  if (hasSkipHeader) delete config.headers["X-Skip-Auth"]; // prevent CORS preflight

  if (isRefreshCall || skipAuth) {
    return config;
  }

  const mode = getAppMode();
  let customerAT = localStorage.getItem("accessToken");
  const merchantAT = localStorage.getItem("merchantAccessToken");

  // Use meta flag; if header exists, treat as flag then remove it
  let useMerchant =
    (config.meta && config.meta.useMerchant) ||
    config.headers["X-Use-Merchant"] === "1";
  if (config.headers["X-Use-Merchant"]) delete config.headers["X-Use-Merchant"]; // avoid sending custom header

  const headerToken = (config.headers.Authorization || "").replace(
    /^Bearer\s+/i,
    ""
  );
  const headerIsCustomerToken = customerAT && headerToken === customerAT;

  if (headerIsCustomerToken && isTokenExpired(customerAT)) {
    if (!isRefreshing) {
      isRefreshing = true;
      customerAT = await refreshAccessToken({ meta: { skipAuth: true } }); // ensure refresh call skips
      processQueue(null, customerAT);
      isRefreshing = false;
    } else {
      customerAT = await new Promise((resolve, reject) =>
        failedQueue.push({ resolve, reject })
      );
    }
    config.headers.Authorization = `Bearer ${customerAT}`;
  }

  if (!config.headers.Authorization) {
    if (!useMerchant && customerAT && isTokenExpired(customerAT)) {
      if (!isRefreshing) {
        isRefreshing = true;
        customerAT = await refreshAccessToken({ meta: { skipAuth: true } });
        processQueue(null, customerAT);
        isRefreshing = false;
      } else {
        customerAT = await new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        );
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
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const isRefresh =
      (original.url || "").includes("/auth/refresh-token") ||
      (original.url || "").includes("/auth-refresh");

    if (!isRefresh && error.response?.status === 401 && !original._retry) {
      console.log("[AUTH] 401 caught → try refresh...");
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refreshToken");

        const response = await axios.post(
          `${apiURL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            meta: { skipAuth: true },
          } // no custom header
        );
        const data = response.data?.data || response.data;
        if (!data?.accessToken) throw new Error("No accessToken from refresh");
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken)
          localStorage.setItem("refreshToken", data.refreshToken);

        console.log("[AUTH] refresh OK, retrying original");
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(original);
      } catch (e) {
        console.log("[AUTH] refresh FAILED", e);
        return Promise.reject(e);
      }
    }

    if (!isRefresh && error.response?.status === 403 && !original._retry) {
      console.log("[AUTH] 403 caught → force one refresh then retry...");
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refreshToken");

        const response = await axios.post(
          `${apiURL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            meta: { skipAuth: true },
          }
        );
        const data = response.data?.data || response.data;
        if (!data?.accessToken) throw new Error("No accessToken from refresh");
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken)
          localStorage.setItem("refreshToken", data.refreshToken);

        console.log("[AUTH] refresh OK (403 path), retrying original");
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(original);
      } catch (e) {
        console.log("[AUTH] refresh FAILED (403 path)", e);
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

console.log("✅ Axios interceptors with auto-refresh initialized");
