import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('devfit_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  // Start as false if we already have a valid token + cached user so the
  // app renders immediately with cached data and refreshes in the background.
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('devfit_token');
    if (!token) return false;
    const stored = localStorage.getItem('devfit_user');
    return !stored; // only show spinner if token exists but cache is empty
  });

  // Silently verify / refresh the token on mount.
  // When cached data already exists this runs in the background – no blocking.
  useEffect(() => {
    const token = localStorage.getItem('devfit_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/user/profile')
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem('devfit_user', JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem('devfit_token');
        localStorage.removeItem('devfit_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('devfit_token', token);
    localStorage.setItem('devfit_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('devfit_token');
    localStorage.removeItem('devfit_user');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/user/profile');
      setUser(data);
      localStorage.setItem('devfit_user', JSON.stringify(data));
      return data;
    } catch (e) {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
