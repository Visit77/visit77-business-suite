import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const createPhysicalRoom = createAsyncThunk(
  "physical_rooms/createPhysicalRoom",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/physical_rooms/bulk-create/`, {
        ...data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

export const updatePhysicalRoom = createAsyncThunk(
  "physical_rooms/updatePhysicalRoom",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/physical_rooms/${id}/`, { ...data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

export const deletePhysicalRoom = createAsyncThunk(
  "physical_rooms/deletePhysicalRoom",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/physical_rooms/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

export const getOnePhysicalRoom = createAsyncThunk(
  "physical_rooms/getOnePhysicalRoom",
  async (id, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get(`/physical_rooms/${id}`);
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const physicalRoomSlice = createSlice({
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

      .addCase(deletePhysicalRoom.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.total -= 1;
      })
      .addCase(getOnePhysicalRoom.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getOnePhysicalRoom.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.details = payload.data?.data;
      })
      .addCase(getOnePhysicalRoom.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default physicalRoomSlice.reducer;
export const physicalRoomSelector = (state) => state.physicalRoom;
