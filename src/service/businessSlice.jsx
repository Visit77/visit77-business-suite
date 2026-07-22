import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  details: {},

  count: 0,
};

export const getBusiness = createAsyncThunk(
  "business/getAllBusiness",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/business/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getOneBusiness = createAsyncThunk(
  "business/getOneBusiness",
  async (id, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get(`/business/${id}`);
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getBusinessByMerchantOrderId = createAsyncThunk(
  "business/getBusinessByMerchantOrderId",
  async (merchantOrderId, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get(
        `/subscriptions/billing/kbz/payment-result/${merchantOrderId}/business`,
      );
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateBusiness = createAsyncThunk(
  "business/updateBusiness",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/business/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const closeBusiness = createAsyncThunk(
  "business/closeBusiness",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.post(
        `/business/${id}/deactivate/`,
        values,
      );
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const reinstateBusiness = createAsyncThunk(
  "business/reinstateBusiness",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.post(
        `/business/${id}/reinstate/`,
        values,
      );
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const addAdminInBusiness = createAsyncThunk(
  "business/addAdminInBusiness",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.post(
        `/business/${id}/add_admin/`,
        values,
      );
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const removeAdminInBusiness = createAsyncThunk(
  "business/removeAdminInBusiness",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.post(
        `/business/${id}/remove_admin/`,
        values,
      );
      return values.user_id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ Delete a acc
export const deleteBusiness = createAsyncThunk(
  "business/deleteBusiness",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/business/${id}`, {
        data: {
          password: values?.password || "",
          is_initial: values?.is_initial ?? false,
        }, // Wrap in object
        headers: {
          "Content-Type": "application/json",
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    clearBusiness: (state) => {
      state.data = [];
    },
    selectedBusiness: (state, action) => {
      state.details = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Handle getBusiness
      .addCase(getBusiness.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getBusiness.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getBusiness.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })
      //get one
      .addCase(getOneBusiness.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getOneBusiness.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.details = payload.data?.data;
      })
      .addCase(getOneBusiness.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })
      .addCase(getBusinessByMerchantOrderId.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getBusinessByMerchantOrderId.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.details = payload.data?.data;
      })
      .addCase(getBusinessByMerchantOrderId.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })

      // updateBusiness
      .addCase(updateBusiness.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(updateBusiness.fulfilled, (state, { payload }) => {
        state.isPending = false;
        const updateData = payload?.data?.[0];
        const index = state.data.findIndex((blog) => blog.id === updateData.id);

        if (index !== -1) {
          state.data = [
            ...state.data.slice(0, index),
            { ...state.data[index], ...updateData },
            ...state.data.slice(index + 1),
          ];
        }
      })
      .addCase(updateBusiness.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});
export const { clearBusiness, selectedBusiness } = businessSlice.actions;
export default businessSlice.reducer;
export const businessSelector = (state) => state.business;
