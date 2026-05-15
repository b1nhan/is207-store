import { getDB } from '../../database/connection.js';

class AdminOrderRepository {
  /**
   * Lấy tất cả đơn hàng cho admin (có filter)
   */
  async findAll({ limit = 10, offset = 0, status, user_id, from_date, to_date } = {}) {
    const db = getDB();
    let query = `SELECT o.*, osa.receiver_name, osa.receiver_phone, osa.full_address, u.email as user_email
                 FROM orders o
                 LEFT JOIN order_shipping_address osa ON o.order_id = osa.order_id
                 LEFT JOIN users u ON o.user_id = u.user_id
                 WHERE 1=1`;
    const params = [];

    if (status) {
      query += ` AND o.status = ?`;
      params.push(status);
    }
    if (user_id) {
      query += ` AND o.user_id = ?`;
      params.push(user_id);
    }
    if (from_date) {
      query += ` AND o.order_date >= ?`;
      params.push(from_date);
    }
    if (to_date) {
      query += ` AND o.order_date <= ?`;
      params.push(to_date);
    }

    // Build count query based on the same conditions
    const countQuery = `SELECT COUNT(*) AS total FROM orders o WHERE 1=1` + query.split('WHERE 1=1')[1];
    const countParams = [...params];

    query += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [[{ total }]] = await db.query(countQuery, countParams);

    return { rows, total };
  }

  /**
   * Lấy chi tiết đơn hàng cho admin
   */
  async findById(orderId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        o.*,
        osa.receiver_name,
        osa.receiver_phone,
        osa.full_address AS shipping_address,
        u.email AS user_email,
        u.full_name AS user_full_name
       FROM orders o
       LEFT JOIN order_shipping_address osa ON o.order_id = osa.order_id
       LEFT JOIN users u ON o.user_id = u.user_id
       WHERE o.order_id = ?`,
      [orderId],
    );
    return rows[0] || null;
  }
}

export default new AdminOrderRepository();
