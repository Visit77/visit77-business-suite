import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getRoomView = createAsyncThunk(
  "roomView/getRoomView",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/room_views/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const roomViewSlice = createSlice({
  name: "roomView",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoomView.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRoomView.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getRoomView.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default roomViewSlice.reducer;
export const roomViewSelector = (state) => state.roomView;
