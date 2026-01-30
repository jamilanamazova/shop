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

    // Əgər access token var və hələ expire olmayıb
    if (accessToken && !isTokenExpired(accessToken)) {
      return true;
    }

    // Əgər access token yoxdur və ya expire olub, amma refresh token var
    if (refreshToken && !isTokenExpired(refreshToken)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const logout = () => {
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
