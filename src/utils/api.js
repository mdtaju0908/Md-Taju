import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
  url = url.replace(/\/$/, ''); // Remove trailing slash if present
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true
});

// Debug API Connection
console.log('🔌 API Base URL:', api.defaults.baseURL);

export const unwrapList = (response, preferredKey) => {
  const d = response && response.data;
  if (Array.isArray(d)) return d;
  const obj = d && typeof d === 'object' ? d : {};
  const keys = [
    preferredKey,
    'data',
    'items',
    'list',
    'results',
    'experiences',
    'education',
    'certifications',
    'projects',
    'skills',
    'gallery'
  ].filter(Boolean);
  for (const k of keys) {
    const v = obj[k];
    if (Array.isArray(v)) return v;
  }
  return [];
};

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        if (parsedUser && parsedUser.token) {
          config.headers.Authorization = `Bearer ${parsedUser.token}`;
        }
      } catch (error) {
        console.error("Error parsing userInfo in api interceptor:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('userInfo');
      // Only redirect if not already on login page to avoid loops
      if (!window.location.pathname.includes('/login')) {
         window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
