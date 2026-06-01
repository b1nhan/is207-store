import { z } from 'zod';

// ─── Reusable field schemas ──────────────────────────────────────────────────

const receiverNameSchema = z
  .string({ required_error: 'Tên người nhận là bắt buộc' })
  .min(1, 'Tên người nhận không được để trống')
  .max(100, 'Tên người nhận tối đa 100 ký tự');

const receiverPhoneSchema = z
  .string({ required_error: 'Số điện thoại là bắt buộc' })
  .regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 chữ số)');

const fullAddressSchema = z
  .string({ required_error: 'Địa chỉ là bắt buộc' })
  .min(1, 'Địa chỉ không được để trống');

const labelSchema = z.string().max(50, 'Nhãn tối đa 50 ký tự').optional().nullable();

const isDefaultSchema = z.boolean().optional();

// ─── Schemas ─────────────────────────────────────────────────────────────────

/**
 * Schema cho POST /auth/shipping-profiles (tạo mới)
 */
export const createShippingProfileSchema = z.object({
  receiver_name: receiverNameSchema,
  receiver_phone: receiverPhoneSchema,
  full_address: fullAddressSchema,
  label: labelSchema,
  is_default: isDefaultSchema,
});

/**
 * Schema cho PUT /auth/shipping-profiles/:id (cập nhật toàn bộ)
 */
export const updateShippingProfileSchema = z.object({
  receiver_name: receiverNameSchema,
  receiver_phone: receiverPhoneSchema,
  full_address: fullAddressSchema,
  label: labelSchema,
  is_default: isDefaultSchema,
});

/**
 * Schema cho validate path parameter id
 */
export const shippingProfileIdSchema = z.object({
  profile_id: z.number({ invalid_type_error: 'ID không hợp lệ' }),
  user_id: z.number({ invalid_type_error: 'ID không hợp lệ' }),
});

export const createVariantSchema = z.object({
  size: z
    .string({ required_error: 'Size là bắt buộc' })
    .min(1, 'Size không được để trống')
    .max(20, 'Size tối đa 20 ký tự'),

  color: z
    .string({ required_error: 'Màu sắc là bắt buộc' })
    .min(1, 'Màu sắc không được để trống')
    .max(30, 'Màu sắc tối đa 30 ký tự'),

  stock_quantity: z
    .number({
      required_error: 'Số lượng tồn kho là bắt buộc',
      invalid_type_error: 'Số lượng phải là số nguyên',
    })
    .int('Số lượng phải là số nguyên')
    .min(0, 'Số lượng không được âm'),

  variant_price: z.number().positive('Giá variant phải lớn hơn 0').optional().nullable(),

  sku: z.string().max(50, 'SKU tối đa 50 ký tự').optional().nullable(),
});
