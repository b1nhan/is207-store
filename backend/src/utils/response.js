/**
 * Helper chuẩn hóa response trả về cho client.
 *
 * Response thành công:
 * {
 *   "success": true,
 *   "message": "Mô tả ngắn (optional)",
 *   "data": {}
 * }
 *
 * Response thất bại:
 * {
 *   "success": false,
 *   "message": "Mô tả lỗi hiển thị được lên UI",
 *   "errorCode": "ERROR_CODE_CONSTANT",
 *   "errors": []
 * }
 */

/**
 * Trả về response thành công.
 *
 * @param {import("express").Response} res
 * @param {object}  payload
 * @param {*}       payload.data        - Dữ liệu trả về
 * @param {string}  [payload.messa0.......
 * .ge]   - Thông báo ngắn (optional)
 * @param {number}  [payload.status]    - HTTP status code (default: 200)
 *
 * @example
 * sendSuccess(res, { data: products, message: "Lấy danh sách sản phẩm thành công" });
 * sendSuccess(res, { data: newProduct, status: 201, message: "Tạo sản phẩm thành công" });
 */
export const sendSuccess = (
  res,
  { data = null, message = '', status = 200 } = {},
) => {
  const body = { success: true };
  if (message) body.message = message;
  body.data = data;
  return res.status(status).json(body);
};

/**
 * Trả về response thất bại.
 *
 * @param {import("express").Response} res
 * @param {object}  payload
 * @param {string}  payload.message     - Thông báo lỗi hiển thị lên UI
 * @param {number}  [payload.status]    - HTTP status code (default: 500)
 * @param {string}  [payload.errorCode] - Hằng số định danh lỗi
 * @param {Array}   [payload.errors]    - Chi tiết lỗi (validation errors,...)
 *
 * @example
 * sendError(res, { message: "Không tìm thấy sản phẩm", status: 404, errorCode: "PRODUCT_NOT_FOUND" });
 * sendError(res, { message: "Dữ liệu không hợp lệ", status: 422, errorCode: "VALIDATION_ERROR", errors: zodErrors });
 */
export const sendError = (
  res,
  {
    message = 'Đã có lỗi xảy ra',
    status = 500,
    errorCode = 'INTERNAL_ERROR',
    errors = [],
  } = {},
) => {
  const body = {
    success: false,
    message,
    errorCode,
  };
  if (errors.length > 0) body.errors = errors;
  return res.status(status).json(body);
};
