import voucherService from '../services/voucherService.js';
import { sendSuccess } from '../utils/response.js';
import { verifyAccessToken } from '../utils/jwt.js';

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
   * User lấy danh sách vouchers đang hiệu lực (có thể là guest hoặc logged in)
   */
  getActiveVouchers = async (req, res, next) => {
    try {
      let userId = null;
      const authHeader = req.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = verifyAccessToken(token);
          userId = decoded.user_id;
        } catch (err) {
          // Token expired or invalid: ignore, treat as guest
        }
      }

      const result = await voucherService.getActiveVouchers(userId);
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
