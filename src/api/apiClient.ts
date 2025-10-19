import axios from 'axios';
import { read, write } from '../utils/cookieStorage';

export const API_BASE_URL = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token from cookie
api.interceptors.request.use(config => {
  const token = read('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - try refresh token
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refreshToken = read('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          write('accessToken', data.accessToken);
          write('refreshToken', data.refreshToken);

          // Retry original request
          if (err.config.headers) {
            err.config.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          return api(err.config);
        } catch (refreshErr) {
          console.warn('Refresh token failed', refreshErr);
        }
      }
    }
    return Promise.reject(err);
  }
);
