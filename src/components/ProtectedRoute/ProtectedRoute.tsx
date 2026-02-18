import { routes } from '@/models/router/routes';
import { useAuthStore } from '@/store/auth';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SpinnerSquare } from '../Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading, mustChangePassword } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <SpinnerSquare />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  if (mustChangePassword && location.pathname !== routes.changePassword) {
    return <Navigate to={routes.changePassword} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.warn(`Access denied: required role "${requiredRole}", user has "${user.role}"`);
    return <Navigate to={routes.login} replace />;
  }

  return <>{children}</>;
};
