import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,

  // Initialize: Check if token is valid and get user profile
  init: async () => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/auth/login', `username=${email}&password=${password}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const { access_token, user } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ 
        token: access_token, 
        user,
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.detail || 'Login failed', 
        loading: false 
      });
      return false;
    }
  },

  signup: async (userData) => {
    try {
      set({ loading: true, error: null });
      await api.post('/auth/register', userData);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.detail || 'Registration failed', 
        loading: false 
      });
      return false;
    }
  },

  verifyOtp: async (email, code) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/auth/verify-otp', { email, code });
      const { access_token, user } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ 
        token: access_token, 
        user,
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.detail || 'Verification failed', 
        loading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
