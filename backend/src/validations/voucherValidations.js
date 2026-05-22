import { z } from 'zod';

/**
 * Schema để user áp dụng voucher vào đơn hàng
 */
export const applyVoucherSchema = z.object({
  code: z.string().min(1, 'Mã voucher không được để trống').max(20),
  subtotal: z.number({ required_error: 'Giá trị đơn hàng là bắt buộc' }).positive('Giá trị đơn hàng phải lớn hơn 0'),
});

/**
 * Schema Admin: Tạo voucher mới
 */
export const createVoucherSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã voucher không được để trống')
    .max(20, 'Mã voucher tối đa 20 ký tự')
    .transform((val) => val.toUpperCase()),
  discount_type: z.enum(['PERCENTAGE', 'FIXED', 'FREESHIP'], {
    errorMap: () => ({ message: "discount_type phải là 'PERCENTAGE', 'FIXED', hoặc 'FREESHIP'" }),
  }),
  discount_value: z.number({ required_error: 'Giá trị giảm là bắt buộc' }).positive('Giá trị giảm phải lớn hơn 0'),
  max_discount_amount: z.number().positive('Giảm tối đa phải lớn hơn 0').optional(),
  min_order_value: z.number().min(0, 'Giá trị đơn tối thiểu không được âm').default(0),
  usage_limit: z
    .number({ required_error: 'Giới hạn số lượt dùng là bắt buộc' })
    .int()
    .positive('Giới hạn lượt dùng phải là số nguyên dương'),
  user_usage_limit: z.number().int().positive().default(1),
  start_date: z.string().datetime({ message: 'start_date phải là ISO 8601 datetime' }).optional(),
  expiry_date: z.string().datetime({ message: 'expiry_date phải là ISO 8601 datetime' }),
  description: z.string().max(255, 'Mô tả tối đa 255 ký tự').optional(),
});

/**
 * Schema Admin: Cập nhật voucher (tất cả fields đều optional)
 */
export const updateVoucherSchema = createVoucherSchema
  .omit({ code: true }) // Code không được đổi qua update (hoặc cho phép đổi — bỏ omit nếu cần)
  .extend({
    code: z
      .string()
      .min(1)
      .max(20)
      .transform((val) => val.toUpperCase())
      .optional(),
    is_active: z.union([z.literal(0), z.literal(1)]).optional(),
  })
  .partial();
