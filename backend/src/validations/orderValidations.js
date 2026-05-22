import { z } from 'zod';

/**
 * Schema validate body khi checkout
 *
 * profile_id: bắt buộc — ID của shipping profile thuộc user
 * voucher_code: optional — mã giảm giá
 * campaign_id: optional — campaign muốn áp dụng
 */
export const checkoutSchema = z.object({
  profile_id: z.number({ required_error: 'profile_id là bắt buộc' }).int().positive('profile_id phải là số nguyên dương'),
  selectedItemIds: z
    .array(z.number().int().positive())
    .min(1, 'Vui lòng chọn ít nhất một sản phẩm để thanh toán'),
  voucher_code: z.string().min(1).max(20).optional(),
  campaign_id: z.number().int().positive().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'returned']),
});
