import brandService from '../services/brandService.js';
import { sendSuccess } from '../utils/response.js';

class BrandController {
  getAllBrands = async (req, res, next) => {
    try {
      const result = await brandService.getAllBrands();
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách brand thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  getAllProductsByBrand = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await brandService.getAllProductsByBrand(id, req.query);
      sendSuccess(res, {
        data: result,
        message: `Lấy danh sách sản phẩm của thương hiệu ${result.brand.brand_name} thành công`,
      });
    } catch (error) {
      next(error);
    }
  };

  // ─── Admin ───────────────────────────────────────────────────────────────────

  /**
   * GET /admin/brands/:id
   */
  getBrandById = async (req, res, next) => {
    try {
      const brand = await brandService.getBrandById(req.params.id);
      sendSuccess(res, {
        data: brand,
        message: 'Lấy thông tin thương hiệu thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /admin/brands
   * Body validated by createBrandSchema
   */
  createBrand = async (req, res, next) => {
    try {
      const brand = await brandService.createBrand(req.body);
      sendSuccess(res, {
        data: brand,
        message: 'Tạo thương hiệu thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /admin/brands/:id
   * Body validated by updateBrandSchema
   */
  updateBrand = async (req, res, next) => {
    try {
      const brand = await brandService.updateBrand(req.params.id, req.body);
      sendSuccess(res, {
        data: brand,
        message: 'Cập nhật thương hiệu thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /admin/brands/:id
   */
  deleteBrand = async (req, res, next) => {
    try {
      await brandService.deleteBrand(req.params.id);
      sendSuccess(res, {
        data: null,
        message: 'Xóa thương hiệu thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new BrandController();
