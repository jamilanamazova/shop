import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
} from "./tokenService";

export const isAuthenticated = () => {
  try {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    console.log("🔍 Auth check:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenExpired: accessToken ? isTokenExpired(accessToken) : "N/A",
      refreshTokenExpired: refreshToken ? isTokenExpired(refreshToken) : "N/A",
    });

    // Əgər access token var və hələ expire olmayıb
    if (accessToken && !isTokenExpired(accessToken)) {
      console.log("✅ Auth: Valid access token found");
      return true;
    }

    // Əgər access token yoxdur və ya expire olub, amma refresh token var
    if (refreshToken && !isTokenExpired(refreshToken)) {
      console.log("✅ Auth: Valid refresh token found");
      return true;
    }

    console.log("❌ Auth: No valid tokens found");
    return false;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const logout = () => {
  console.log("🚪 Logging out user...");
  clearTokens();

  // Browser history-də həlqə yaratmamaq üçün replace istifadə et
  if (window.location.pathname !== "/signin") {
    window.location.replace("/signin");
  }
};

export const getCurrentUser = () => {
  const savedUser = localStorage.getItem("currentUser");
  return savedUser ? JSON.parse(savedUser) : null;
};

export { getAccessToken, getRefreshToken } from "./tokenService";
