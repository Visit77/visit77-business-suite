import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

export const getBookingRoomType = createAsyncThunk(
  "room/getBookingRoomType",
  async (params = {}, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;

    try {
      const response = await api.get(`/api/v1/admin/room-types/`, {
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

const bookingRoomTypeSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    details: {},
    total: 0,
    isPending: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBookingRoomType.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getBookingRoomType.fulfilled, (state, action) => {
        state.isPending = false;
        state.data = action.payload.data;
      })
      .addCase(getBookingRoomType.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      });
  },
});

export default bookingRoomTypeSlice.reducer;
export const bookingRoomTypeSelector = (state) => state.bookingRoomType;
