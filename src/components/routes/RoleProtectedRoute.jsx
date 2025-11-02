
// RoleProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/authUtils";
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = getUserRole();
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/*" replace />;
  }
  return children;
};
export default RoleProtectedRoute;
