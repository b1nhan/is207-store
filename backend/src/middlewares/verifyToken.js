import { verifyAccessToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

/**
 * Middleware xác thực JWT access token từ Authorization header.
 *
 * Khi hợp lệ  → gắn req.user = { user_id, role } rồi gọi next().
 * Khi lỗi     → throw AppError để errorHandler bắt và format response.
 *
 * Header yêu cầu: Authorization: Bearer <accessToken>
 */
const verifyToken = (req, _res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(
        'Chưa xác thực — thiếu Authorization header',
        401,
        'UNAUTHORIZED',
      );
    }

    const token = authHeader.split(' ')[1];

    // verifyAccessToken throws TokenExpiredError | JsonWebTokenError nếu lỗi
    const decoded = verifyAccessToken(token);

    req.user = { user_id: decoded.user_id, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('accessToken đã hết hạn', 401, 'TOKEN_EXPIRED'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Token không hợp lệ', 401, 'TOKEN_INVALID'));
    }
    // AppError throw từ trên, hoặc lỗi không mong đợi
    next(err);
  }
};

export default verifyToken;
