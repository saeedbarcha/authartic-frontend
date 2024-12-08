import { createSlice } from "@reduxjs/toolkit";

// Check if running in the browser
const isBrowser = typeof window !== "undefined";

// Initial state setup
const initialState = {
  userInfo:
    isBrowser && localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
};

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (isBrowser) {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      if (isBrowser) {
        localStorage.removeItem("userInfo");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
