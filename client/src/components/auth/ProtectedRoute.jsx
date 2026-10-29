import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Route guard that redirects unauthenticated users to /login.
 * @param {{ children: React.ReactNode }} props
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  /* If there's a token but auth hasn't been verified yet, show a spinner briefly */
  if (token && !isAuthenticated) {
    return <LoadingSpinner fullPage text="Verifying authentication…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
