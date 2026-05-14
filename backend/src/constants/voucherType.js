/**
 * Các loại voucher giảm giá trong hệ thống.
 *
 * - PERCENTAGE: Giảm theo % (ví dụ: giảm 10%)
 * - FIXED:      Giảm số tiền cố định (ví dụ: giảm 50,000đ)
 * - FREESHIP:   Miễn phí vận chuyển
 */
const VOUCHER_TYPE = Object.freeze({
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED',
  FREESHIP: 'FREESHIP',
});

export default VOUCHER_TYPE;
