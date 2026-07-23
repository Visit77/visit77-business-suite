import { message } from "antd";
import {
  BUSINESS_LABEL,
  CHECK_BUSINESS_LABEL,
  FCM_TOKEN_LABEL,
  REFRESH_TOKEN_LABEL,
  TOKEN_LABEL,
} from "../variables/constants";

export const parseApiError = (error) => {
  const data = error?.response?.data;
  const httpStatus = error?.response?.status;
  const statusCode = data?.status_code ?? httpStatus;

  let errors = [];

  if (Array.isArray(data?.error) && data.error.length > 0) {
    errors = data.error.filter(Boolean);
  } else if (data?.message) {
    errors = [data.message];
  } else if (error?.message) {
    errors = [error.message];
  } else {
    errors = ["Something went wrong"];
  }

  return {
    statusCode,
    httpStatus,
    message: errors.join(", "),
    errors,
    raw: data,
  };
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_LABEL);
  localStorage.removeItem(REFRESH_TOKEN_LABEL);
  localStorage.removeItem(FCM_TOKEN_LABEL);
  localStorage.removeItem(BUSINESS_LABEL);
  localStorage.removeItem(CHECK_BUSINESS_LABEL);
};

export const handleUnauthorized = () => {
  clearAuthSession();

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

export const showApiError = (error, options = {}) => {
  const { silent = false } = options;
  const parsed = parseApiError(error);
  const isUnauthorized = parsed.statusCode === 401 || parsed.httpStatus === 401;

  if (isUnauthorized) {
    if (!silent) {
      message.error(parsed.message || "Session expired. Please login again.");
    }
    handleUnauthorized();
    return parsed;
  }

  if (!silent) {
    message.error(parsed.message);
  }

  return parsed;
};
