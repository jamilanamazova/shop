import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
} from "./tokenService";

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // Access token var və valid
  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  // Access token expire amma refresh token var
  if (refreshToken) {
    return true; // Interceptor refresh edəcək
  }

  return false;
};

export const logout = () => {
  console.log("🚪 Logging out user...");
  clearTokens();
  window.location.href = "/signin";
};

export const getCurrentUser = () => {
  const savedUser = localStorage.getItem("currentUser");
  return savedUser ? JSON.parse(savedUser) : null;
};

// Export token functions
export { getAccessToken, getRefreshToken } from "./tokenService";
