import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// This component takes the page component ('children') as a prop.
function ProtectedRoute({ children }) {
  const { user } = useAuth(); // Get the current user from our AuthContext.

  if (!user) {
    // If there is NO user, redirect them to the login page.
    return <Navigate to="/login" />;
  }

  // If there IS a user, render the child component (the page they wanted to see).
  return children;
}

export default ProtectedRoute;