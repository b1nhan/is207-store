import { Router } from 'express';
import shippingProfileController from '../controllers/shippingProfileController.js';
import validate from '../middlewares/validate.js';
import {
  createShippingProfileSchema,
  updateShippingProfileSchema,
} from '../validations/shippingProfileValidations.js';

const router = Router();

// Tất cả routes dưới đây đều đã được bảo vệ bởi verifyToken
// (mount qua authRoutes.js vốn đã áp verifyToken ở từng route)

/**
 * GET /auth/shipping-profiles
 * Lấy danh sách shipping profile của user đang đăng nhập.
 */
router.get('/', shippingProfileController.getProfiles);

/**
 * GET /auth/shipping-profiles/:id
 * Lấy chi tiết một shipping profile (kiểm tra ownership).
 */
router.get('/:id', shippingProfileController.getProfileById);

/**
 * POST /auth/shipping-profiles
 * Tạo shipping profile mới.
 */
router.post(
  '/',
  validate(createShippingProfileSchema),
  shippingProfileController.createProfile,
);

/**
 * PUT /auth/shipping-profiles/:id
 * Cập nhật toàn bộ shipping profile (kiểm tra ownership).
 */
router.put(
  '/:id',
  validate(updateShippingProfileSchema),
  shippingProfileController.updateProfile,
);

/**
 * DELETE /auth/shipping-profiles/:id
 * Xóa shipping profile (kiểm tra ownership).
 */
router.delete('/:id', shippingProfileController.deleteProfile);

/**
 * PATCH /auth/shipping-profiles/:id/default
 * Set profile này làm default, unset profile default cũ.
 */
router.patch('/:id/default', shippingProfileController.setDefault);

export default router;
