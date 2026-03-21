import categoryService from '../services/categoryService.js';
import { sendSuccess } from '../utils/response.js';

class CategoryController {
  getAllCategories = async (req, res, next) => {
    try {
      const result = await categoryService.getAllCategories();
      // console.log(req.query);
      // let onlyforfixbug = req.query;
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách danh mục thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  getAllProductsByCategory = async (req, res, next) => {
    try {
      const result = await categoryService.getAllProductsByCategory(
        req.params.slug, // ← truyền slug từ URL
        req.query,
      );
      sendSuccess(res, {
        data: result,
        message: `Lấy danh sách sản phẩm của danh mục ${result.category.category_name} thành công`,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();
