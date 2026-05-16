import jwt from 'jsonwebtoken';

// ─── Secrets & config — đọc thẳng từ process.env với fallback rõ ràng ────────
const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const NODE_ENV = process.env.NODE_ENV || 'development';

/** Thời gian sống cookie refresh token: 7 ngày tính bằng ms */
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

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
