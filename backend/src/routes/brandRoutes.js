import express from 'express';
import brandController from '../controllers/brandController.js';

const router = express.Router();

// @route   GET /
// @desc    Get all brands
router.get('/', brandController.getAllBrands);

// @route   GET /:id/products
// @desc    Get products by brand ID
router.get('/:id/products', brandController.getAllProductsByBrand);

export default router;
