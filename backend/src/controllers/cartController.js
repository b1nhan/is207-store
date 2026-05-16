import cartService from '../services/cartService.js';
import { sendSuccess } from '../utils/response.js';

class CartController {
  /**
   * GET /cart
   * Lấy giỏ hàng của user đang đăng nhập
   */
  getCart = async (req, res, next) => {
    try {
      const result = await cartService.getCart(req.user.user_id);
      sendSuccess(res, {
        data: result,
        message: 'Lấy giỏ hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /cart
   * Thêm sản phẩm vào giỏ hàng
   * Body: { variant_id, quantity }
   */
  addToCart = async (req, res, next) => {
    try {
      const result = await cartService.addToCart(req.user.user_id, req.body);
      sendSuccess(res, {
        data: result,
        message: 'Thêm sản phẩm vào giỏ hàng thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /cart/:itemId
   * Cập nhật số lượng item trong giỏ
   * Body: { quantity }
   */
  updateCartItem = async (req, res, next) => {
    try {
      const result = await cartService.updateCartItem(
        req.user.user_id,
        Number(req.params.itemId),
        req.body,
      );
      sendSuccess(res, {
        data: result,
        message: 'Cập nhật giỏ hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /cart/:itemId
   * Xóa một item khỏi giỏ hàng
   */
  removeCartItem = async (req, res, next) => {
    try {
      const result = await cartService.removeCartItem(
        req.user.user_id,
        Number(req.params.itemId),
      );
      sendSuccess(res, {
        data: result,
        message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /cart
   * Xóa toàn bộ items trong giỏ hàng
   */
  clearCart = async (req, res, next) => {
    try {
      const result = await cartService.clearCart(req.user.user_id);
      sendSuccess(res, {
        data: result,
        message: 'Xóa toàn bộ giỏ hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new CartController();
