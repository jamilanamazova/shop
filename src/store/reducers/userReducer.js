import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  userInfo: null,
  preferences: {
    currency: "USD",
    language: "en",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },

    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userInfo = null;
    },

    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const { setAuthToken, setUserInfo, logout, updatePreferences } =
  userSlice.actions;
export default userSlice.reducer;

export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectAccessToken = (state) => state.user.accessToken;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectUserPreferences = (state) => state.user.preferences;
