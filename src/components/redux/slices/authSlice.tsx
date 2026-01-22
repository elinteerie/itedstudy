// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  lastActivity: number;
  expires: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  lastActivity: Date.now(),
  expires: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
    updateExpires: (state, action: PayloadAction<string | null>) => {
      state.expires = action.payload;
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
  },
});

export const { loginUser, logoutUser, updateLastActivity, updateExpires } =
  authSlice.actions;
export default authSlice.reducer;
