import AppError from '../utils/AppError.js';
import { sendError } from '../utils/response.js';

/**
 * Global error handler middleware.
 * Phải được đăng ký CUỐI CÙNG trong app.js (sau tất cả routes và notFound).
 *
 * Xử lý 2 loại lỗi:
 *   1. AppError (lỗi có kiểm soát): dùng statusCode, errorCode, errors từ instance
 *   2. Error thường (lỗi không mong đợi): trả về 500 INTERNAL_ERROR
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log lỗi ra console (sau này có thể thay bằng logger.js)
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);

  if (err instanceof AppError) {
    return sendError(res, {
      message: err.message,
      status: err.statusCode,
      errorCode: err.errorCode,
      errors: err.errors,
    });
  }

  // ─── Lỗi không mong đợi ───────────────────────────────────────────────────
  // Không expose chi tiết lỗi ra ngoài ở production
  return sendError(res, {
    message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    status: 500,
    errorCode: 'INTERNAL_ERROR',
  });
};

export { errorHandler };
