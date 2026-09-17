import { createSlice, createAsyncThunk, isPending } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

export const getRoomBoard = createAsyncThunk(
  "room_board/getRoomBoard",
  async (params = {}, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;

    try {
      const response = await api.get(`/api/v1/admin/room-board`, {
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

export const deleteRoom = createAsyncThunk(
  "room_board/deleteRoom",
  async ({ id, business_id }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/room_board/${id}`, {
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

export const getOneRoom = createAsyncThunk(
  "room_board/getOneRoom",
  async (params = {}, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;

    try {
      const response = await api.get(
        `/api/v1/admin/physical-rooms/${queryParams?.id}/`,
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

const roomBoardSlice = createSlice({
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
    builder
      .addCase(getRoomBoard.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getRoomBoard.fulfilled, (state, action) => {
        state.isPending = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getRoomBoard.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      })

      .addCase(getOneRoom.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getOneRoom.fulfilled, (state, action) => {
        state.isPending = false;
        state.details = action.payload.data;
      })
      .addCase(getOneRoom.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      })

      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default roomBoardSlice.reducer;
export const roomBoardSelector = (state) => state.roomBoard;
