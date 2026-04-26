import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../types/index';
import { getStoredUser } from '../utils/auth';

type RoleRouteProps = {
  children: ReactNode;
  requiredRole?: UserRole;
};

const RoleRoute = ({ children, requiredRole }: RoleRouteProps) => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user && user.role !== requiredRole) {
    return <Navigate to="/tasks" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
