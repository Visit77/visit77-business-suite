import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessGate from "./components/BusinessGate";
import PageLoading from "./components/PageLoading";
import Login from "./page/Login";
import AdminLayout from "./components/AdminLayout";
import OtpVerification from "./page/OtpVerification";
import SelectBusiness from "./page/SelectBusiness";
import RoomBoard from "./page/RoomBoard";

const Dashboard = lazy(() => import("./page/Dashboard"));
const Room = lazy(() => import("./page/Room"));
const RoomDetail = lazy(() => import("./page/RoomDetail"));
const AddRoom = lazy(() => import("./page/AddRoom"));
const EditRoom = lazy(() => import("./page/EditRoom"));
const RoomBookingList = lazy(() => import("./page/RoomBookingList"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading message="Loading page..." />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-otp" element={<OtpVerification />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/select-business" element={<SelectBusiness />} />
            <Route element={<BusinessGate />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/rooms" element={<Room />} />
                <Route path="/rooms/add" element={<AddRoom />} />
                <Route path="/rooms/edit/:id" element={<EditRoom />} />
                <Route path="/rooms/:id" element={<RoomDetail />} />
                <Route
                  path="/rooms/:id/history"
                  element={<RoomBookingList />}
                />
                <Route path="/rooms-board" element={<RoomBoard />} />
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
