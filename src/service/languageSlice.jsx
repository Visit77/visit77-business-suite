import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getLanguage = createAsyncThunk(
  "language/getLanguage",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/language/languages/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getLanguage
      .addCase(getLanguage.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getLanguage.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getLanguage.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default languageSlice.reducer;
export const languageSelector = (state) => state.language;
