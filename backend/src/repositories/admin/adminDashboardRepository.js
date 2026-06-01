import { getDB } from '../../database/connection.js';

class AdminDashboardRepository {
  /**
   * Get summary statistics
   */
  async getSummary() {
    const db = getDB();
    const [[result]] = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT SUM(total_amount) FROM orders WHERE status = 'delivered') AS total_revenue,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM brands) AS total_brands,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM vouchers) AS total_vouchers,
        (SELECT COUNT(*) FROM campaigns) AS total_campaigns`
    );

    return {
      total_users: result.total_users || 0,
      total_orders: result.total_orders || 0,
      total_revenue: result.total_revenue || 0,
      pending_orders: result.pending_orders || 0,
      total_products: result.total_products || 0,
      total_brands: result.total_brands || 0,
      total_categories: result.total_categories || 0,
      total_vouchers: result.total_vouchers || 0,
      total_campaigns: result.total_campaigns || 0,
    };
  }

  /**
   * Get revenue over time
   * @param {object} params
   * @param {string} params.from - Date string (YYYY-MM-DD)
   * @param {string} params.to - Date string (YYYY-MM-DD)
   * @param {string} params.groupBy - 'day' or 'month'
   */
  async getRevenue({ from, to, groupBy = 'day' }) {
    const db = getDB();
    const format = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

    let query = `
      SELECT
        DATE_FORMAT(order_date, ?) AS date,
        SUM(total_amount) AS revenue,
        COUNT(*) AS orders
      FROM orders
      WHERE status = 'delivered'
    `;
    const queryParams = [format];

    if (from) {
      query += ` AND DATE(order_date) >= ?`;
      queryParams.push(from);
    }
    if (to) {
      query += ` AND DATE(order_date) <= ?`;
      queryParams.push(to);
    }

    query += ` GROUP BY date ORDER BY date`;

    const [rows] = await db.query(query, queryParams);
    return rows;
  }

  /**
   * Get top products by sales
   * @param {object} params
   * @param {number} params.limit - Number of top products
   * @param {string} params.from - Date string (YYYY-MM-DD)
   * @param {string} params.to - Date string (YYYY-MM-DD)
   */
  async getTopProducts({ limit = 10, from, to }) {
    const db = getDB();

    let query = `
      SELECT
        p.product_id,
        p.product_name,
        p.slug,
        SUM(oi.quantity) AS sold_quantity,
        SUM(oi.line_total) AS total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      JOIN product_variants pv ON oi.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE o.status = 'delivered'
    `;
    const queryParams = [];

    if (from) {
      query += ` AND DATE(o.order_date) >= ?`;
      queryParams.push(from);
    }
    if (to) {
      query += ` AND DATE(o.order_date) <= ?`;
      queryParams.push(to);
    }

    query += `
      GROUP BY p.product_id, p.product_name, p.slug
      ORDER BY sold_quantity DESC
      LIMIT ?
    `;
    queryParams.push(Number(limit));

    const [rows] = await db.query(query, queryParams);
    return rows;
  }
}

export default new AdminDashboardRepository();
