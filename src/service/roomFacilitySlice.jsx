import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getRoomFacility = createAsyncThunk(
  "roomFacility/getRoomFacility",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/room_facilities/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const roomFacilitySlice = createSlice({
  name: "roomFacility",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getRoomFacility
      .addCase(getRoomFacility.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRoomFacility.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getRoomFacility.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default roomFacilitySlice.reducer;
export const roomFacilitySelector = (state) => state.roomFacility;
