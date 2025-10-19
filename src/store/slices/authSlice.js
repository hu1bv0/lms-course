import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("access_token"),
  user: localStorage.getItem("user"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("access_token", action.payload.token);
      // localStorage.setItem('user', (action.payload.user));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("roleToEdit"); // Clear roleToEdit on logout
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
