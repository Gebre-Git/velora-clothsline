import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ isAdmin: boolean; children: React.ReactNode }> = ({ isAdmin, children }) => {
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
