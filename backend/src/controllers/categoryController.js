import categoryService from '../services/categoryService.js';
import { sendSuccess } from '../utils/response.js';

class CategoryController {
  getAllCategories = async (req, res, next) => {
    try {
      const result = await categoryService.getAllCategories();
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
        req.params.slug,
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

  // ─── Admin ───────────────────────────────────────────────────────────────────

  /**
   * GET /admin/categories/:id
   */
  getCategoryById = async (req, res, next) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      sendSuccess(res, {
        data: category,
        message: 'Lấy thông tin danh mục thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /admin/categories
   * Body validated by createCategorySchema
   */
  createCategory = async (req, res, next) => {
    try {
      const category = await categoryService.createCategory(req.body);
      sendSuccess(res, {
        data: category,
        message: 'Tạo danh mục thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /admin/categories/:id
   * Body validated by updateCategorySchema
   */
  updateCategory = async (req, res, next) => {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      sendSuccess(res, {
        data: category,
        message: 'Cập nhật danh mục thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /admin/categories/:id
   */
  deleteCategory = async (req, res, next) => {
    try {
      await categoryService.deleteCategory(req.params.id);
      sendSuccess(res, {
        data: null,
        message: 'Xóa danh mục thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();
