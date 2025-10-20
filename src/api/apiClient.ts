import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { read, write } from '../utils/cookieStorage';

export const API_BASE_URL = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token from cookie
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = read<string>('accessToken', '');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - try refresh token
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalConfig = err.config as AxiosRequestConfig & { _retry?: boolean };
    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true; // prevent infinite loop
      const refreshToken = read<string>('refreshToken', '');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

          // Save new tokens
          write('accessToken', data.accessToken);
          write('refreshToken', data.refreshToken);

          // Retry original request
          originalConfig.headers = originalConfig.headers || {};
          originalConfig.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return api(originalConfig);
        } catch (refreshErr) {
          console.warn('Refresh token failed', refreshErr);
        }
      }
    }
    return Promise.reject(err);
  }
);
