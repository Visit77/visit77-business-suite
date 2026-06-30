import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { TOKEN_LABEL } from "../variables/constants";

const ProtectedRoute = () => {
  const token = localStorage.getItem(TOKEN_LABEL);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
