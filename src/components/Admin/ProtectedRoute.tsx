import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Verificar autenticación
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem('admin_token');
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  if (!isAuthenticated()) {
    // Redirigir al login con la ubicación actual para volver después del login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;