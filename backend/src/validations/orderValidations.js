import { z } from 'zod';

/**
 * Schema validate body khi checkout
 *
 * address_id: optional — nếu user dùng địa chỉ đã lưu
 * voucher_code: optional — mã giảm giá
 * receiver_name, receiver_phone, full_address: thông tin giao hàng (snapshot)
 */
export const checkoutSchema = z.object({
  address_id: z.number().int().positive().optional(),
  voucher_code: z.string().min(1).max(20).optional(),
  campaign_id: z.number().int().positive().optional(),
  receiver_name: z.string().min(1, 'Tên người nhận không được để trống').max(100),
  receiver_phone: z
    .string()
    .regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 chữ số)'),
  full_address: z.string().min(1, 'Địa chỉ giao hàng không được để trống'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'returned']),
});
