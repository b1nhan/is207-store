import { getDB } from '../database/connection.js';

class OrderRepository {
  /**
   * Tìm đơn hàng theo ID (kèm shipping address snapshot)
   */
  async findById(orderId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        o.order_id,
        o.user_id,
        o.profile_id,
        o.voucher_id,
        o.voucher_code_snapshot,
        o.campaign_id,
        o.order_date,
        o.status,
        o.subtotal,
        o.discount_total,
        o.campaign_discount_total,
        o.shipping_fee,
        o.total_amount,
        o.payment_status,
        o.cancelled_by,
        o.created_at,
        osa.receiver_name,
        osa.receiver_phone,
        osa.full_address AS shipping_address
       FROM orders o
       LEFT JOIN order_shipping_address osa ON o.order_id = osa.order_id
       WHERE o.order_id = ?`,
      [orderId],
    );
    return rows[0] || null;
  }

  /**
   * Tìm đơn hàng theo ID và user (ownership check)
   */
  async findByIdAndUser(orderId, userId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        o.order_id,
        o.user_id,
        o.profile_id,
        o.voucher_id,
        o.voucher_code_snapshot,
        o.campaign_id,
        o.order_date,
        o.status,
        o.subtotal,
        o.discount_total,
        o.campaign_discount_total,
        o.shipping_fee,
        o.total_amount,
        o.payment_status,
        o.cancelled_by,
        o.created_at,
        osa.receiver_name,
        osa.receiver_phone,
        osa.full_address AS shipping_address
       FROM orders o
       LEFT JOIN order_shipping_address osa ON o.order_id = osa.order_id
       WHERE o.order_id = ? AND o.user_id = ?`,
      [orderId, userId],
    );
    return rows[0] || null;
  }

  /**
   * Lấy tất cả đơn hàng của một user, có pagination
   */
  async findAllByUser(userId, { limit = 10, offset = 0 } = {}) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        o.order_id,
        o.order_date,
        o.status,
        o.subtotal,
        o.discount_total,
        o.campaign_discount_total,
        o.shipping_fee,
        o.total_amount,
        o.payment_status,
        osa.receiver_name,
        osa.receiver_phone,
        osa.full_address AS shipping_address
       FROM orders o
       LEFT JOIN order_shipping_address osa ON o.order_id = osa.order_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM orders WHERE user_id = ?`,
      [userId],
    );

    return { rows, total };
  }

  /**
   * Tạo đơn hàng mới — trả về orderId vừa tạo.
   * Phải được gọi trong cùng transaction connection để đảm bảo atomicity.
   * @param {object} orderDto
   * @param {object} conn - MySQL connection từ transaction
   */
  async create(orderDto, conn) {
    const [result] = await conn.query(
      `INSERT INTO orders
        (user_id, profile_id, voucher_id, voucher_code_snapshot, campaign_id,
         subtotal, discount_total, campaign_discount_total, shipping_fee, total_amount, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [
        orderDto.user_id,
        orderDto.profile_id || null,
        orderDto.voucher_id || null,
        orderDto.voucher_code_snapshot || null,
        orderDto.campaign_id || null,
        orderDto.subtotal,
        orderDto.discount_total || 0,
        orderDto.campaign_discount_total || 0,
        orderDto.shipping_fee || 0,
        orderDto.total_amount,
      ],
    );
    return result.insertId;
  }

  /**
   * Cập nhật trạng thái đơn hàng và trạng thái thanh toán tương ứng
   * @param {number} orderId
   * @param {string} status - ORDER_STATUS value
   * @param {string|null} cancelledBy - 'USER' | 'ADMIN' | null
   * @param {object|null} conn - optional connection (dùng trong transaction)
   */
  async updateStatus(orderId, status, cancelledBy = null, conn = null) {
    const db = conn || getDB();
    
    let paymentStatus = null;
    if (status === 'pending' || status === 'confirmed') {
      paymentStatus = 'pending';
    } else if (status === 'delivered') {
      paymentStatus = 'paid';
    } else if (status === 'cancelled') {
      paymentStatus = 'cancelled';
    }

    if (cancelledBy !== null) {
      if (paymentStatus) {
        await db.query(
          `UPDATE orders SET status = ?, cancelled_by = ?, payment_status = ? WHERE order_id = ?`,
          [status, cancelledBy, paymentStatus, orderId],
        );
      } else {
        await db.query(
          `UPDATE orders SET status = ?, cancelled_by = ? WHERE order_id = ?`,
          [status, cancelledBy, orderId],
        );
      }
    } else {
      if (paymentStatus) {
        await db.query(
          `UPDATE orders SET status = ?, payment_status = ? WHERE order_id = ?`,
          [status, paymentStatus, orderId],
        );
      } else {
        await db.query(
          `UPDATE orders SET status = ? WHERE order_id = ?`,
          [status, orderId],
        );
      }
    }
  }
}

export default new OrderRepository();
