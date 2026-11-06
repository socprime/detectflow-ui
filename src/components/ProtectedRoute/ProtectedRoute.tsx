import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { UserRole } from '@/enums';
import { routes } from '@/models/router/routes';
import { useAuthStore } from '@/store/auth';
import { SpinnerSquare } from '@socprime/react-ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
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

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to={routes.pipelines} replace />;
  }

  return <>{children}</>;
};
