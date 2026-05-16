import { z } from 'zod';

/**
 * Schema validate body khi thêm item vào giỏ hàng
 * POST /cart
 */
export const addCartItemSchema = z.object({
  variant_id: z.number({ required_error: 'variant_id là bắt buộc' }).int().positive(),
  quantity: z
    .number({ required_error: 'quantity là bắt buộc' })
    .int()
    .positive()
    .max(99, 'Số lượng tối đa là 99'),
});

/**
 * Schema validate body khi cập nhật quantity của item
 * PUT /cart/:itemId
 */
export const updateCartItemSchema = z.object({
  quantity: z
    .number({ required_error: 'quantity là bắt buộc' })
    .int()
    .positive()
    .max(99, 'Số lượng tối đa là 99'),
});
