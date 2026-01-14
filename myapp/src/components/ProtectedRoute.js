import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  // Check if user is logged in by looking at localStorage
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // If user and token exist, render the protected component
  if (user && token) {
    return element;
  }

  // Otherwise redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
