import axios from "axios";
import { API_URL, TOKEN_LABEL } from "../variables/constants";

const api = axios.create({
  baseURL: `${API_URL}`, // မိမိ Backend API URL ကိုထည့်ပါ
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (ဥပမာ - LocalStorage က Token ကို Header မှာ အလိုအလျောက် ထည့်ပေးဖို့)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_LABEL);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor (ဥပမာ - 401 ဖြစ်ရင် Logout ချပစ်တာမျိုး လုပ်ဖို့)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle Logout Logic Here (e.g., clear storage, redirect)
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  },
);

export default api;
