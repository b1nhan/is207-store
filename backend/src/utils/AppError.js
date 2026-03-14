/**
 * Custom error class dùng để throw lỗi có kiểm soát trong toàn bộ ứng dụng.
 * errorHandler middleware sẽ bắt các instance của class này và format
 * thành response chuẩn { success, message, errorCode, errors }.
 *
 * Cách dùng:
 *   throw new AppError("Không tìm thấy sản phẩm", 404, "PRODUCT_NOT_FOUND");
 *   throw new AppError("Dữ liệu không hợp lệ", 422, "VALIDATION_ERROR", errorsArray);
 */
export default class AppError extends Error {
  /**
   * @param {string} message     - Thông báo lỗi hiển thị lên UI
   * @param {number} statusCode  - HTTP status code (400, 401, 403, 404, 422, 500,...)
   * @param {string} errorCode   - Hằng số định danh lỗi (xem src/constants/errorCode.js)
   * @param {Array}  errors      - Danh sách lỗi chi tiết (dùng cho validation errors)
   */
  constructor(
    message,
    statusCode = 500,
    errorCode = 'INTERNAL_ERROR',
    errors = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;

    // Đảm bảo instanceof hoạt động đúng khi extend Error
    Object.setPrototypeOf(this, new.target.prototype);

    // Loại bỏ constructor khỏi stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
