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
import hotelBuildingReducer from "../service/buildingSlice.jsx";
import languageSettingReducer from "../service/languageSettingSlice.jsx";
import languageReducer from "../service/languageSlice.jsx";
import actionReducer from "../service/actionSlice.jsx";
import roomReducer from "../service/roomSlice.jsx";
import facilityReducer from "../service/facilitySlice.jsx";
import roomBuildTypesReducer from "../service/roomBuildTypesSlice.jsx";
import bathTypeReducer from "../service/bathTypeSlice.jsx";
import bedTypeReducer from "../service/bedTypeSlice.jsx";
import roomPoliciesReducer from "../service/roomPoliciesSlice.jsx";
import mealPlanReducer from "../service/mealPlanSlice.jsx";
import physicalRoomReducer from "../service/physicalRoomSlice.jsx";
import otaRevenueReducer from "../service/otaRevenueSlice.jsx";
import otaManagementReducer from "../service/otaManagementSlice.jsx";

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
  hotelBuilding: hotelBuildingReducer,
  languageSetting: languageSettingReducer,
  language: languageReducer,
  action: actionReducer,
  room: roomReducer,
  facility: facilityReducer,
  roomBuildTypes: roomBuildTypesReducer,
  bathTypes: bathTypeReducer,
  bedTypes: bedTypeReducer,
  roomPolicies: roomPoliciesReducer,
  mealPlan: mealPlanReducer,
  physicalRoom: physicalRoomReducer,
  otaRevenue: otaRevenueReducer,
  otaManagement: otaManagementReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
