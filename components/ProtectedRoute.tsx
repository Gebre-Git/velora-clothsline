import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ isAdmin: boolean; children: React.ReactNode }> = ({ isAdmin, children }) => {
  const token = localStorage.getItem('velora_admin_token');
  const email = localStorage.getItem('velora_admin_email');

  // Double check both state and local storage
  // If we have a token in storage, we consider them potentially authorized 
  // until the parent App component validates it and updates isAdmin state.
  // However, if there is NO token in storage, we definitely redirect.
  const hasToken = !!token && !!email;

  console.log('ProtectedRoute Check:', { isAdmin, hasToken, path: window.location.hash });

  // If not admin AND no token to restore session from, redirect
  if (!isAdmin && !hasToken) {
    console.warn('Access denied: Redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
