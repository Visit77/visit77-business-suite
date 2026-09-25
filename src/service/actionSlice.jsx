import { createSlice, createAsyncThunk, isPending } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

export const updateRoomStatus = createAsyncThunk(
  "room_action/updateRoomStatus",
  async ({ id, business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/admin/physical-rooms/${id}`,
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

export const roomBlock = createAsyncThunk(
  "room_action/roomBlock",
  async ({ id, business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/room-blocks/`,
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

export const makeReservation = createAsyncThunk(
  "room_action/makeReservation",
  async ({ business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/admin/reservations/`, data, {
        baseURL: BOOKING_URL,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

export const finalVerifiedCheckIn = createAsyncThunk(
  "room_action/finalVerifiedCheckIn",
  async ({ booking_id, business_id }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/bookings/${booking_id}/check-in/`,
        {
          verification_confirmed: true,
          verification_note: "Guest identity and room assignment verified.",
        },
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

export const updateCheckInInfo = createAsyncThunk(
  "room_action/updateCheckInInfo",
  async ({ booking_id, business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/admin/bookings/${booking_id}/check-in-form/`,
        data,
        {
          baseURL: BOOKING_URL,
          headers: {
            "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
            "X-Booking-Business-ID": business_id,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

export const roomUnblock = createAsyncThunk(
  "room_action/roomUnblock",
  async ({ id, business_id }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/room-blocks/${id}/unblock/`,
        {},
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

export const checkOutRoom = createAsyncThunk(
  "room_action/checkOutRoom",
  async ({ booking_id, business_id }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/bookings/${booking_id}/check-out/`,
        {},
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

export const cancelRoom = createAsyncThunk(
  "room_action/cancelRoom",
  async ({ booking_id, business_id }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/bookings/${booking_id}/cancel/`,
        {},
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

export const bookingPayment = createAsyncThunk(
  "room_action/bookingPayment",
  async ({ booking_id, business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/bookings/${booking_id}/payment/`,
        { ...data },
        {
          baseURL: BOOKING_URL,
          headers: {
            "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
            "X-Booking-Business-ID": business_id,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

const actionSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    total: 0,
    isPending: false,
    details: {},
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder;

    // .addCase(finalVerifiedCheckIn.pending, (state) => {
    //   state.isPending = true;
    // })
    // .addCase(finalVerifiedCheckIn.fulfilled, (state, action) => {
    //   state.isPending = false;
    //   state.details = action.payload.data;
    // })
    // .addCase(finalVerifiedCheckIn.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.payload;
    // });
  },
});

export default actionSlice.reducer;
export const actionSelector = (state) => state.action;
