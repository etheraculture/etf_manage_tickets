import axios from 'axios';

// In dev (Vite proxy su localhost:5173) usa /api
// In produzione usa direttamente il backend sulla porta 3102
const isDevProxy = window.location.port === '5173';
const baseURL = isDevProxy
  ? '/api'
  : `http://${window.location.hostname}:3102/api`;

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT interceptor — aggiunge token se presente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ethera_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — redirect su 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ethera_admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
