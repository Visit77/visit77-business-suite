import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessGate from "./components/BusinessGate";
import PageLoading from "./components/PageLoading";
import Login from "./page/Login";
import AdminLayout from "./components/AdminLayout";
import OtpVerification from "./page/OtpVerification";
import SelectBusiness from "./page/SelectBusiness";
import RoomBoard from "./page/RoomBoard";
import RoomManagmentPage from "./page/RoomManagmentPage";
import CheckIn from "./page/CheckIn";
import { useDispatch, useSelector } from "react-redux";
import {
  getLanguageSetting,
  languageSettingSelector,
} from "./service/languageSettingSlice";
import { useLanguage } from "./context/LanguageContext";
import { getLanguage } from "./service/languageSlice";
import ScrollToTop from "./components/ScrollToTop";
import Reserved from "./page/Reserved";
import HotelFacility from "./page/HotelFacility";

const Dashboard = lazy(() => import("./page/Dashboard"));
const Room = lazy(() => import("./page/Room"));
const RoomDetail = lazy(() => import("./page/RoomDetail"));
const CreateRoomType = lazy(() => import("./page/CreateRoomType"));
const EditRoom = lazy(() => import("./page/EditRoom"));
const RoomBookingList = lazy(() => import("./page/RoomBookingList"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLanguage({ is_active: "true" }));
    dispatch(getLanguageSetting());
  }, [dispatch]);

  const { data: languageSettings } = useSelector(languageSettingSelector);
  const { language } = useLanguage();

  String.prototype.toMultiLan = function () {
    let lan = this.toString();
    const setting = languageSettings?.find(
      (value) => value.key === lan && value.language.lang_code === language,
    );

    return setting?.value || lan;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoading message="Loading page..." />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-otp" element={<OtpVerification />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/select-business" element={<SelectBusiness />} />
            <Route element={<BusinessGate />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/hotel-facility" element={<HotelFacility />} />
                <Route path="/rooms" element={<Room />} />
                <Route path="/room-create/" element={<CreateRoomType />} />
                <Route path="/rooms/edit/:id" element={<EditRoom />} />
                <Route path="/rooms/:id" element={<RoomDetail />} />
                <Route
                  path="/rooms/:id/history"
                  element={<RoomBookingList />}
                />
                <Route path="/rooms-board" element={<RoomBoard />} />
                <Route
                  path="/room-details/:id"
                  element={<RoomManagmentPage />}
                />
                <Route path="/room/:id/check-in/" element={<CheckIn />} />
                <Route path="/room/:id/reserve/" element={<Reserved />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
