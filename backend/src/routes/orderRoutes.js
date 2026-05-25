import { Router } from 'express';
import orderController from '../controllers/orderController.js';
import verifyToken from '../middlewares/verifyToken.js';
import validate from '../middlewares/validate.js';
import { checkoutSchema } from '../validations/orderValidations.js';

const router = Router();

// Tất cả order routes đều yêu cầu đăng nhập
router.use(verifyToken);

/**
 * POST /orders/checkout/preview
 * Tính toán giá, kiểm tra chênh lệch giá trước khi đặt hàng.
 */
router.post('/checkout/preview', orderController.previewOrder);

/**
 * POST /orders/checkout
 * Đặt hàng từ giỏ hàng — body được validate qua checkoutSchema
 */
router.post('/checkout', validate(checkoutSchema), orderController.placeOrder);

/**
 * GET /orders
 * Lấy danh sách đơn hàng của user (có pagination: ?page=1&limit=10)
 */
router.get('/', orderController.getMyOrders);

/**
 * GET /orders/:id
 * Lấy chi tiết một đơn hàng (kèm items, shipping info)
 */
router.get('/:id', orderController.getOrderById);

/**
 * POST /orders/:id/cancel
 * User hủy đơn hàng (chỉ được khi status = pending)
 */
router.post('/:id/cancel', orderController.cancelOrder);

export default router;
