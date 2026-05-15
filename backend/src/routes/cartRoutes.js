import { Router } from 'express';
import cartController from '../controllers/cartController.js';
import verifyToken from '../middlewares/verifyToken.js';
import validate from '../middlewares/validate.js';
import { addCartItemSchema, updateCartItemSchema } from '../validations/cartValidations.js';

const router = Router();

// Tất cả cart endpoints đều yêu cầu đăng nhập
router.use(verifyToken);

// GET /cart — Lấy giỏ hàng
router.get('/', cartController.getCart);

// POST /cart — Thêm sản phẩm vào giỏ
router.post('/', validate(addCartItemSchema), cartController.addToCart);

// PUT /cart/:itemId — Cập nhật số lượng
router.put('/:itemId', validate(updateCartItemSchema), cartController.updateCartItem);

// DELETE /cart/:itemId — Xóa một item
router.delete('/:itemId', cartController.removeCartItem);

// DELETE /cart — Xóa toàn bộ giỏ hàng
router.delete('/', cartController.clearCart);

export default router;
