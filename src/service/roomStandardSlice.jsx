import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getRoomStandard = createAsyncThunk(
  "roomStandard/getRoomStandard",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/room_standards/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const roomStandardSlice = createSlice({
  name: "roomStandard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoomStandard.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRoomStandard.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getRoomStandard.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default roomStandardSlice.reducer;
export const roomStandardSelector = (state) => state.roomStandard;
