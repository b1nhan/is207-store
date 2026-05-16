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

}

export default new VoucherController();
