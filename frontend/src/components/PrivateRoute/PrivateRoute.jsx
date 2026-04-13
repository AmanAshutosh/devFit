import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  // PageLoader in App.jsx covers the auth loading state — no separate spinner needed
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
