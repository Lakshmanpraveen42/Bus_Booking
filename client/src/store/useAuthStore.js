import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';
import { generateSessionId } from '../utils/generators';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      sessionId: null,
      loading: false,
      error: null,

      // Initialize: Check if session is valid (called on App load)
      init: async () => {
        const { token, user } = get();
        // Rotate Session ID on every refresh as per requirement
        const newSessionId = generateSessionId();
        
        if (token && user) {
          set({ isAuthenticated: true, sessionId: newSessionId });
        } else {
          set({ sessionId: newSessionId });
        }
      },

      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/login', { email, password });
          
          const { access_token, user } = response.data;
          const sessionId = generateSessionId();
          
          set({ 
            token: access_token, 
            user,
            isAuthenticated: true, 
            sessionId,
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

      adminLogin: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/admin/login', { email, password });
          
          const { access_token, user } = response.data;
          const sessionId = generateSessionId();
          
          set({ 
            token: access_token, 
            user,
            isAuthenticated: true, 
            sessionId,
            loading: false 
          });
          return true;
        } catch (err) {
          set({ 
            error: err.response?.data?.detail || 'Admin login failed', 
            loading: false 
          });
          return false;
        }
      },

      signup: async (userData) => {
        try {
          set({ loading: true, error: null });
          await api.post('/register', userData);
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

      verifyOtp: async (email, code, autoLogin = true) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/verify-otp', { email, otp: code });
          
          if (autoLogin) {
            const { access_token, user } = response.data;
            const sessionId = generateSessionId();
            
            set({ 
              token: access_token, 
              user,
              isAuthenticated: true, 
              sessionId,
              loading: false 
            });
          } else {
            set({ loading: false });
          }
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
        set({ user: null, token: null, isAuthenticated: false, sessionId: null, error: null });
        localStorage.clear(); // Ensure all persistence is wiped
      },
    }),
    {
      name: 'smartbus-auth', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
