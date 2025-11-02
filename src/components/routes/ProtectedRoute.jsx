import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check for authentication token in localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, render child routes
  return <Outlet />;
};

export default ProtectedRoute;