// ─── Enums / Label Maps ───────────────────────────────────────────────────────

// ── Order Status ──────────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const ORDER_STATUS_LABEL = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

export const ORDER_STATUS_COLOR = {
  pending: 'yellow',
  confirmed: 'blue',
  processing: 'purple',
  shipping: 'orange',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'gray',
};

// ── Payment ───────────────────────────────────────────────────────────────────
export const PAYMENT_METHOD = {
  COD: 'cod',
  BANK_TRANSFER: 'bank_transfer',
  VNPAY: 'vnpay',
  MOMO: 'momo',
};

export const PAYMENT_METHOD_LABEL = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  vnpay: 'VNPay',
  momo: 'Ví MoMo',
};

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

export const PAYMENT_STATUS_LABEL = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
};

// ── Product ───────────────────────────────────────────────────────────────────
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
};

export const PRODUCT_STATUS_LABEL = {
  active: 'Đang bán',
  inactive: 'Ẩn',
  out_of_stock: 'Hết hàng',
};

export const PRODUCT_SORT = {
  NEWEST: 'createdAt:desc',
  OLDEST: 'createdAt:asc',
  PRICE_ASC: 'price:asc',
  PRICE_DESC: 'price:desc',
  NAME_ASC: 'name:asc',
  NAME_DESC: 'name:desc',
  BEST_SELLER: 'sold:desc',
};

export const PRODUCT_SORT_OPTIONS = [
  { label: 'Mới nhất', value: PRODUCT_SORT.NEWEST },
  { label: 'Giá tăng dần', value: PRODUCT_SORT.PRICE_ASC },
  { label: 'Giá giảm dần', value: PRODUCT_SORT.PRICE_DESC },
  { label: 'Tên A-Z', value: PRODUCT_SORT.NAME_ASC },
  { label: 'Bán chạy nhất', value: PRODUCT_SORT.BEST_SELLER },
];

// ── Voucher ───────────────────────────────────────────────────────────────────
export const VOUCHER_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};

export const VOUCHER_TYPE_LABEL = {
  percentage: 'Giảm theo %',
  fixed: 'Giảm tiền trực tiếp',
};

// ── User Role ─────────────────────────────────────────────────────────────────
export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
};
