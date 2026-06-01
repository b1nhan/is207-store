import { getDB } from '../database/connection.js';

class OrderItemRepository {
  /**
   * Tạo nhiều order_items trong một lần gọi (bulk insert).
   * Phải được gọi trong cùng transaction connection để đảm bảo atomicity.
   *
   * @param {Array<object>} items - Array of { order_id, variant_id, quantity, unit_price_snapshot, line_total, product_name_snapshot, size_snapshot, color_snapshot }
   * @param {object} conn - MySQL connection từ transaction
   */
  async createMany(items, conn) {
    if (!items || items.length === 0) return;

    const values = items.map((item) => [
      item.order_id,
      item.variant_id,
      item.quantity,
      item.unit_price_snapshot,
      item.line_total,
      item.product_name_snapshot || null,
      item.size_snapshot || null,
      item.color_snapshot || null,
    ]);

    await conn.query(
      `INSERT INTO order_items
        (order_id, variant_id, quantity, unit_price_snapshot, line_total,
         product_name_snapshot, size_snapshot, color_snapshot)
       VALUES ?`,
      [values],
    );
  }

  /**
   * Lấy tất cả items của một đơn hàng (kèm snapshot fields)
   */
  async findByOrderId(orderId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        oi.order_item_id,
        oi.order_id,
        oi.variant_id,
        oi.quantity,
        oi.unit_price_snapshot,
        oi.line_total,
        oi.product_name_snapshot,
        oi.size_snapshot,
        oi.color_snapshot,
        p.product_id,
        p.slug
       FROM order_items oi
       JOIN product_variants pv ON oi.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE oi.order_id = ?
       ORDER BY oi.order_item_id`,
      [orderId],
    );
    return rows;
  }
}

export default new OrderItemRepository();
