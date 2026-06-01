import jwt from 'jsonwebtoken';
import env from '../config/env.js';

// ─── Secrets & config — lấy từ env.js (nguồn duy nhất) ──────────────────────
const ACCESS_SECRET =
  env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
const REFRESH_SECRET =
  env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
// Fallback sane: 15m access, 7d refresh — phải khớp với env.js defaults
const ACCESS_EXPIRES_IN = env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN || '7d';
const NODE_ENV = env.nodeEnv || 'development';

/** Thời gian sống cookie refresh token — phải >= REFRESH_EXPIRES_IN */
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 ngày (ms)

// ─── Token generators ────────────────────────────────────────────────────────
/**
 * Tạo access token ngắn hạn.
 * Payload: { user_id, role }
 * @param {{ user_id: number, role: string }} payload
 * @returns {string}
 */
export const generateAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

/**
 * Tạo refresh token dài hạn.
 * Payload: { user_id }
 * @param {{ user_id: number }} payload
 * @returns {string}
 */
export const generateRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

// ─── Token verifiers ─────────────────────────────────────────────────────────

/**
 * Xác minh access token — throws nếu hết hạn hoặc không hợp lệ.
 * @param {string} token
 * @returns {jwt.JwtPayload}
 * @throws {jwt.TokenExpiredError | jwt.JsonWebTokenError}
 */
export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

/**
 * Xác minh refresh token — throws nếu hết hạn hoặc không hợp lệ.
 * @param {string} token
 * @returns {jwt.JwtPayload}
 * @throws {jwt.TokenExpiredError | jwt.JsonWebTokenError}
 */
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

// ─── Cookie helpers ───────────────────────────────────────────────────────────

/**
 * Gắn refresh token vào HttpOnly cookie trên response.
 * @param {import('express').Response} res
 * @param {string} token
 */
export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
};

/**
 * Xóa refresh token cookie (dùng khi logout hoặc đổi mật khẩu).
 * @param {import('express').Response} res
 */
export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'Strict',
  });
};
