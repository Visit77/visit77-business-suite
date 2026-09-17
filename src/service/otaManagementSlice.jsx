import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  record: [],
  count: 0,
};

export const getOTARoom = createAsyncThunk(
  "otaManagement/getOTARoom",
  async (params, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;
    try {
      const { data, headers } = await api.get(
        "/api/v1/admin/ota-rooms/selection/",
        {
          baseURL: BOOKING_URL,
          params: queryParams,
          headers: {
            "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
            "X-Booking-Business-ID": business_id,
          },
        },
      );
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getOTARecord = createAsyncThunk(
  "otaManagement/getOTARecord",
  async (params, { rejectWithValue }) => {
    const { business_id, ...queryParams } = params;
    try {
      const { data, headers } = await api.get("/api/v1/admin/ota-records/", {
        baseURL: BOOKING_URL,
        params: queryParams,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
        },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const otaManagementSlice = createSlice({
  name: "otaManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getOTARoom
      .addCase(getOTARoom.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getOTARoom.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getOTARoom.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })
      .addCase(getOTARecord.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getOTARecord.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.record = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getOTARecord.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default otaManagementSlice.reducer;
export const otaManagementSelector = (state) => state.otaManagement;
