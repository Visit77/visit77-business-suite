import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getRoomBuildTypes = createAsyncThunk(
  "roomBuildTypes/getRoomBuildTypes",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/room_build_types/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const roomBuildTypesSlice = createSlice({
  name: "roomBuildTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoomBuildTypes.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getRoomBuildTypes.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getRoomBuildTypes.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default roomBuildTypesSlice.reducer;
export const roomBuildTypesSelector = (state) => state.roomBuildTypes;
