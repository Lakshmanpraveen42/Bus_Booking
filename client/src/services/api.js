import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Production-grade Logging
    console.group(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
    if (config.data) {
        const logData = typeof config.data === 'string' ? Object.fromEntries(new URLSearchParams(config.data)) : { ...config.data };
        if (logData.password) logData.password = '********';
        console.log('Payload:', logData);
    }
    console.groupEnd();

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.group(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('Result:', response.data);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group(`❌ API Error: ${error.response?.status || 'Network Error'} ${error.config?.url}`);
    console.error('Details:', error.response?.data || error.message);
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default api;
