import axios from 'axios';

// Ensure you have frontend/.env.local set up with: VITE_API_BASE_URL=http://localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const api = axios.create({ baseURL: BASE_URL });

// Interceptor to inject the token before sending the request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    // Set Authorization header for all protected routes
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication methods (no token required)
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// API calls that require a token will use the default 'api' instance
export default api;