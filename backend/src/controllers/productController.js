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
}

export default new ProductController();
