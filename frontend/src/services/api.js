import axiosInstance from '@/config/axios';

// ─── Base API Helper ──────────────────────────────────────────────────────────
// Thin wrappers so services don't import axios directly.
// axiosInstance interceptors already unwrap `response.data`.

export const api = {
  get: (url, params = {}, config = {}) =>
    axiosInstance.get(url, { params, ...config }),

  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),

  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),

  patch: (url, data = {}, config = {}) =>
    axiosInstance.patch(url, data, config),

  delete: (url, config = {}) => axiosInstance.delete(url, config),
};
