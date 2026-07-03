import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getRoomAmenity = createAsyncThunk(
  "roomAmenity/getRoomAmenity",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/room_amenities/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const roomAmenitySlice = createSlice({
  name: "roomAmenity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getRoomAmenity
      .addCase(getRoomAmenity.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRoomAmenity.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getRoomAmenity.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default roomAmenitySlice.reducer;
export const roomAmenitySelector = (state) => state.roomAmenity;
