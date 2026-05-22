import { getDB } from '../database/connection.js';

class CategoryRepository {
  async findAll() {
    const query = `
    SELECT 
      c.category_id,
      c.category_name,
      c.slug,
      COUNT(p.product_id) as product_count
    FROM categories c
    LEFT JOIN products p 
      ON p.category_id = c.category_id AND p.status = 1
    GROUP BY c.category_id
    ORDER BY c.category_name
  `;
    const db = getDB();
    const [rows] = await db.query(query);
    return { items: rows };
  }

  async findBySlug(slug, { limit, offset, sortBy, sortOrder }) {
    let query = `
      SELECT p.*, c.slug as category_slug, b.brand_name, pi.image_url as thumbnail
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.status = 1
    `;
    const params = [];

    query += ` AND c.slug = ?`;
    params.push(slug);

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
      `SELECT COUNT(*) as total 
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.category_id
     WHERE p.status = 1 AND c.slug = ?`,
      [slug],
    );

    return { items: rows, total: totalRows[0].total };
  }

  async findCategoryBySlug(slug) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT category_id, category_name, slug 
     FROM categories 
     WHERE slug = ?`,
      [slug],
    );
    return rows[0] || null;
  }

  // ─── Admin write operations ───────────────────────────────────────────────────

  async findById(category_id) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT category_id, category_name, slug,
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.category_id) as product_count
       FROM categories c
       WHERE c.category_id = ?`,
      [category_id],
    );
    return rows[0] || null;
  }

  async findByName(category_name, excludeId = null) {
    const db = getDB();
    let query = `SELECT category_id FROM categories WHERE category_name = ?`;
    const params = [category_name];
    if (excludeId) {
      query += ` AND category_id != ?`;
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows[0] || null;
  }

  async findBySlugAdmin(slug, excludeId = null) {
    const db = getDB();
    let query = `SELECT category_id FROM categories WHERE slug = ?`;
    const params = [slug];
    if (excludeId) {
      query += ` AND category_id != ?`;
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows[0] || null;
  }

  async create({ category_name, slug }) {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO categories (category_name, slug) VALUES (?, ?)`,
      [category_name, slug],
    );
    return this.findById(result.insertId);
  }

  async update(category_id, { category_name, slug }) {
    const db = getDB();
    const fields = [];
    const params = [];
    if (category_name !== undefined) {
      fields.push('category_name = ?');
      params.push(category_name);
    }
    if (slug !== undefined) {
      fields.push('slug = ?');
      params.push(slug);
    }
    if (fields.length === 0) return this.findById(category_id);
    params.push(category_id);
    await db.query(`UPDATE categories SET ${fields.join(', ')} WHERE category_id = ?`, params);
    return this.findById(category_id);
  }

  async delete(category_id) {
    const db = getDB();
    await db.query(`DELETE FROM categories WHERE category_id = ?`, [category_id]);
  }
}

export default new CategoryRepository();
