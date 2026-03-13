import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// @route   GET /products
// @desc    Danh sách sản phẩm ACTIVE (filter, pagination)
router.get('/', productController.getAllProducts);

// @route   GET /products/search
// @desc    Tìm kiếm autocomplete
router.get('/search', productController.searchProducts);

// @route   GET /products/:id
// @desc    Chi tiết sản phẩm
router.get('/:id', productController.getProductById);

export default router;
