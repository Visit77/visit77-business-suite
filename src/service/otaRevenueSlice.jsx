import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getOtaRevenue = createAsyncThunk(
  "otaRevenue/getOtaRevenue",
  async (params, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;
    try {
      const { data, headers } = await api.get("admin/ota-revenue/", {
        baseURL: BOOKING_URL,
        params: queryParams,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
        },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const otaRevenueSlice = createSlice({
  name: "otaRevenue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getOtaRevenue
      .addCase(getOtaRevenue.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getOtaRevenue.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getOtaRevenue.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default otaRevenueSlice.reducer;
export const otaRevenueSelector = (state) => state.otaRevenue;
