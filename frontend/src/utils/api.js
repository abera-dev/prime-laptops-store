import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Needed to send HTTP-only refresh token cookie
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — auto-refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    // If 401 and not already retrying, and not the auth endpoints
    if (
      err.response?.status === 401 &&
      !originalConfig._retry &&
      originalConfig.url !== '/auth/login' &&
      originalConfig.url !== '/auth/refresh' &&
      originalConfig.url !== '/auth/register'
    ) {
      originalConfig._retry = true;

      try {
        const res = await api.post('/auth/refresh');
        const { token } = res.data;
        
        localStorage.setItem('token', token);
        originalConfig.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request with the new token
        return api(originalConfig);
      } catch (refreshErr) {
        // Refresh token is expired or revoked
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
    
    return Promise.reject(err);
  }
);

export default api;
