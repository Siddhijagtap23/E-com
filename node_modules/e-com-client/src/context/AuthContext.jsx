import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { user: userData, token: tokenData } = response.data;
      setUser(userData);
      setToken(tokenData);
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      showToast(msg, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/register', { name, email, password });
      const { user: userData, token: tokenData } = response.data;
      setUser(userData);
      setToken(tokenData);
      showToast('Account created successfully!', 'success');
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
