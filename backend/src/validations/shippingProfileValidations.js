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
