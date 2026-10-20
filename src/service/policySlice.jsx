import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const getPolicy = createAsyncThunk(
  "policy/getPolicy",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hotel_policies/`, {
        params: { ...params },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const updatePolicy = createAsyncThunk(
  "policy/updatePolicy",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hotel_policies/${id}/`, {
        ...data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

const policySlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    total: 0,
    loading: false,
    error: null,
    details: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default policySlice.reducer;
export const policySelector = (state) => state.policy;
