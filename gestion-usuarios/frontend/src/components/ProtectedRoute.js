import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0f172a'
      }}>
        <div style={{ 
          color: '#3b82f6', 
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          Cargando...
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;