import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const initialState = {
  isPending: false,
  hasError: false,
  profile: {},
  count: 0,
};

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (id, { rejectWithValue }) => {
    try {
      const { data, headers } = await api.get(`/accounts/${id}`);
      return { data, headers };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ Update an Existing Blog
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/accounts/${id}/`, values);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      //get profile
      .addCase(getProfile.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(getProfile.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.profile = payload.data?.data;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      })

      // 🔹 Handle update profile
      .addCase(updateProfile.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.isPending = false;
        state.profile = payload?.data;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isPending = false;
        state.hasError = true;
      });
  },
});
export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
export const userSelector = (state) => state.user;
