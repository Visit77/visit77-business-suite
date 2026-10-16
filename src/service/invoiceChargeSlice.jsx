import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY, BOOKING_URL } from "../variables/constants";

export const getOTAInvoiceCharge = createAsyncThunk(
  "invoice_charge/getOTAInvoiceCharge",
  async (params, { rejectWithValue }) => {
    const { business_id } = params;

    try {
      const response = await api.get(`/api/v1/admin/ota-invoice-charges/`, {
        baseURL: BOOKING_URL,
        // params: queryParams,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const getPMSInvoiceCharge = createAsyncThunk(
  "invoice_charge/getPMSInvoiceCharge",
  async (params, { rejectWithValue }) => {
    const { business_id } = params;

    try {
      const response = await api.get(`/api/v1/admin/ota-invoice-charges/`, {
        baseURL: BOOKING_URL,
        // params: queryParams,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const createOtaInvoiceCharge = createAsyncThunk(
  "room_action/createOtaInvoiceCharge",
  async ({ business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/ota-invoice-charges/`,
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

export const updateOtaInvoiceCharge = createAsyncThunk(
  "room_action/updateOtaInvoiceCharge",
  async ({ business_id, id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/v1/admin/ota-invoice-charges/${id}/`,
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

const invoiceChargeSlice = createSlice({
  name: "invoiceCharge",
  initialState: {
    ota: [],
    pms: [],
    total: 0,
    loading: false,
    error: null,
    details: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPMSInvoiceCharge.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPMSInvoiceCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.pms = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getPMSInvoiceCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOTAInvoiceCharge.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOTAInvoiceCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.ota = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getOTAInvoiceCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceChargeSlice.reducer;
export const invoiceChargeSelector = (state) => state.invoiceCharge;
