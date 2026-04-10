import { z } from 'zod';

// ─── Reusable field schemas ──────────────────────────────────────────────────

const emailSchema = z
  .string({ required_error: 'Email là bắt buộc' })
  //   .email('Email không đúng định dạng')
  .max(255, 'Email tối đa 255 ký tự');

const passwordSchema = z
  .string({ required_error: 'Mật khẩu là bắt buộc' })
  .min(8, 'Mật khẩu tối thiểu 8 ký tự')
  .max(32, 'Mật khẩu tối đa 32 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
  .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số');

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: z
    .string({ required_error: 'Username là bắt buộc' })
    .min(3, 'Username tối thiểu 3 ký tự')
    .max(50, 'Username tối đa 50 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ gồm chữ cái, số và dấu gạch dưới'),
  full_name: z.string().max(100, 'Tên tối đa 100 ký tự').optional(),
  phone: z
    .string()
    .regex(/^0\d{9}$/, 'Số điện thoại phải có 10 số, bắt đầu bằng 0')
    .optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc' })
    .min(1, 'Mật khẩu là bắt buộc'),
});

export const changePasswordSchema = z.object({
  current_password: z
    .string({ required_error: 'Mật khẩu hiện tại là bắt buộc' })
    .min(1, 'Mật khẩu hiện tại là bắt buộc'),
  new_password: passwordSchema,
});
