/**
 * 404 Not Found handler.
 * Đăng ký SAU tất cả routes, TRƯỚC errorHandler trong app.js.
 * Khi không có route nào khớp, middleware này tạo AppError 404
 * và chuyển cho errorHandler xử lý.
 */

import AppError from '../utils/AppError.js';

const notFound = (req, res, next) => {
  next(
    new AppError(
      `Không tìm thấy: ${req.method} ${req.originalUrl}`,
      404,
      'ROUTE_NOT_FOUND',
    ),
  );
};

export { notFound }; // Named export to match your destructuring import
