import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import requireAdmin from '../middlewares/requireAdmin.js';
import validate from '../middlewares/validate.js';

import adminProductController from '../controllers/admin/adminProductController.js';
import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
  updateStatusSchema,
} from '../validations/productValidations.js';

const router = Router();

// ─── Products ─────────────────────────────────────────────────────────────────

// GET    /admin/products            — lấy danh sách (kể cả INACTIVE)
// GET    /admin/products/:id        — lấy chi tiết
// POST   /admin/products            — tạo mới
// PUT    /admin/products/:id        — cập nhật thông tin
// PATCH  /admin/products/:id/status — toggle trạng thái

// QUAN TRỌNG: Routes tĩnh /products/variants/:variantId phải đặt TRƯỚC /products/:id
// để Express không nhầm "variants" thành param :id.

// ─── Variant routes (tĩnh, đặt TRƯỚC) ────────────────────────────────────────

router.put(
  '/products/variants/:variantId',
  verifyToken,
  requireAdmin,
  validate(updateVariantSchema),
  adminProductController.updateVariant,
);

router.delete(
  '/products/variants/:variantId',
  verifyToken,
  requireAdmin,
  adminProductController.deleteVariant,
);

// ─── Product routes ───────────────────────────────────────────────────────────

router.get('/products', verifyToken, requireAdmin, adminProductController.getAllProducts);

router.post(
  '/products',
  verifyToken,
  requireAdmin,
  validate(createProductSchema),
  adminProductController.createProduct,
);

router.get('/products/:id', verifyToken, requireAdmin, adminProductController.getProductById);

router.put(
  '/products/:id',
  verifyToken,
  requireAdmin,
  validate(updateProductSchema),
  adminProductController.updateProduct,
);

router.patch(
  '/products/:id/status',
  verifyToken,
  requireAdmin,
  validate(updateStatusSchema),
  adminProductController.updateStatus,
);

router.post(
  '/products/:id/variants',
  verifyToken,
  requireAdmin,
  validate(createVariantSchema),
  adminProductController.addVariant,
);

export default router;
