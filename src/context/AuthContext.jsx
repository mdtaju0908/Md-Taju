import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("Failed to parse userInfo:", error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const verifyOtpLogin = async (email, otp) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp }, { timeout: 15000 });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'OTP Verification failed' 
      };
    }
  };

  const startAdminLogin = async (email, password) => {
    try {
      await api.post('/auth/login-start', { email, password }, { timeout: 15000 });
      return { success: true };
    } catch (error) {
      console.error("Login initiation error:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login initiation failed'
      };
    }
  };

  const loginWithToken = async (token) => {
    try {
      const { data } = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fullUser = { ...data, token };
      setUser(fullUser);
      localStorage.setItem('userInfo', JSON.stringify(fullUser));
      return { success: true, user: fullUser };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'External login failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyOtpLogin, startAdminLogin, loginWithToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
