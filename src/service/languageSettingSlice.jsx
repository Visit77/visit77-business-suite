import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getLanguageSetting = createAsyncThunk(
  "languageSetting/getLanguageSetting",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/language/settings", {});
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const languageSettingSlice = createSlice({
  name: "languageSetting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getLanguageSetting
      .addCase(getLanguageSetting.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getLanguageSetting.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getLanguageSetting.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default languageSettingSlice.reducer;
export const languageSettingSelector = (state) => state.languageSetting;
