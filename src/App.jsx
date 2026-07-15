import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./page/Login";
import AdminLayout from "./components/AdminLayout";

const Dashboard = lazy(() => import("./page/Dashboard"));
const Room = lazy(() => import("./page/Room"));
const RoomDetail = lazy(() => import("./page/RoomDetail"));
const AddRoom = lazy(() => import("./page/AddRoom"));
const EditRoom = lazy(() => import("./page/EditRoom"));
const RoomBookingList = lazy(() => import("./page/RoomBookingList"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background font-sans text-sm font-medium text-on-surface-variant">
            <div className="animate-pulse">Loading components...</div>
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rooms" element={<Room />} />
              <Route path="/rooms/add" element={<AddRoom />} />
              <Route path="/rooms/edit/:id" element={<EditRoom />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              <Route path="/rooms/:id/history" element={<RoomBookingList />} />
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
