import { getDB } from '../database/connection.js';

class ProductRepository {
  async findAll({
    limit,
    offset,
    search,
    category,
    brand_id,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  }) {
    let query = `
      SELECT p.*, c.slug as category_slug, b.brand_name, pi.image_url as thumbnail
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.status = 1
    `;
    const params = [];

    if (search) {
      query += ` AND p.product_name LIKE ?`;
      params.push(`%${search}%`);
    }
    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }
    if (brand_id) {
      query += ` AND p.brand_id = ?`;
      params.push(brand_id);
    }
    if (gender) {
      query += ` AND p.gender = ?`;
      params.push(gender);
    }
    if (minPrice) {
      query += ` AND p.base_price >= ?`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND p.base_price <= ?`;
      params.push(maxPrice);
    }

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
      `SELECT COUNT(*) as total FROM products WHERE status = 1`,
      [],
    );

    return { items: rows, total: totalRows[0].total };
  }

  async findById(id) {
    const db = getDB();
    const [products] = await db.query(
      `
      SELECT p.*, 
             b.brand_id, b.brand_name,
             c.category_id, c.category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ? AND p.status = 1
    `,
      [id],
    );

    if (products.length === 0) return null;

    const [images] = await db.query(
      `SELECT image_id, image_url as url, is_primary FROM product_images WHERE product_id = ? ORDER BY sort_order ASC`,
      [id],
    );
    const [variants] = await db.query(
      `SELECT variant_id, size, color, stock_quantity, variant_price FROM product_variants WHERE product_id = ? AND status = 1`,
      [id],
    );

    return { ...products[0], images, variants };
  }

  async searchAutocomplete(q) {
    const query = `
      SELECT p.product_id, p.product_name, pi.image_url as thumbnail
      FROM products p
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.status = 1 AND p.product_name LIKE ?
      LIMIT 10
    `;
    const db = getDB();
    const [rows] = await db.query(query, [`%${q}%`]);
    return rows;
  }
}

export default new ProductRepository();
