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
import roomBoardReducer from "../service/roomBoardSlice.jsx";
import buildingReducer from "../service/buildingSlice.jsx";
import languageSettingReducer from "../service/languageSettingSlice.jsx";
import languageReducer from "../service/languageSlice.jsx";
import actionReducer from "../service/actionSlice.jsx";
import roomReducer from "../service/roomSlice.jsx";
import facilityReducer from "../service/facilitySlice.jsx";

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
  roomBoard: roomBoardReducer,
  building: buildingReducer,
  languageSetting: languageSettingReducer,
  language: languageReducer,
  action: actionReducer,
  room: roomReducer,
  facility: facilityReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
