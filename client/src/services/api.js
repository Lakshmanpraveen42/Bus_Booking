import axios from 'axios';

/**
 * Standardized Axios Instance
 * Base URL is dynamically pulled from environment variables.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for Auth & Identity
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Inject User ID into every request header for backend tracking
  if (userStr && userStr !== 'undefined') {
    try {
      const user = JSON.parse(userStr);
      if (user?.id) {
        config.headers['X-User-ID'] = user.id;
      }
    } catch (e) {
      console.error("Identity injection failed", e);
    }
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is not available
    if (!error.response && error.code === 'ERR_NETWORK') {
      console.warn("Backend Unreachable: Using frontend mock fallback");
    }
    return Promise.reject(error);
  }
);

export default api;
