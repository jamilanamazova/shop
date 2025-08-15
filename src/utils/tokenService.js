import axios from "axios";
import { apiURL } from "../Backend/Api/api";
import { applyAuthHeaderForMode } from "./roleMode";

// Token utility functions
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("merchantAccessToken");
  localStorage.removeItem("merchantRefreshToken");
};

// Token-in expire olub-olmadığını yoxla
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // 30 saniyə əvvəl expire check et (safety margin)
    return payload.exp < currentTime + 30;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true;
  }
};

// Refresh token ilə yeni access token al
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Refreshing access token...");

    // Try primary endpoint
    const tryRefresh = async (url) => {
      const resp = await axios.post(
        url,
        { refreshToken },
        { headers: { "X-Skip-Auth": "1" }, meta: { skipAuth: true } }
      );
      console.log("✅ Token refresh response:", resp.data);

      // Accept several shapes: {status:'OK', data:{accessToken, refreshToken}} or {accessToken, refreshToken}
      let at, rt;
      if (resp.data?.data?.accessToken) {
        at = resp.data.data.accessToken;
        rt = resp.data.data.refreshToken || refreshToken;
      } else if (resp.data?.accessToken) {
        at = resp.data.accessToken;
        rt = resp.data.refreshToken || refreshToken;
      }

      if (!at) {
        // Some APIs might return 200 without status field
        if (
          !resp.data?.status &&
          (resp.status === 200 || resp.status === 201)
        ) {
          // still accept if tokens exist
          if (at) {
            // no-op
          }
        } else {
          throw new Error("Invalid refresh response shape");
        }
      }

      // Save and update defaults
      setTokens(at, rt);
      applyAuthHeaderForMode();
      console.log("✅ New tokens saved successfully");
      return at;
    };

    try {
      return await tryRefresh(`${apiURL}/auth/refresh-token`);
    } catch (e1) {
      console.warn(
        "Primary refresh endpoint failed, trying fallback /auth-refresh",
        e1?.message
      );
      // Fallback alternate path if backend uses different route
      return await tryRefresh(`${apiURL}/auth-refresh`);
    }
  } catch (error) {
    console.error("❌ Token refresh failed:", error);

    // Refresh fail olsa logout et
    clearTokens();
    window.location.href = "/signin";

    throw error;
  }
};
