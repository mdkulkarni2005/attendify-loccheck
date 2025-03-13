
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { useAuth } from '@/hooks/use-auth';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const { isLoaded, isSignedIn, userRole } = useAuth();

  // Show loading state while checking auth
  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If not signed in, redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has an allowed role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default RouteGuard;
