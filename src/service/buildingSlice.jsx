import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { BOOKING_ADMIN_KEY } from "../variables/constants";

export const getHotelBuilding = createAsyncThunk(
  "hotel_buildings/getHotelBuilding",
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

export const deleteRoom = createAsyncThunk(
  "hotel_buildings/deleteRoom",
  async ({ id, businessId }, { rejectWithValue }) => {
    try {
      await api.delete(`/hotel_buildings/${id}`, {});
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

const buildingSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    total: 0,
    isPending: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHotelBuilding.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getHotelBuilding.fulfilled, (state, action) => {
        state.isPending = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getHotelBuilding.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default buildingSlice.reducer;
export const buildingSelector = (state) => state.building;
