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

// @route   GET /products/new-arrivals
// @desc    Danh sách hàng mới về
router.get('/new-arrivals', (req, res, next) =>
  productController.getNewArrivals(req, res, next),
);

// @route   GET /products/best-sellers
// @desc    Danh sách bán chạy nhất
router.get('/best-sellers', (req, res, next) =>
  productController.getBestSellers(req, res, next),
);

// @route   GET /products/hot
// @desc    Danh sách sản phẩm hot (14 ngày qua)
router.get('/hot', (req, res, next) =>
  productController.getHotProducts(req, res, next),
);

// @route   GET /products/:id/related
// @desc    Sản phẩm liên quan
router.get('/:id/related', (req, res, next) =>
  productController.getRelatedProducts(req, res, next),
);

// @route   GET /products/:id
// @desc    Chi tiết sản phẩm
router.get('/:id', (req, res, next) =>
  productController.getProductById(req, res, next),
);

export default router;
