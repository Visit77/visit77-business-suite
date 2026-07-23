import axios from "axios";
import { API_URL, TOKEN_LABEL } from "../variables/constants";
import { showApiError } from "../utils/apiErrorHandler";

const api = axios.create({
  baseURL: `${API_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_LABEL);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error?.config?.skipGlobalErrorHandler) {
      showApiError(error);
    }

    return Promise.reject(error);
  },
);

export default api;
