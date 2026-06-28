import axios from 'axios';
import { getToken, setToken, clearToken } from './tokenStore';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

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
        setToken(res.data.token);

        originalConfig.headers.Authorization = `Bearer ${res.data.token}`;
        return api(originalConfig);
      } catch (refreshErr) {
        clearToken();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
export { setToken, clearToken };
