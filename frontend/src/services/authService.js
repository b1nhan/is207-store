import { api } from './api';
import { API_ENDPOINTS } from '@/constants/api';

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  // Đăng ký tài khoản mới
  register: (data) => api.post(API_ENDPOINTS.AUTH.REGISTER, data),

  // Đăng nhập
  login: (data) => api.post(API_ENDPOINTS.AUTH.LOGIN, data),

  // Làm mới access token
  refresh: (data = {}) => api.post(API_ENDPOINTS.AUTH.REFRESH, data),

  // Đăng xuất
  logout: (data = {}) => api.post(API_ENDPOINTS.AUTH.LOGOUT, data),

  // Lấy thông tin user hiện tại
  getMe: (params = {}) => api.get(API_ENDPOINTS.AUTH.ME, params),

  // Đổi mật khẩu
  changePassword: (data) => api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
};

export default authService;
