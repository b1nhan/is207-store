import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import requireAdmin from '../middlewares/requireAdmin.js';
import validate from '../middlewares/validate.js';

import adminProductController from '../controllers/admin/adminProductController.js';
import categoryController from '../controllers/categoryController.js';
import brandController from '../controllers/brandController.js';
import voucherController from '../controllers/voucherController.js';

import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
  updateStatusSchema,
} from '../validations/productValidations.js';
import {
  createCategorySchema,
  updateCategorySchema,
  createBrandSchema,
  updateBrandSchema,
} from '../validations/categoryValidations.js';
import { createVoucherSchema, updateVoucherSchema } from '../validations/voucherValidations.js';

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

// ─── Categories ─────────────────────────────────────────────────────────────────────

// GET    /admin/categories         — not needed (public route exists)
// GET    /admin/categories/:id     — lấy chi tiết 1 danh mục
// POST   /admin/categories         — tạo mới
// PUT    /admin/categories/:id     — cập nhật
// DELETE /admin/categories/:id     — xóa (guard: không có sản phẩm)

router.get('/categories/:id', verifyToken, requireAdmin, categoryController.getCategoryById);

router.post(
  '/categories',
  verifyToken,
  requireAdmin,
  validate(createCategorySchema),
  categoryController.createCategory,
);

router.put(
  '/categories/:id',
  verifyToken,
  requireAdmin,
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete('/categories/:id', verifyToken, requireAdmin, categoryController.deleteCategory);

// ─── Brands ────────────────────────────────────────────────────────────────────────

// GET    /admin/brands             — not needed (public route exists)
// GET    /admin/brands/:id         — lấy chi tiết 1 thương hiệu
// POST   /admin/brands             — tạo mới
// PUT    /admin/brands/:id         — cập nhật
// DELETE /admin/brands/:id         — xóa (guard: không có sản phẩm)

router.get('/brands/:id', verifyToken, requireAdmin, brandController.getBrandById);

router.post(
  '/brands',
  verifyToken,
  requireAdmin,
  validate(createBrandSchema),
  brandController.createBrand,
);

router.put(
  '/brands/:id',
  verifyToken,
  requireAdmin,
  validate(updateBrandSchema),
  brandController.updateBrand,
);

router.delete('/brands/:id', verifyToken, requireAdmin, brandController.deleteBrand);

// ─── Vouchers (Admin CRUD) ────────────────────────────────────────────────────

// GET    /admin/vouchers        — tất cả vouchers, có pagination
// GET    /admin/vouchers/:id    — chi tiết một voucher
// POST   /admin/vouchers        — tạo voucher mới
// PUT    /admin/vouchers/:id    — cập nhật
// DELETE /admin/vouchers/:id    — soft delete (set is_active=0)

router.get('/vouchers', verifyToken, requireAdmin, voucherController.getAll);
router.get('/vouchers/:id', verifyToken, requireAdmin, voucherController.getById);
router.post('/vouchers', verifyToken, requireAdmin, validate(createVoucherSchema), voucherController.create);
router.put('/vouchers/:id', verifyToken, requireAdmin, validate(updateVoucherSchema), voucherController.update);
router.delete('/vouchers/:id', verifyToken, requireAdmin, voucherController.delete);

export default router;
