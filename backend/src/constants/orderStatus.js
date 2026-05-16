/**
 * Các trạng thái đơn hàng hợp lệ trong hệ thống.
 * Dùng constant này thay vì hardcode string ở service/repository layer.
 *
 * Luồng chuyển trạng thái:
 *   pending → confirmed → shipping → delivered
 *   Bất kỳ trạng thái nào → cancelled (ngoại trừ delivered và cancelled)
 */
const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
});

export default ORDER_STATUS;
