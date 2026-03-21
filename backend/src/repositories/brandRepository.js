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
}

export default new BrandRepository();
