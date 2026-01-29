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

    const mode = getAppMode();
    const useMerchant =
      (original.meta && original.meta.useMerchant) ||
      original.headers?.["X-Use-Merchant"] === "1" ||
      mode === "merchant";
    const merchantRefreshToken = localStorage.getItem("merchantRefreshToken");

    if (
      useMerchant &&
      !isRefresh &&
      (error.response?.status === 401 || error.response?.status === 403) &&
      !original._retry
    ) {
      console.log("[AUTH] Merchant token expired, refreshing...");
      original._retry = true;
      try {
        if (!merchantRefreshToken) throw new Error("No merchantRefreshToken");
        const response = await axios.post(
          `${apiURL}/auth/refresh-token`,
          { refreshToken: merchantRefreshToken },
          {
            headers: { "Content-Type": "application/json" },
            meta: { skipAuth: true, useMerchant: true },
          }
        );
        const data = response.data?.data || response.data;
        if (!data?.accessToken)
          throw new Error("No merchant accessToken from refresh");
        localStorage.setItem("merchantAccessToken", data.accessToken);
        if (data.refreshToken)
          localStorage.setItem("merchantRefreshToken", data.refreshToken);

        console.log("[AUTH] Merchant refresh OK, retrying original");
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(original);
      } catch (e) {
        console.log("[AUTH] Merchant refresh FAILED", e);
        return Promise.reject(e);
      }
    }

    const customerRefreshToken = localStorage.getItem("refreshToken");
    if (
      !useMerchant &&
      !isRefresh &&
      (error.response?.status === 401 || error.response?.status === 403) &&
      !original._retry
    ) {
      console.log("[AUTH] Customer token expired, refreshing...");
      original._retry = true;
      try {
        if (!customerRefreshToken) throw new Error("No refreshToken");
        const response = await axios.post(
          `${apiURL}/auth/refresh-token`,
          { refreshToken: customerRefreshToken },
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

        console.log("[AUTH] Customer refresh OK, retrying original");
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(original);
      } catch (e) {
        console.log("[AUTH] Customer refresh FAILED", e);
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

console.log("✅ Axios interceptors with auto-refresh initialized");
