import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getFacility = createAsyncThunk(
  "facility/getFacility",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/business_service/", {
        params: { ...params, order_by: `["-rank","name"]`, is_active: "true" },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const facilitySlice = createSlice({
  name: "facility",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getFacility
      .addCase(getFacility.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getFacility.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getFacility.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default facilitySlice.reducer;
export const facilitySelector = (state) => state.facility;
