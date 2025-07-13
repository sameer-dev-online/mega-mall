// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api', // set in .env
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if you're using cookies for auth
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if this is an admin request
    const isAdminRequest = config.url?.includes('/admin');

    // Get appropriate token based on request type
    const token = isAdminRequest
      ? localStorage.getItem('admin_token')
      : localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Check if this was an admin request
      const isAdminRequest = error.config?.url?.includes('/admin');

      if (isAdminRequest) {
        // Handle admin unauthorized access
        localStorage.removeItem('admin_token');
        window.location.href = '/admin';
      } else {
        // Handle user unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
