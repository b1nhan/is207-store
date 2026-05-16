import adminProductService from '../../services/admin/adminProductService.js';
import { sendSuccess } from '../../utils/response.js';

class AdminProductController {
  // ─── Products ────────────────────────────────────────────────────────────────

  /**
   * GET /admin/products
   * Query: page, limit, search, status, category_id, brand_id
   */
  getAllProducts = async (req, res, next) => {
    try {
      const result = await adminProductService.getAllProducts(req.query);
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /admin/products/:id
   */
  getProductById = async (req, res, next) => {
    try {
      const product = await adminProductService.getProductById(req.params.id);
      sendSuccess(res, {
        data: product,
        message: 'Lấy chi tiết sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /admin/products
   * Body validated by createProductSchema
   */
  createProduct = async (req, res, next) => {
    try {
      const product = await adminProductService.createProduct(req.body);
      sendSuccess(res, {
        data: product,
        message: 'Tạo sản phẩm thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /admin/products/:id
   * Body validated by updateProductSchema
   */
  updateProduct = async (req, res, next) => {
    try {
      const product = await adminProductService.updateProduct(req.params.id, req.body);
      sendSuccess(res, {
        data: product,
        message: 'Cập nhật sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /admin/products/:id/status
   * Body: { status: 0 | 1 }
   */
  updateStatus = async (req, res, next) => {
    try {
      const result = await adminProductService.updateStatus(req.params.id, req.body.status);
      sendSuccess(res, {
        data: result,
        message: `Cập nhật trạng thái sản phẩm thành công`,
      });
    } catch (error) {
      next(error);
    }
  };

  // ─── Variants ────────────────────────────────────────────────────────────────

  /**
   * POST /admin/products/:id/variants
   * Body validated by createVariantSchema
   */
  addVariant = async (req, res, next) => {
    try {
      const variant = await adminProductService.addVariant(req.params.id, req.body);
      sendSuccess(res, {
        data: variant,
        message: 'Thêm biến thể sản phẩm thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /admin/products/variants/:variantId
   * Body validated by updateVariantSchema
   */
  updateVariant = async (req, res, next) => {
    try {
      const variant = await adminProductService.updateVariant(req.params.variantId, req.body);
      sendSuccess(res, {
        data: variant,
        message: 'Cập nhật biến thể sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /admin/products/variants/:variantId
   */
  deleteVariant = async (req, res, next) => {
    try {
      await adminProductService.deleteVariant(req.params.variantId);
      sendSuccess(res, {
        data: null,
        message: 'Xóa biến thể sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminProductController();
