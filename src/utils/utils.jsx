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
