import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import the Material UI components
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  // First, handle the loading state while we wait for the user data
  if (isLoading) {
    // Display a centered loading spinner using MUI components
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // After loading, if there is no user, they are not authenticated
  if (!user) {
    // Redirect them to the login page
    return <Navigate to="/login" replace />;
  }
  
  // If a specific role is required and the user's role does not match
  if (requiredRole && user.role !== requiredRole) {
    // Redirect them to a safe, non-admin page.
    // In the admin app, redirecting to the main dashboard is a good default.
    console.warn(`Access denied. User role: ${user.role}, Required role: ${requiredRole}`);
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // If all checks pass, render the actual page component
  return children;
};

export default ProtectedRoute;