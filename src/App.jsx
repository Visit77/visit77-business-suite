import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* <Route path="/rooms" element={<RoomManagement />} /> */}
            {/* <Route path="/bookings" element={<Bookings />} /> */}
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
