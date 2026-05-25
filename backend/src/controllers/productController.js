import productService from '../services/productService.js';
import { sendSuccess } from '../utils/response.js';

class ProductController {
  getAllProducts = async (req, res, next) => {
    try {
      const result = await productService.getAllProducts(req.query);
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req, res, next) => {
    try {
      const product = await productService.getProductDetail(req.params.id);
      sendSuccess(res, {
        data: product,
        message: 'Lấy chi tiết sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  searchProducts = async (req, res, next) => {
    try {
      const results = await productService.searchProducts(req.query.q);
      sendSuccess(res, {
        data: results,
        message: 'Tìm kiếm sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  getRelatedProducts = async (req, res, next) => {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit, 10) || 8;
      const data = await productService.getRelatedProducts(id, limit);
      sendSuccess(res, {
        data,
        message: 'Lấy sản phẩm liên quan thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  getNewArrivals = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const data = await productService.getNewArrivals(limit);
      sendSuccess(res, {
        data,
        message: 'Lấy danh sách hàng mới về thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  getBestSellers = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const data = await productService.getBestSellers(limit);
      sendSuccess(res, {
        data,
        message: 'Lấy danh sách bán chạy nhất thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  getHotProducts = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const data = await productService.getHotProducts(limit);
      sendSuccess(res, {
        data,
        message: 'Lấy danh sách sản phẩm hot thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
