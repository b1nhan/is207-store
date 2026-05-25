import orderService from '../services/orderService.js';
import { sendSuccess } from '../utils/response.js';

class OrderController {
  /**
   * POST /orders/checkout/preview
   * Lấy preview cho đơn hàng (để check giá mới nhất)
   */
  previewOrder = async (req, res, next) => {
    try {
      const result = await orderService.previewOrder(req.user.user_id, req.body);
      sendSuccess(res, {
        data: result,
        message: 'Lấy thông tin preview đơn hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /orders/checkout
   * Đặt hàng từ giỏ hàng hiện tại của user.
   * Body: { address_id?, voucher_code?, receiver_name, receiver_phone, full_address }
   */
  placeOrder = async (req, res, next) => {
    try {
      const order = await orderService.placeOrder(req.user.user_id, req.body);
      sendSuccess(res, {
        data: order,
        message: 'Đặt hàng thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /orders
   * Lấy danh sách đơn hàng của user đang đăng nhập (có pagination).
   * Query params: page, limit
   */
  getMyOrders = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await orderService.getMyOrders(req.user.user_id, { page, limit });
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách đơn hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /orders/:id
   * Lấy chi tiết đơn hàng (kèm items).
   * Kiểm tra ownership — chỉ lấy được đơn của chính mình.
   */
  getOrderById = async (req, res, next) => {
    try {
      const order = await orderService.getOrderById(
        req.user.user_id,
        Number(req.params.id),
      );
      sendSuccess(res, {
        data: order,
        message: 'Lấy chi tiết đơn hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /orders/:id/cancel
   * User hủy đơn hàng — chỉ được khi status = 'pending'.
   * Restore stock tự động.
   */
  cancelOrder = async (req, res, next) => {
    try {
      const order = await orderService.cancelOrder(
        req.user.user_id,
        Number(req.params.id),
      );
      sendSuccess(res, {
        data: order,
        message: 'Hủy đơn hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();
