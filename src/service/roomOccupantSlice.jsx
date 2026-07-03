import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getRoomOccupant = createAsyncThunk(
  "roomOccupant/getRoomOccupant",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/room_occupant/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const roomOccupantSlice = createSlice({
  name: "roomOccupant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getRoomOccupant
      .addCase(getRoomOccupant.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRoomOccupant.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getRoomOccupant.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default roomOccupantSlice.reducer;
export const roomOccupantSelector = (state) => state.roomOccupant;
