import * as authService from '../services/authService.js';
import {
  verifyRefreshToken,
  generateAccessToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/jwt.js';
import { sendSuccess } from '../utils/response.js';
import AppError from '../utils/AppError.js';

// ─── POST /auth/register ─────────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return sendSuccess(res, {
      status: 201,
      message: 'Đăng ký thành công',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/login ────────────────────────────────────────────────────────

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(
      req.body,
    );

    // Gắn refresh token vào HttpOnly cookie — FE không cần đọc trực tiếp
    setRefreshTokenCookie(res, refreshToken);

    return sendSuccess(res, {
      message: 'Đăng nhập thành công',
      data: { accessToken, user },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/logout ───────────────────────────────────────────────────────

export const logout = (_req, res, next) => {
  try {
    clearRefreshTokenCookie(res);
    return sendSuccess(res, { message: 'Đăng xuất thành công' });
  } catch (err) {
    next(err);
  }
};

// ─── GET /auth/me ────────────────────────────────────────────────────────────

export const getMe = async (req, res, next) => {
  try {
    // req.user được gắn bởi verifyToken middleware
    const user = await authService.getMe(req.user.user_id);
    return sendSuccess(res, { data: user });
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/refresh ──────────────────────────────────────────────────────

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new AppError('Phiên đăng nhập đã hết hạn', 401, 'TOKEN_EXPIRED');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        throw new AppError('Phiên đăng nhập đã hết hạn', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError('Token không hợp lệ', 401, 'TOKEN_INVALID');
    }

    // ✅ Lấy role mới nhất từ DB — tránh dùng role cũ có thể đã thay đổi
    const user = await authService.getMe(decoded.user_id);
    if (!user) {
      throw new AppError('User không tồn tại', 401, 'UNAUTHORIZED');
    }

    const accessToken = generateAccessToken({
      user_id: user.user_id,
      role: user.role, // ✅
    });

    return sendSuccess(res, { data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

// ─── POST /auth/change-password ──────────────────────────────────────────────

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.user_id, req.body);

    // Xóa refresh token cookie — buộc user đăng nhập lại sau khi đổi mật khẩu
    clearRefreshTokenCookie(res);

    return sendSuccess(res, { message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /auth/me/profile ───────────────────────────────────────────────────

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.user_id, req.body);
    return sendSuccess(res, {
      message: 'Cập nhật thông tin thành công',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
