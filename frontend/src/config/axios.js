import axios from 'axios';
import { STORAGE_KEYS } from '@/constants';

// ─── Axios Instance ───────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // 1. Check if the error is a 401
    // 2. IMPORTANT: Check if the request was NOT for login or refresh
    const isAuthRequest =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        // Use a clean axios instance (or the global one) to avoid the interceptor loop
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );

        const { accessToken } = response.data.data;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

        // Update the instance header for future requests
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (typeof window !== 'undefined') {
          // Only redirect if we aren't already on the login page
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Standard error normalization
    const message =
      error.response?.data?.message || error.message || 'Đã xảy ra lỗi';
    return Promise.reject({ ...error, message });
  },
);

export default axiosInstance;
