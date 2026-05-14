import { z } from 'zod';

// ─── Product ───────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  product_name: z
    .string({ required_error: 'Tên sản phẩm là bắt buộc' })
    .min(1, 'Tên sản phẩm không được để trống')
    .max(100, 'Tên sản phẩm tối đa 100 ký tự'),

  product_description: z.string().optional(),

  material: z.string().max(100, 'Chất liệu tối đa 100 ký tự').optional(),

  gender: z.enum(['men', 'women', 'unisex', 'kids'], {
    required_error: 'gender là bắt buộc',
    invalid_type_error: "gender phải là 'men', 'women', 'unisex' hoặc 'kids'",
  }),

  base_price: z
    .number({ required_error: 'Giá cơ bản là bắt buộc', invalid_type_error: 'Giá phải là số' })
    .positive('Giá phải lớn hơn 0'),

  brand_id: z.number().int().positive().optional().nullable(),

  category_id: z.number().int().positive().optional().nullable(),

  slug: z
    .string({ required_error: 'Slug là bắt buộc' })
    .min(1, 'Slug không được để trống')
    .max(255, 'Slug tối đa 255 ký tự')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch nối'),
});

export const updateProductSchema = createProductSchema.partial();

// ─── Variant ──────────────────────────────────────────────────────────────────

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

export const updateVariantSchema = createVariantSchema.partial();

// ─── Status ───────────────────────────────────────────────────────────────────

export const updateStatusSchema = z.object({
  status: z.union([z.literal(0), z.literal(1)], {
    required_error: 'status là bắt buộc',
    invalid_type_error: 'status phải là 0 (inactive) hoặc 1 (active)',
  }),
});
