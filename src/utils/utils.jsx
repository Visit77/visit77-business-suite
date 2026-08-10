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

export const getRoomCardStyle = (status) => {
  switch (status) {
    case "available":
      return "bg-green-400/40 border-green-400";
    case "occupied":
      return "bg-blue-600/40 border-blue-600";
    case "reserved":
      return "bg-[#FB923C]/40 border-[#FB923C]";
    case "cleaning":
      return "bg-[#7C3AED]/40 border-[#7C3AED]";
    case "out_of_service":
      return "bg-slate-500/40 border-slate-500";
    default:
      return "bg-green-200/40 border-green-200";
  }
};

export const getRoomBorderStyle = (status) => {
  switch (status) {
    case "available":
      return " border-green-400";
    case "occupied":
      return " border-blue-600";
    case "reserved":
      return "order-[#FB923C]";
    case "cleaning":
      return "border-[#7C3AED]";
    case "out_of_service":
      return " border-slate-500";
    default:
      return " border-green-200";
  }
};

export const getDotColor = (status) => {
  switch (status) {
    case "available":
      return "bg-green-400 border-green-400";
    case "occupied":
      return "bg-blue-600 border-blue-600";
    case "reserved":
      return "bg-[#FB923C] border-[#FB923C]";
    case "cleaning":
      return "bg-[#7C3AED] border-[#7C3AED]";
    case "out_of_service":
      return "bg-slate-500 border-slate-500";
    default:
      return "bg-green-200 border-green-200";
  }
};
