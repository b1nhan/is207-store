import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

// @route   GET /categories
// @desc    Danh sách danh mục
router.get('/', (req, res, next) =>
  categoryController.getAllCategories(req, res, next),
);

// @route   GET /categories/:id
// @desc    Lấy danh sách sản phẩm theo danh mục
router.get('/:slug', (req, res, next) =>
  categoryController.getAllProductsByCategory(req, res, next),
);
export default router;
