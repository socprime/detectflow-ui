import { routes } from '@/models/router/routes';
import { useAuthStore } from '@/store/auth';
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SpinnerSquare } from '../Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading, mustChangePassword, isInitialized, ensureInitialized } =
    useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      void ensureInitialized();
    }
  }, [isInitialized, ensureInitialized]);

  if (loading || !isInitialized) {
    return <SpinnerSquare />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  if (mustChangePassword && location.pathname !== routes.changePassword) {
    return <Navigate to={routes.changePassword} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return <>{children}</>;
};
