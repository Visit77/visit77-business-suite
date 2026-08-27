import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getRoomPolicies = createAsyncThunk(
  "roomPolicies/getRoomPolicies",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/room_policies/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const roomPoliciesSlice = createSlice({
  name: "roomPolicies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoomPolicies.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRoomPolicies.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getRoomPolicies.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default roomPoliciesSlice.reducer;
export const roomPoliciesSelector = (state) => state.roomPolicies;
