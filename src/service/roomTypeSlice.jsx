import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const getRoomType = createAsyncThunk(
  "room_types/getRoomType",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`/room_types`, {
        params: { ...params },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const deleteRoomType = createAsyncThunk(
  "room_types/deleteRoomType",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/room_types/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

const roomTypeSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoomType.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoomType.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRoomType.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default roomTypeSlice.reducer;
export const roomTypeSelector = (state) => state.roomType;
