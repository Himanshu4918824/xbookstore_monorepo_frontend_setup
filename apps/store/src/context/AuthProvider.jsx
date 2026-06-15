import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { loginUser } from '../api/authService';
import api from '../api/axiosConfig';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user. Token might be invalid.", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // --- THIS IS THE FIX ---
      // We set the header to "Token" to match your backend's TokenAuthentication
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      // --- END OF FIX ---
      fetchUser();
    }
  }, [fetchUser]);

  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);
    // With TokenAuthentication, dj-rest-auth returns the token under the name 'key'
    const { key } = response.data;

    localStorage.setItem('authToken', key);

    // --- THIS IS THE FIX ---
    // We set the header to "Token" to match your backend's TokenAuthentication
    api.defaults.headers.common['Authorization'] = `Token ${key}`;
    // --- END OF FIX ---
    
    await fetchUser();
    navigate('/');
  }, [fetchUser, navigate]);
  
  const userWithFirstName = useMemo(() => 
    user ? { ...user, firstName: user.first_name, lastName: user.last_name } : null
  , [user]);
  
  const value = useMemo(() => ({
    user: userWithFirstName,
    login,
    logout,
    isAuthenticated: !!user
  }), [userWithFirstName, login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}