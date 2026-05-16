import { getDB } from '../database/connection.js';
//nhiệm vụ của phần này là đếm xem các brand có bao nhiêu sp
//ko quan tâm logic hiển thị, chỉ cần lấy đúng số liệu

class BrandRepository {
  async findAll() {
    const query = `
    SELECT 
        b.brand_id,
        b.brand_name,
        COUNT(p.product_id) as product_count
      FROM brands b
      LEFT JOIN products p ON b.brand_id = p.brand_id AND p.status = 1
      GROUP BY b.brand_id, b.brand_name
      ORDER BY b.brand_name
  `;
    const db = getDB();
    const [rows] = await db.query(query);
    return { items: rows };
  }

  async findByID(brand_id, { limit, offset, sortBy, sortOrder }) {
    let query = `
      SELECT p.*, b.brand_id, pi.image_url as thumbnail
      FROM products p
      INNER JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.status = 1 AND b.brand_id = ?
    `;
    const params = [brand_id];

    // Sort mapping to prevent SQL Injection
    const allowedSortBy = ['price', 'createdAt', 'name'];
    const sortMap = {
      price: 'base_price',
      createdAt: 'created_at',
      name: 'product_name',
    };
    const finalSortBy = allowedSortBy.includes(sortBy)
      ? sortMap[sortBy]
      : 'p.created_at';
    const finalSortOrder = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${finalSortBy} ${finalSortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const db = getDB();
    const [rows] = await db.query(query, params);

    // Query total for pagination
    const [totalRows] = await db.query(
      `SELECT COUNT(*) as total FROM products p WHERE p.status = 1 AND p.brand_id = ?`,
      [brand_id],
    );

    return { items: rows, total: totalRows[0].total };
  }

  // ─── Admin write operations ───────────────────────────────────────────────────

  async findByIdAdmin(brand_id) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT brand_id, brand_name,
              (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.brand_id) as product_count
       FROM brands b
       WHERE b.brand_id = ?`,
      [brand_id],
    );
    return rows[0] || null;
  }

  async findByName(brand_name, excludeId = null) {
    const db = getDB();
    let query = `SELECT brand_id FROM brands WHERE brand_name = ?`;
    const params = [brand_name];
    if (excludeId) {
      query += ` AND brand_id != ?`;
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows[0] || null;
  }

  async create({ brand_name }) {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO brands (brand_name) VALUES (?)`,
      [brand_name],
    );
    return this.findByIdAdmin(result.insertId);
  }

  async update(brand_id, { brand_name }) {
    const db = getDB();
    await db.query(`UPDATE brands SET brand_name = ? WHERE brand_id = ?`, [brand_name, brand_id]);
    return this.findByIdAdmin(brand_id);
  }

  async delete(brand_id) {
    const db = getDB();
    await db.query(`DELETE FROM brands WHERE brand_id = ?`, [brand_id]);
  }
}

export default new BrandRepository();
