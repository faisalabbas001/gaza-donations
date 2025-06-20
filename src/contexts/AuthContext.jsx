import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    user: null,
    token: null
  });

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role');

    if (token && user && role) {
      setAuth({
        isAuthenticated: true,
        role,
        user,
        token
      });
    }
  }, []);

  const login = (userData, role, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', role);

    setAuth({
      isAuthenticated: true,
      role,
      user: userData,
      token
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    setAuth({
      isAuthenticated: false,
      role: null,
      user: null,
      token: null
    });
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const { data } = await axios.get('https://gazabackend-production.up.railway.app/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        const userData = data.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth(prev => ({
          ...prev,
          user: userData,
          role: userData.role
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle token expiration
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchUserProfile();
    }
  }, [auth.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);