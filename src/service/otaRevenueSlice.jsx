import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  remittanceFile: "",
  remittanceDetails: {},
  count: 0,
};

export const getOtaRevenue = createAsyncThunk(
  "otaRevenue/getOtaRevenue",
  async (params, { rejectWithValue }) => {
    const { business_id, status, ...queryParams } = params;
    try {
      let endpoint = `/api/v1/admin/ota-revenue/${status}/`;
      const finalParams = { ...queryParams };

      if (status === "remittances") {
        endpoint = `/api/v1/admin/remittances/`;
      } else if (status === "all") {
        endpoint = `/api/v1/admin/ota-revenue/`;
        finalParams.status = "all";
      }

      const { data, headers } = await api.get(endpoint, {
        baseURL: BOOKING_URL,
        params: finalParams,
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

export const getRemittanceFile = createAsyncThunk(
  "otaRevenue/getRemittanceFile",
  async (params, { rejectWithValue }) => {
    const { business_id, url } = params;
    try {
      const { data, headers } = await api.get(`${url}`, {
        baseURL: BOOKING_URL,
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

export const getRemittanceDetails = createAsyncThunk(
  "otaRevenue/getRemittanceDetails",
  async (params, { rejectWithValue }) => {
    const { business_id, id } = params;
    try {
      const { data, headers } = await api.get(
        `/api/v1/admin/remittances/${id}/`,
        {
          baseURL: BOOKING_URL,
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

export const confirmReceive = createAsyncThunk(
  "otaRevenue/confirmReceive",
  async ({ business_id, id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/remittances/${id}/receive/`,
        { ...data },
        {
          baseURL: BOOKING_URL,
          headers: {
            "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
            "X-Booking-Business-ID": business_id,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

const otaRevenueSlice = createSlice({
  name: "otaRevenue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getOtaRevenue
      .addCase(getOtaRevenue.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getOtaRevenue.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getOtaRevenue.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })
      .addCase(getRemittanceFile.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRemittanceFile.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.remittanceFile = payload.data;
      })
      .addCase(getRemittanceFile.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })
      .addCase(getRemittanceDetails.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRemittanceDetails.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.remittanceDetails = payload.data?.data;
      })
      .addCase(getRemittanceDetails.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default otaRevenueSlice.reducer;
export const otaRevenueSelector = (state) => state.otaRevenue;
