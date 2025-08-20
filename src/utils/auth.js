import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
} from "./tokenService";

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  if (refreshToken) {
    return true;
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

export { getAccessToken, getRefreshToken } from "./tokenService";
