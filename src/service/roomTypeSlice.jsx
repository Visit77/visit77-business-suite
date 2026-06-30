import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// Async Thunk for Fetching Data with Pagination
export const fetchData = createAsyncThunk(
  "data/fetchData",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      // API endpoints example: /items?page=1&limit=10
      const response = await api.get(`/items`, {
        params: { page, limit },
      });
      return response.data; // Expected format: { data: [...], total: 100 }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

// Delete Action Example
export const deleteItem = createAsyncThunk(
  "data/deleteItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

const roomTypeSlice = createSlice({
  name: "data",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Data
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data; // Adjust based on your API response structure
        state.total = action.payload.total;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Item
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default roomTypeSlice.reducer;
