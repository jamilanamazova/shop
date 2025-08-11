export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const getCurrentUser = () => {
  const userString = localStorage.getItem("currentUser");
  if (userString) {
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing currentUser:", error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  const user = getCurrentUser();
  return !!(token && user);
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  console.log("🚪 User logged out");
};

export const checkTokens = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  console.log("=== TOKEN STATUS ===");
  console.log("Access Token:", accessToken ? "✅ Present" : "❌ Missing");
  console.log("Refresh Token:", refreshToken ? "✅ Present" : "❌ Missing");
  console.log("User Data:", getCurrentUser() ? "✅ Present" : "❌ Missing");
  console.log("Authenticated:", isAuthenticated() ? "✅ Yes" : "❌ No");
  console.log("==================");

  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    isAuthenticated: isAuthenticated(),
  };
};

export const checkAuthSession = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const user = getCurrentUser();

  if (!accessToken || !refreshToken || !user) {
    console.log("❌ No valid session found - redirecting to login");
    return false;
  }

  return true;
};

export const redirectToLogin = (message = "Please sign in to continue") => {
  alert(message);
  logout();
  window.location.href = "/signin";
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true;
  }
};
