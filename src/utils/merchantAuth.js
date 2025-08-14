export const isMerchant = () => {
  return !!localStorage.getItem("merchantAccessToken");
};

export const getMerchantAccessToken = () => {
  return localStorage.getItem("merchantAccessToken");
};

export const clearMerchantTokens = () => {
  localStorage.removeItem("merchantAccessToken");
  localStorage.removeItem("merchantRefreshToken");
};

export const switchToCustomer = () => {
  clearMerchantTokens();
  window.location.href = "/";
};
