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

export const createOtaInvoiceCharge = createAsyncThunk(
  "invoice_charge/createOtaInvoiceCharge",
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
  "invoice_charge/updateOtaInvoiceCharge",
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

export const deleteOtaInvoiceCharge = createAsyncThunk(
  "invoice_charge/deleteOtaInvoiceCharge",
  async ({ id, business_id }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/admin/ota-invoice-charges/${id}`, {
        baseURL: BOOKING_URL,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

export const getPMSInvoiceCharge = createAsyncThunk(
  "invoice_charge/getPMSInvoiceCharge",
  async (params, { rejectWithValue }) => {
    const { business_id } = params;

    try {
      const response = await api.get(`/api/v1/admin/pms-invoice-charges/`, {
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

export const createPMSInvoiceCharge = createAsyncThunk(
  "room_action/createPMSInvoiceCharge",
  async ({ business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/v1/admin/pms-invoice-charges/`,
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

export const updatePMSInvoiceCharge = createAsyncThunk(
  "room_action/updatePMSInvoiceCharge",
  async ({ business_id, id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/v1/admin/pms-invoice-charges/${id}/`,
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

export const deletePMSInvoiceCharge = createAsyncThunk(
  "invoice_charge/deletePMSInvoiceCharge",
  async ({ id, business_id }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/admin/pms-invoice-charges/${id}`, {
        baseURL: BOOKING_URL,
        headers: {
          "X-Booking-Admin-Key": BOOKING_ADMIN_KEY,
          "X-Booking-Business-ID": business_id,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

export const getDocumentCode = createAsyncThunk(
  "invoice_charge/getDocumentCode",
  async (params, { rejectWithValue }) => {
    const { business_id } = params;

    try {
      const response = await api.get(`/api/v1/admin/hotels/document-code/`, {
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

export const updateDocumentCode = createAsyncThunk(
  "room_action/updateDocumentCode",
  async ({ business_id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/v1/admin/hotels/document-code/`,
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
    documentCode: [],
    total: 0,
    loading: false,
    error: null,
    details: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

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
      })
      .addCase(deleteOtaInvoiceCharge.fulfilled, (state, action) => {
        if (state.ota) {
          if (state.ota.other_charge) {
            state.ota.other_charge = state.ota.other_charge.filter(
              (item) => item.id !== action.payload,
            );
          }

          if (state.ota.other_tax) {
            state.ota.other_tax = state.ota.other_tax.filter(
              (item) => item.id !== action.payload,
            );
          }
        }
        state.total -= 1;
      })
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
      .addCase(deletePMSInvoiceCharge.fulfilled, (state, action) => {
        if (state.pms) {
          if (state.pms.other_charge) {
            state.pms.other_charge = state.pms.other_charge.filter(
              (item) => item.id !== action.payload,
            );
          }

          if (state.pms.other_tax) {
            state.pms.other_tax = state.pms.other_tax.filter(
              (item) => item.id !== action.payload,
            );
          }
        }
        state.total -= 1;
      })
      .addCase(getDocumentCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDocumentCode.fulfilled, (state, action) => {
        state.loading = false;
        state.documentCode = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getDocumentCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceChargeSlice.reducer;
export const invoiceChargeSelector = (state) => state.invoiceCharge;
