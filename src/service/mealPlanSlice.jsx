import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  data: [],
  packageMeal: [],
  details: {},
  count: 0,
};

export const createMealPlan = createAsyncThunk(
  "meal_plans/createMealPlan",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/meal_plans/`, {
        ...data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
    }
  },
);

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

export const getOneMealPlan = createAsyncThunk(
  "mealPlan/getOneMealPlan",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get(`/meal_plans/${params?.id}`, {});
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getMealPlanForPackage = createAsyncThunk(
  "mealPlan/getMealPlanForPackage",
  async (params, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get("/meal_plans/", {
        params: { ...params, plan_type: "package" },
      });
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteMealPlan = createAsyncThunk(
  "mealPlan/deleteMealPlan",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/meal_plans/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

export const updateMealPlan = createAsyncThunk(
  "mealPlan/updateMealPlan",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/meal_plans/${id}`, {
        ...data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed");
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
      })
      .addCase(getMealPlanForPackage.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getMealPlanForPackage.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.packageMeal = payload.data?.data;
        state.count = payload.count || state.count;
      })
      .addCase(getMealPlanForPackage.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })
      .addCase(deleteMealPlan.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.total -= 1;

        state.packageMeal = state.packageMeal.filter(
          (item) => item.id !== action.payload,
        );
      })
      .addCase(getOneMealPlan.pending, (state) => {
        state.isPending = true;
      })
      .addCase(getOneMealPlan.fulfilled, (state, action) => {
        state.isPending = false;
        state.details = action.payload.data.data;
      })
      .addCase(getOneMealPlan.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload;
      });
  },
});

export default mealPlanSlice.reducer;
export const mealPlanSelector = (state) => state.mealPlan;
