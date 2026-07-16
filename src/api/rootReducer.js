import { combineReducers } from "redux";
import authReducer from "../service/authSlice.jsx";
import roomOccupantReducer from "../service/roomOccupantSlice.jsx";
import roomStandardReducer from "../service/roomStandardSlice.jsx";
import roomViewReducer from "../service/roomViewSlice.jsx";
import roomTypeReducer from "../service/roomTypeSlice.jsx";
import roomFacilityReducer from "../service/roomFacilitySlice.jsx";
import roomAmenityReducer from "../service/roomAmenitySlice.jsx";
import userReducer from "../service/userSlice.jsx";
import businessReducer from "../service/businessSlice.jsx";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  business: businessReducer,
  roomOccupant: roomOccupantReducer,
  roomView: roomViewReducer,
  roomStandard: roomStandardReducer,
  roomType: roomTypeReducer,
  roomFacility: roomFacilityReducer,
  roomAmenity: roomAmenityReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
