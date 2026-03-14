/**
 * Tập trung toàn bộ error code của ứng dụng.
 * Dùng các hằng số này thay vì hardcode string ở mọi nơi.
 *
 * Quy ước đặt tên: DOMAIN_NOUN_VERB/ADJECTIVE
 *   - Dùng SCREAMING_SNAKE_CASE
 *   - Nhóm theo domain (AUTH, USER, PRODUCT,...)
 *   - Giá trị string = tên hằng số (để dễ debug)
 *
 * Cách dùng:
 *   const { ERROR_CODES } = require("../constants/errorCode");
 *   throw new AppError("Email đã tồn tại", 409, ERROR_CODES.AUTH.EMAIL_ALREADY_EXISTS);
 */

const ERROR_CODES = {
  // ─── COMMON ────────────────────────────────────────────────────────────────
  // Lỗi chung, không thuộc domain cụ thể nào
  COMMON: {
    INTERNAL_ERROR: 'INTERNAL_ERROR', // 500 - Lỗi server không xác định
    VALIDATION_ERROR: 'VALIDATION_ERROR', // 422 - Dữ liệu đầu vào không hợp lệ (Zod)
    NOT_FOUND: 'NOT_FOUND', // 404 - Resource không tồn tại (generic)
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND', // 404 - Route không tồn tại
    FORBIDDEN: 'FORBIDDEN', // 403 - Không có quyền thực hiện
    UNAUTHORIZED: 'UNAUTHORIZED', // 401 - Chưa đăng nhập
    BAD_REQUEST: 'BAD_REQUEST', // 400 - Request không hợp lệ (generic)
    METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED', // 405 - HTTP method không được hỗ trợ
    CONFLICT: 'CONFLICT', // 409 - Xung đột dữ liệu (generic)
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS', // 429 - Quá nhiều request (rate limit)
  },

  // ─── AUTH ──────────────────────────────────────────────────────────────────
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS', // 401 - Sai email hoặc mật khẩu
    EMAIL_ALREADY_EXISTS: 'AUTH_EMAIL_ALREADY_EXISTS', // 409 - Email đã được đăng ký
    USERNAME_ALREADY_EXISTS: 'AUTH_USERNAME_ALREADY_EXISTS', // 409 - Username đã tồn tại
    TOKEN_MISSING: 'AUTH_TOKEN_MISSING', // 401 - Không có token trong header
    TOKEN_INVALID: 'AUTH_TOKEN_INVALID', // 401 - Token sai hoặc bị giả mạo
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED', // 401 - Access token hết hạn
    REFRESH_TOKEN_INVALID: 'AUTH_REFRESH_TOKEN_INVALID', // 401 - Refresh token không hợp lệ
    REFRESH_TOKEN_EXPIRED: 'AUTH_REFRESH_TOKEN_EXPIRED', // 401 - Refresh token hết hạn
    WRONG_PASSWORD: 'AUTH_WRONG_PASSWORD', // 400 - Sai mật khẩu hiện tại (đổi mật khẩu)
    ACCOUNT_DISABLED: 'AUTH_ACCOUNT_DISABLED', // 403 - Tài khoản bị khóa
  },

  // ─── USER ──────────────────────────────────────────────────────────────────
  USER: {
    NOT_FOUND: 'USER_NOT_FOUND', // 404 - Không tìm thấy user
    ADDRESS_NOT_FOUND: 'USER_ADDRESS_NOT_FOUND', // 404 - Không tìm thấy địa chỉ
    ADDRESS_FORBIDDEN: 'USER_ADDRESS_FORBIDDEN', // 403 - Địa chỉ không thuộc user này
  },

  // ─── PRODUCT ───────────────────────────────────────────────────────────────
  PRODUCT: {
    NOT_FOUND: 'PRODUCT_NOT_FOUND', // 404 - Không tìm thấy sản phẩm
    SLUG_ALREADY_EXISTS: 'PRODUCT_SLUG_ALREADY_EXISTS', // 409 - Slug đã tồn tại
    VARIANT_NOT_FOUND: 'PRODUCT_VARIANT_NOT_FOUND', // 404 - Không tìm thấy biến thể
    VARIANT_OUT_OF_STOCK: 'PRODUCT_VARIANT_OUT_OF_STOCK', // 400 - Biến thể hết hàng
    VARIANT_SKU_EXISTS: 'PRODUCT_VARIANT_SKU_EXISTS', // 409 - SKU đã tồn tại
    INACTIVE: 'PRODUCT_INACTIVE', // 400 - Sản phẩm đang bị ẩn
  },

  // ─── CATEGORY ──────────────────────────────────────────────────────────────
  CATEGORY: {
    NOT_FOUND: 'CATEGORY_NOT_FOUND', // 404 - Không tìm thấy danh mục
    SLUG_ALREADY_EXISTS: 'CATEGORY_SLUG_ALREADY_EXISTS', // 409 - Slug danh mục đã tồn tại
    NAME_ALREADY_EXISTS: 'CATEGORY_NAME_ALREADY_EXISTS', // 409 - Tên danh mục đã tồn tại
    HAS_PRODUCTS: 'CATEGORY_HAS_PRODUCTS', // 409 - Không thể xóa vì còn sản phẩm
  },

  // ─── BRAND ─────────────────────────────────────────────────────────────────
  BRAND: {
    NOT_FOUND: 'BRAND_NOT_FOUND', // 404 - Không tìm thấy thương hiệu
    NAME_ALREADY_EXISTS: 'BRAND_NAME_ALREADY_EXISTS', // 409 - Tên thương hiệu đã tồn tại
    HAS_PRODUCTS: 'BRAND_HAS_PRODUCTS', // 409 - Không thể xóa vì còn sản phẩm
  },

  // ─── CART ──────────────────────────────────────────────────────────────────
  CART: {
    NOT_FOUND: 'CART_NOT_FOUND', // 404 - Không tìm thấy giỏ hàng
    ITEM_NOT_FOUND: 'CART_ITEM_NOT_FOUND', // 404 - Không tìm thấy item trong giỏ
    ITEM_FORBIDDEN: 'CART_ITEM_FORBIDDEN', // 403 - Item không thuộc giỏ của user
    EXCEED_STOCK: 'CART_EXCEED_STOCK', // 400 - Số lượng vượt quá tồn kho
  },

  // ─── ORDER ─────────────────────────────────────────────────────────────────
  ORDER: {
    NOT_FOUND: 'ORDER_NOT_FOUND', // 404 - Không tìm thấy đơn hàng
    FORBIDDEN: 'ORDER_FORBIDDEN', // 403 - Đơn hàng không thuộc user này
    CANNOT_CANCEL: 'ORDER_CANNOT_CANCEL', // 400 - Không thể hủy (không còn PENDING)
    EMPTY_CART: 'ORDER_EMPTY_CART', // 400 - Giỏ hàng trống khi checkout
    INSUFFICIENT_STOCK: 'ORDER_INSUFFICIENT_STOCK', // 400 - Không đủ hàng khi checkout
    INVALID_STATUS_TRANSITION: 'ORDER_INVALID_STATUS_TRANSITION', // 400 - Chuyển trạng thái không hợp lệ
  },

  // ─── VOUCHER ───────────────────────────────────────────────────────────────
  VOUCHER: {
    NOT_FOUND: 'VOUCHER_NOT_FOUND', // 404 - Không tìm thấy voucher
    CODE_NOT_FOUND: 'VOUCHER_CODE_NOT_FOUND', // 404 - Mã voucher không tồn tại
    EXPIRED: 'VOUCHER_EXPIRED', // 400 - Voucher đã hết hạn
    INACTIVE: 'VOUCHER_INACTIVE', // 400 - Voucher không còn hiệu lực
    USAGE_LIMIT_REACHED: 'VOUCHER_USAGE_LIMIT_REACHED', // 400 - Voucher đã hết lượt dùng
    USER_LIMIT_REACHED: 'VOUCHER_USER_LIMIT_REACHED', // 400 - User đã dùng hết lượt cho phép
    MIN_ORDER_NOT_MET: 'VOUCHER_MIN_ORDER_NOT_MET', // 400 - Đơn hàng chưa đạt giá trị tối thiểu
    NOT_STARTED: 'VOUCHER_NOT_STARTED', // 400 - Voucher chưa đến ngày bắt đầu
    CODE_ALREADY_EXISTS: 'VOUCHER_CODE_ALREADY_EXISTS', // 409 - Mã voucher đã tồn tại
  },

  // ─── UPLOAD ────────────────────────────────────────────────────────────────
  UPLOAD: {
    NO_FILE: 'UPLOAD_NO_FILE', // 400 - Không có file được gửi lên
    INVALID_TYPE: 'UPLOAD_INVALID_TYPE', // 400 - Định dạng file không được hỗ trợ
    FILE_TOO_LARGE: 'UPLOAD_FILE_TOO_LARGE', // 400 - File vượt quá dung lượng cho phép
    CLOUDINARY_ERROR: 'UPLOAD_CLOUDINARY_ERROR', // 500 - Lỗi khi upload lên Cloudinary
    DELETE_FAILED: 'UPLOAD_DELETE_FAILED', // 500 - Lỗi khi xóa ảnh khỏi Cloudinary
    PUBLIC_ID_REQUIRED: 'UPLOAD_PUBLIC_ID_REQUIRED', // 400 - Thiếu publicId khi xóa ảnh
  },
};

export { ERROR_CODES };
