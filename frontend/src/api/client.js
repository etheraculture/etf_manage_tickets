import axios from 'axios';

// Utilizza sempre il proxy relativo '/api'
// Funzionerà perfettamente su HTTPS (ticket.etheraculture.com/api) grazie al proxy di Vite preview/Nginx
const baseURL = '/api';

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
