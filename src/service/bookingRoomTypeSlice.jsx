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

export const createRoomPrice = createAsyncThunk(
  "room/createRoomPrice",
  async ({ business_id, id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/admin/room-types/${id}/room-price/`,
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

export const createSeasonalRate = createAsyncThunk(
  "room/createSeasonalRate",
  async ({ business_id, id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/room-types/${id}/seasonal-rates/`,
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

export const updateSeasonalRate = createAsyncThunk(
  "room/updateSeasonalRate",
  async ({ business_id, id, rate_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/admin/room-types/${id}/seasonal-rates/${rate_id}/`,
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

export const endSeasonalRate = createAsyncThunk(
  "room/endSeasonalRate",
  async ({ business_id, id, rate_id }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/room-types/${id}/seasonal-rates/${rate_id}/end/`,
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

export const createDiscountRate = createAsyncThunk(
  "room/createDiscountRate",
  async ({ business_id, id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/room-types/${id}/discounts/`,
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

export const updateDiscountRate = createAsyncThunk(
  "room/updateDiscountRate",
  async ({ business_id, id, discount_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/admin/room-types/${id}/discounts/${discount_id}/`,
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

export const endDiscountRate = createAsyncThunk(
  "room/endDiscountRate",
  async ({ business_id, id, discount_id }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/room-types/${id}/discounts/${discount_id}/end/`,
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

export const setExtraBedPrice = createAsyncThunk(
  "room/setExtraBedPrice",
  async ({ business_id, id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/admin/room-types/${id}/extra-bed-price/`,
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
