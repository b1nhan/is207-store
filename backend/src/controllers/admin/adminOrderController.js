import adminOrderService from '../../services/admin/adminOrderService.js';
import { sendSuccess } from '../../utils/response.js';

class AdminOrderController {
  /**
   * GET /admin/orders
   */
  async getAllOrders(req, res, next) {
    try {
      const { page, limit, status, user_id, from_date, to_date } = req.query;
      const result = await adminOrderService.getAllOrders({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 10,
        status,
        user_id: user_id ? parseInt(user_id, 10) : undefined,
        from_date,
        to_date,
      });
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/orders/:id
   */
  async getOrderById(req, res, next) {
    try {
      const orderId = parseInt(req.params.id, 10);
      const order = await adminOrderService.getOrderById(orderId);
      sendSuccess(res, { data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /admin/orders/:id/status
   */
  async updateOrderStatus(req, res, next) {
    try {
      const orderId = parseInt(req.params.id, 10);
      const { status } = req.body;
      const updatedOrder = await adminOrderService.updateOrderStatus(orderId, status);
      sendSuccess(res, { data: updatedOrder, message: 'Cập nhật trạng thái đơn hàng thành công' });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminOrderController();
