import voucherService from '../../services/voucherService.js';
import { sendSuccess } from '../../utils/response.js';

class AdminVoucherController {
  /**
   * GET /admin/vouchers
   */
  async getAllVouchers(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await voucherService.getAll({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
      });
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/vouchers/:id
   */
  async getVoucherById(req, res, next) {
    try {
      const voucherId = parseInt(req.params.id, 10);
      const voucher = await voucherService.getById(voucherId);
      sendSuccess(res, { data: voucher });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /admin/vouchers
   */
  async createVoucher(req, res, next) {
    try {
      const adminUserId = req.user.user_id; // from verifyToken middleware
      const voucherDto = req.body;
      const newVoucher = await voucherService.createVoucher(voucherDto, adminUserId);
      sendSuccess(res, {
        data: { id: newVoucher },
        message: 'Tạo voucher thành công',
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /admin/vouchers/:id
   */
  async updateVoucher(req, res, next) {
    try {
      const voucherId = parseInt(req.params.id, 10);
      const voucherDto = req.body;
      await voucherService.updateVoucher(voucherId, voucherDto);
      sendSuccess(res, { message: 'Cập nhật voucher thành công' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /admin/vouchers/:id
   */
  async deleteVoucher(req, res, next) {
    try {
      const voucherId = parseInt(req.params.id, 10);
      await voucherService.deleteVoucher(voucherId);
      sendSuccess(res, { message: 'Xóa voucher thành công' });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminVoucherController();
