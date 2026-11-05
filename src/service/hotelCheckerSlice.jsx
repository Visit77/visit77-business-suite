import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getHotelChecker = createAsyncThunk(
  "hotelChecker/getHotelChecker",
  async (params, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;

    try {
      const response = await api.get(`/api/v1/admin/remittance-checkers/`, {
        baseURL: BOOKING_URL,
        params: queryParams,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const removeHotelChecker = createAsyncThunk(
  "hotelChecker/removeHotelChecker",
  async ({ id, business_id }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/admin/remittance-checkers/${id}`, {
        baseURL: BOOKING_URL,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

export const createHotelChecker = createAsyncThunk(
  "hotelChecker/createHotelChecker",
  async ({ business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/remittance-checkers/`,
        { ...data },
        {
          baseURL: BOOKING_URL,
          headers: {
            "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
            "X-Booking-Business-ID": business_id,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

const hotelCheckerSlice = createSlice({
  name: "hotelChecker",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getHotelChecker
      .addCase(getHotelChecker.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getHotelChecker.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.actors;
        state.count = payload.count || state.count;
      })
      .addCase(getHotelChecker.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })
      .addCase(removeHotelChecker.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default hotelCheckerSlice.reducer;
export const hotelCheckerSelector = (state) => state.hotelChecker;
