import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  TOKEN_LABEL,
  API_URL,
  REFRESH_TOKEN_LABEL,
  FCM_TOKEN_LABEL,
  USER_TOKEN_LABEL,
  CHECK_BUSINESS_LABEL,
} from "../variables/constants";
import { decodeToken } from "../utils/utils";
import { decryptData, encryptData } from "../utils/encryptionUtil";
import api from "../api/axiosInstance";
const checkBusiness = JSON.parse(localStorage.getItem(CHECK_BUSINESS_LABEL));

const persistAuthSession = (data) => {
  localStorage.setItem(TOKEN_LABEL, data?.token);
  localStorage.setItem(REFRESH_TOKEN_LABEL, data?.refresh);
  localStorage.setItem(FCM_TOKEN_LABEL, data?.fcm_token);

  const localData = localStorage.getItem(6)
    ? localStorage.getItem(USER_TOKEN_LABEL)
    : [];

  if (localData.length) {
    const users = decryptData(localData);
    const checkUser = users?.find((d) => d.id == data?.id);
    const updateUsers = checkUser
      ? [checkUser, ...users.filter((d) => d.id != data?.id)]
      : [{ ...data }, ...users];
    const encryptedData = encryptData(updateUsers);
    if (encryptedData) {
      localStorage.setItem(USER_TOKEN_LABEL, encryptedData);
    }
  } else {
    const encryptedData = encryptData([data]);
    if (encryptedData) {
      localStorage.setItem(USER_TOKEN_LABEL, encryptedData);
    }
  }
};

const initialState = {
  isPending: false,
  isAuthenticated: false,
  hasError: false,
  credential: {},
  isBusiness: checkBusiness?.is_business,
  buz_id: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}accounts/login/`, {
        ...data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (formData, { rejectWithValue }) => {
    try {
      // Remove the curly braces around formData
      const response = await api.post(`${API_URL}accounts/logout/`, formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

// Create auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState: decodeToken(initialState), // Ensure this function does not mutate state
  reducers: {
    switchBusiness: (state, action) => {
      state.isBusiness = true;
      state.biz_id = action?.payload;
      localStorage.setItem(
        CHECK_BUSINESS_LABEL,
        JSON.stringify({
          is_business: true,
          biz_id: action?.payload,
        }),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        if (payload?.data?.otp_required != true) {
          persistAuthSession(payload?.data);

          return decodeToken(initialState);
        }
      })
      .addCase(login.rejected, (state) => {
        localStorage.removeItem(TOKEN_LABEL);
        state.isPending = false;
        state.isAuthenticated = false;
        state.hasError = true;
        state.credential = {};
      })
      .addCase(logout.pending, (state) => {
        state.isPending = true;
        state.hasError = false;
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        localStorage.removeItem(TOKEN_LABEL);
        localStorage.removeItem(REFRESH_TOKEN_LABEL);
        localStorage.removeItem(FCM_TOKEN_LABEL);
        localStorage.removeItem(CHECK_BUSINESS_LABEL);
        return { ...initialState };
      })
      .addCase(logout.rejected, (state) => {
        state.isPending = false;
        state.isAuthenticated = false;
        state.hasError = true;
        state.credential = {};
      });
  },
});

// Export reducer and actions
export const { switchBusiness } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authSelector = (state) => state.auth;

export default authReducer;
