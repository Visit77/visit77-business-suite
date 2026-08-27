import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  count: 0,
};

export const getMealPlan = createAsyncThunk(
  "mealPlan/getMealPlan",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/meal_plans/", {
        params: { ...params },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const mealPlanSlice = createSlice({
  name: "mealPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMealPlan.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getMealPlan.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.data = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getMealPlan.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});

export default mealPlanSlice.reducer;
export const mealPlanSelector = (state) => state.mealPlan;
