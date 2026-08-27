import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getBedTypes = createAsyncThunk(
  "bedType/getBedTypes",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/bed_types/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const bedTypesSlice = createSlice({
  name: "bedTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBedTypes.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getBedTypes.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getBedTypes.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default bedTypesSlice.reducer;
export const bedTypesSelector = (state) => state.bedTypes;
