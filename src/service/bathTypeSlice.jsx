import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getBathTypes = createAsyncThunk(
  "bathTypes/getBathTypes",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/bath_types/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const bathTypesSlice = createSlice({
  name: "bathTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBathTypes.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getBathTypes.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getBathTypes.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default bathTypesSlice.reducer;
export const bathTypesSelector = (state) => state.bathTypes;
