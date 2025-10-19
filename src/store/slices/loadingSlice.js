import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    count: 0,
  },
  reducers: {
    startLoading: (state) => {
      state.count += 1;
    },
    stopLoading: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;