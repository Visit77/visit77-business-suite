import { combineReducers } from "redux";
import authReducer from "../service/authSlice.jsx";

const appReducer = combineReducers({
  auth: authReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
