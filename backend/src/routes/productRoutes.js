import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// @route   GET /products
// @desc    Danh sách sản phẩm ACTIVE (filter, pagination)
router.get('/', (req, res, next) =>
  productController.getAllProducts(req, res, next),
);

// @route   GET /products/search
// @desc    Tìm kiếm autocomplete
router.get('/search', (req, res, next) =>
  productController.searchProducts(req, res, next),
);

// @route   GET /products/:id
// @desc    Chi tiết sản phẩm
router.get('/:id', (req, res, next) =>
  productController.getProductById(req, res, next),
);

export default router;
