import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

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

const roomSlice = createSlice({
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
      });
  },
});

export default roomSlice.reducer;
export const roomSelector = (state) => state.room;
