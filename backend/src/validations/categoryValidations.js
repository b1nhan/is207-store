import { z } from 'zod';

// ─── Category ──────────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  category_name: z
    .string({ required_error: 'Tên danh mục là bắt buộc' })
    .min(1, 'Tên danh mục không được để trống')
    .max(100, 'Tên danh mục tối đa 100 ký tự'),

  slug: z
    .string({ required_error: 'Slug là bắt buộc' })
    .min(1, 'Slug không được để trống')
    .max(100, 'Slug tối đa 100 ký tự')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug chỉ được chứa chữ thường, số và dấu gạch nối',
    ),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Brand ─────────────────────────────────────────────────────────────────────

export const createBrandSchema = z.object({
  brand_name: z
    .string({ required_error: 'Tên thương hiệu là bắt buộc' })
    .min(1, 'Tên thương hiệu không được để trống')
    .max(100, 'Tên thương hiệu tối đa 100 ký tự'),
});

export const updateBrandSchema = createBrandSchema.partial();
