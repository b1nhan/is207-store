import { z } from 'zod';

const CAMPAIGN_TYPES = ['PERCENTAGE', 'FIXED_PRICE', 'TIER_DISCOUNT', 'FREESHIP'];

export const createCampaignSchema = z.object({
  name: z.string({ required_error: 'Tên campaign là bắt buộc' }).min(1, 'Tên không được để trống').max(255, 'Tên tối đa 255 ký tự'),
  description: z.string().optional().nullable(),
  campaign_type: z.enum(CAMPAIGN_TYPES, { required_error: 'Loại campaign không hợp lệ' }),
  start_date: z.string({ required_error: 'start_date là bắt buộc' }).datetime({ offset: true, message: 'start_date phải là định dạng ISO 8601' }),
  end_date: z.string({ required_error: 'end_date là bắt buộc' }).datetime({ offset: true, message: 'end_date phải là định dạng ISO 8601' }),
  status: z.number().int().min(0).max(1).optional().default(1),

  config: z.object({
    discount_value: z.number().positive('Giá trị giảm phải lớn hơn 0')
  }).nullable().optional(),

  tiers: z.array(z.object({
    min_order_value: z.number().int().positive('min_order_value phải lớn hơn 0'),
    discount_value: z.number().positive('discount_value phải lớn hơn 0').max(99, 'discount_value tối đa 99%')
  })).nullable().optional(),

  product_ids: z.array(z.number().int().positive()).nullable().optional()
}).refine(data => {
  return new Date(data.end_date) > new Date(data.start_date);
}, { message: 'end_date phải lớn hơn start_date', path: ['end_date'] });

export const updateCampaignSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  start_date: z.string().datetime({ offset: true }).optional(),
  end_date: z.string().datetime({ offset: true }).optional(),

  config: z.object({
    discount_value: z.number().positive()
  }).nullable().optional(),

  tiers: z.array(z.object({
    min_order_value: z.number().int().positive(),
    discount_value: z.number().positive().max(99)
  })).nullable().optional(),

  product_ids: z.array(z.number().int().positive()).nullable().optional()
}).refine(data => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, { message: 'end_date phải lớn hơn start_date', path: ['end_date'] });

export const statusCampaignSchema = z.object({
  status: z.number({ required_error: 'Trạng thái là bắt buộc' }).int().min(0).max(1)
});

export const generateDescriptionSchema = z.object({
  name: z.string({ required_error: 'Tên chiến dịch là bắt buộc' }).min(1, 'Tên không được để trống').max(255),
  campaign_type: z.enum(['PERCENTAGE', 'FIXED_PRICE', 'TIER_DISCOUNT', 'FREESHIP']).optional(),
  discount_value: z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number().positive().optional()),
});


