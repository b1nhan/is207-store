import { Router } from 'express';
import voucherController from '../controllers/voucherController.js';
import verifyToken from '../middlewares/verifyToken.js';
import validate from '../middlewares/validate.js';
import { applyVoucherSchema } from '../validations/voucherValidations.js';

const router = Router();

// ─── User Endpoints (yêu cầu đăng nhập) ──────────────────────────────────────

// GET /vouchers/active — Danh sách vouchers đang hiệu lực mà user có thể dùng
router.get('/active', voucherController.getActiveVouchers);

// POST /vouchers/apply — Áp dụng voucher, tính discount amount
router.post('/apply', verifyToken, validate(applyVoucherSchema), voucherController.applyVoucher);

export default router;
