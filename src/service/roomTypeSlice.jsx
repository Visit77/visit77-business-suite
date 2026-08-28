import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const getRoomType = createAsyncThunk(
  "room_types/getRoomType",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`/room_types`, {
        params: { ...params },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const createRoomType = createAsyncThunk(
  "room_types/createRoomType",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/room_types/`, { ...data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

export const updateRoomType = createAsyncThunk(
  "room_types/updateRoomType",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/room_types/${id}/`, { ...data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

export const uploadRoomTypeImage = createAsyncThunk(
  "room_types/uploadRoomTypeImage",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/room_types/${id}/images/`, formData, {
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

export const deleteRoomType = createAsyncThunk(
  "room_types/deleteRoomType",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/room_types/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

export const getOneRoomType = createAsyncThunk(
  "room_types/getOneRoomType",
  async (id, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get(`/room_types/${id}`);
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const bulkDeleteImage = createAsyncThunk(
  "room_types/bulk-delete",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/room_types/${id}/images/bulk-delete/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

const roomTypeSlice = createSlice({
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
      .addCase(getRoomType.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoomType.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRoomType.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.total -= 1;
      })
      .addCase(getOneRoomType.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getOneRoomType.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.details = payload.data?.data;
      })
      .addCase(getOneRoomType.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default roomTypeSlice.reducer;
export const roomTypeSelector = (state) => state.roomType;
