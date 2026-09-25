import { createSlice, createAsyncThunk, isPending } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";
import { finalVerifiedCheckIn, updateCheckInInfo } from "./actionSlice";

export const getBookingDetails = createAsyncThunk(
  "booking/getBookingDetails",
  async (params = {}, { rejectWithValue }) => {
    const { booking_id, business_id } = params;

    try {
      const response = await api.get(`/api/v1/admin/bookings/${booking_id}/`, {
        baseURL: BOOKING_URL,
        // params: queryParams,
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

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    data: [],
    total: 0,
    isPending: false,
    details: {},
    error: null,
  },
  reducers: {
    clearBookingDetails: (state) => {
      state.details = {};
      state.error = null;
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookingDetails.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.isPending = false;
        state.details = action.payload.data;
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      })
      .addCase(updateCheckInInfo.fulfilled, (state, action) => {
        state.details = action.payload.data?.booking;
      })

      .addCase(finalVerifiedCheckIn.fulfilled, (state, action) => {
        state.details = action.payload.data;
      });
  },
});

export default bookingSlice.reducer;
export const { clearBookingDetails } = bookingSlice.actions;
export const bookingSelector = (state) => state.booking;
