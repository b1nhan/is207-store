import voucherService from '../services/voucherService.js';
import { sendSuccess } from '../utils/response.js';

class VoucherController {
  /**
   * POST /vouchers/apply
   * User áp dụng voucher — trả về discount amount
   * Body: { code, subtotal }
   */
  applyVoucher = async (req, res, next) => {
    try {
      const result = await voucherService.applyVoucher(req.user.user_id, req.body);
      sendSuccess(res, {
        data: result,
        message: 'Áp dụng voucher thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /vouchers/active
   * User lấy danh sách vouchers đang hiệu lực
   */
  getActiveVouchers = async (req, res, next) => {
    try {
      const result = await voucherService.getActiveVouchers(req.user.user_id);
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách voucher thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  // ─── Admin endpoints ────────────────────────────────────────────────────────

  /**
   * GET /admin/vouchers
   * Admin lấy tất cả vouchers (có pagination)
   */
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await voucherService.getAll({ page: Number(page), limit: Number(limit) });
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách voucher thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /admin/vouchers/:id
   * Admin lấy chi tiết một voucher
   */
  getById = async (req, res, next) => {
    try {
      const result = await voucherService.getById(Number(req.params.id));
      sendSuccess(res, {
        data: result,
        message: 'Lấy thông tin voucher thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /admin/vouchers
   * Admin tạo voucher mới
   * Body: createVoucherSchema
   */
  create = async (req, res, next) => {
    try {
      const result = await voucherService.createVoucher(req.body, req.user.user_id);
      sendSuccess(res, {
        data: result,
        message: 'Tạo voucher thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /admin/vouchers/:id
   * Admin cập nhật voucher
   * Body: updateVoucherSchema
   */
  update = async (req, res, next) => {
    try {
      const result = await voucherService.updateVoucher(Number(req.params.id), req.body);
      sendSuccess(res, {
        data: result,
        message: 'Cập nhật voucher thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /admin/vouchers/:id
   * Admin xóa mềm voucher (set is_active = 0)
   */
  delete = async (req, res, next) => {
    try {
      await voucherService.deleteVoucher(Number(req.params.id));
      sendSuccess(res, {
        data: null,
        message: 'Xóa voucher thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new VoucherController();
