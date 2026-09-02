import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

export const getRoomDetails = createAsyncThunk(
  "room/getRoomDetails",
  async (params = {}, { rejectWithValue }) => {
    const { ...queryParams } = params;

    try {
      const response = await api.get(`/physical_rooms/${queryParams?.id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const getRoomHistory = createAsyncThunk(
  "room/getRoomHistory",
  async (params = {}, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;

    try {
      const response = await api.get(
        `/admin/physical-rooms/${queryParams?.id}/history/`,
        {
          baseURL: BOOKING_URL,
          params: queryParams,
          headers: {
            "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
            "X-Booking-Business-ID": business_id,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const getAvailableRoom = createAsyncThunk(
  "room/getAvailableRoom",
  async (params = {}, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;

    try {
      const response = await api.get(`/admin/available-rooms/search/`, {
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

const roomSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    total: 0,
    isPending: false,
    details: {},
    history: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getRoomDetails.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getRoomDetails.fulfilled, (state, action) => {
        state.isPending = false;
        state.details = action.payload.data;
      })
      .addCase(getRoomDetails.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      })
      .addCase(getRoomHistory.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getRoomHistory.fulfilled, (state, action) => {
        state.isPending = false;
        state.history = action.payload.data;
      })
      .addCase(getRoomHistory.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      })
      .addCase(getAvailableRoom.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getAvailableRoom.fulfilled, (state, action) => {
        state.isPending = false;
        state.data = action.payload.data;
      })
      .addCase(getAvailableRoom.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      });
  },
});

export default roomSlice.reducer;
export const roomSelector = (state) => state.room;
