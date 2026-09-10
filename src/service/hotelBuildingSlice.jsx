import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const getHotelBuilding = createAsyncThunk(
  "hotel_building/getHotelBuilding",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hotel_buildings`, {
        params: { ...params },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const createHotelBuilding = createAsyncThunk(
  "hotel_building/createHotelBuilding",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hotel_buildings/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

export const updateHotelBuilding = createAsyncThunk(
  "hotel_building/updateHotelBuilding",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hotel_buildings/${id}/`, { ...data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

export const deleteHotelBuilding = createAsyncThunk(
  "hotel_building/deleteHotelBuilding",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/hotel_buildings/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

const hotelBuildingSlice = createSlice({
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
      .addCase(getHotelBuilding.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHotelBuilding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getHotelBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteHotelBuilding.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default hotelBuildingSlice.reducer;
export const hotelBuildingSelector = (state) => state.hotelBuilding;
