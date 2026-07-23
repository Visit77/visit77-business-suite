import _ from "lodash";
import { API_URL, TOKEN_LABEL, WEB_URL } from "../variables/constants";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosInstance";

export const decodeToken = (initialState) => {
  const jwt = localStorage.getItem(TOKEN_LABEL);

  if (jwt) {
    const { user_id, phone, email, is_staff, is_superuser, login_type } =
      jwtDecode(jwt);

    return {
      ...initialState,
      isPending: false,
      hasError: false,
      user: { user_id, phone, email, is_staff, is_superuser, login_type },
      // isAuthenticated: moment().isBefore(credential.expiredDate),
      isAuthenticated: true,
    };
  }
  return initialState;
};

// Encoding
export const base64UrlEncode = (str) => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Decoding
export const base64UrlDecode = (str) => {
  let base64 = str?.replace(/-/g, "+").replace(/_/g, "/");
  while (base64?.length % 4) {
    base64 += "=";
  }
  return atob(base64);
};
