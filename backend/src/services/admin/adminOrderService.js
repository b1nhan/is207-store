import { getDB } from '../../database/connection.js';
import adminOrderRepository from '../../repositories/admin/adminOrderRepository.js';
import orderRepository from '../../repositories/orderRepository.js';
import orderItemRepository from '../../repositories/orderItemRepository.js';
import AppError from '../../utils/AppError.js';
import { ERROR_CODES } from '../../constants/errorCode.js';
import ORDER_STATUS from '../../constants/orderStatus.js';
import { getPagination, getPaginationData } from '../../utils/pagination.js';

const VALID_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.SHIPPING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPING]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.RETURNED]: [],
};

class AdminOrderService {
  /**
   * Lấy danh sách đơn hàng (có filter)
   */
  async getAllOrders({ page = 1, limit = 10, status, user_id, from_date, to_date }) {
    const { limit: lim, offset, currentPage } = getPagination(page, limit);
    const { rows, total } = await adminOrderRepository.findAll({
      limit: lim,
      offset,
      status,
      user_id,
      from_date,
      to_date,
    });
    const pagination = getPaginationData(total, currentPage, lim);
    return { orders: rows, pagination };
  }

  /**
   * Lấy chi tiết đơn hàng
   */
  async getOrderById(orderId) {
    const order = await adminOrderRepository.findById(orderId);
    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404, ERROR_CODES.ORDER.NOT_FOUND);
    }
    const items = await orderItemRepository.findByOrderId(orderId);

    return {
      ...order,
      subtotal: Number(order.subtotal),
      discount_total: Number(order.discount_total),
      shipping_fee: Number(order.shipping_fee),
      total_amount: Number(order.total_amount),
      items: items.map((item) => ({
        ...item,
        unit_price_snapshot: Number(item.unit_price_snapshot),
        line_total: Number(item.line_total),
      })),
    };
  }

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(orderId, newStatus) {
    const order = await adminOrderRepository.findById(orderId);
    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404, ERROR_CODES.ORDER.NOT_FOUND);
    }

    const currentStatus = order.status;
    const validNextStatuses = VALID_TRANSITIONS[currentStatus] || [];

    if (!validNextStatuses.includes(newStatus)) {
      throw new AppError(
        `Không thể chuyển trạng thái từ '${currentStatus}' sang '${newStatus}'`,
        400,
        ERROR_CODES.ORDER.INVALID_STATUS_TRANSITION,
      );
    }

    const db = getDB();
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      let cancelledBy = null;
      if (newStatus === ORDER_STATUS.CANCELLED) {
        cancelledBy = 'ADMIN';
        // Restore stock
        const items = await orderItemRepository.findByOrderId(orderId);
        for (const item of items) {
          await conn.query(
            `UPDATE product_variants SET stock_quantity = stock_quantity + ? WHERE variant_id = ?`,
            [item.quantity, item.variant_id]
          );
        }
      }

      await orderRepository.updateStatus(orderId, newStatus, cancelledBy, conn);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return this.getOrderById(orderId);
  }
}

export default new AdminOrderService();
