import { getDB } from '../../database/connection.js';

class AdminProductRepository {
  /**
   * Lấy tất cả sản phẩm (kể cả INACTIVE), hỗ trợ filter + pagination.
   * @param {{ limit, offset, search, status, category_id, brand_id }} params
   */
  async findAll({ limit, offset, search, status, category_id, brand_id }) {
    let query = `
      SELECT
        p.product_id, p.product_name, p.slug, p.base_price,
        p.gender, p.material, p.status,
        p.created_at, p.updated_at,
        c.category_id, c.category_name, c.slug AS category_slug,
        b.brand_id, b.brand_name,
        pi.image_url AS thumbnail,
        COALESCE((
          SELECT SUM(pv.stock_quantity)
          FROM product_variants pv
          WHERE pv.product_id = p.product_id AND pv.status = 1
        ), 0) AS total_stock,
        COALESCE((
          SELECT SUM(oi.quantity)
          FROM order_items oi
          JOIN product_variants pv ON oi.variant_id = pv.variant_id
          JOIN orders o ON oi.order_id = o.order_id
          WHERE pv.product_id = p.product_id AND o.status != 'cancelled'
        ), 0) AS total_sold
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND p.product_name LIKE ?`;
      params.push(`%${search}%`);
    }
    if (status !== undefined && status !== null && status !== '') {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    if (category_id) {
      query += ` AND p.category_id = ?`;
      params.push(category_id);
    }
    if (brand_id) {
      query += ` AND p.brand_id = ?`;
      params.push(brand_id);
    }

    const filterParams = [...params];

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const db = getDB();
    const [rows] = await db.query(query, params);

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      WHERE 1=1
      ${search ? 'AND p.product_name LIKE ?' : ''}
      ${status !== undefined && status !== null && status !== '' ? 'AND p.status = ?' : ''}
      ${category_id ? 'AND p.category_id = ?' : ''}
      ${brand_id ? 'AND p.brand_id = ?' : ''}
    `;
    const [totalRows] = await db.query(countQuery, filterParams);

    return { items: rows, total: totalRows[0].total };
  }

  /**
   * Lấy chi tiết sản phẩm theo id (kể cả INACTIVE).
   */
  async findById(id) {
    const db = getDB();
    const [products] = await db.query(
      `
      SELECT
        p.*,
        c.category_id, c.category_name, c.slug AS category_slug,
        b.brand_id, b.brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      WHERE p.product_id = ?
      `,
      [id],
    );

    if (products.length === 0) return null;

    const [images] = await db.query(
      `SELECT image_id, image_url, public_id, is_primary, sort_order
       FROM product_images
       WHERE product_id = ?
       ORDER BY sort_order ASC`,
      [id],
    );

    const [variants] = await db.query(
      `SELECT variant_id, size, color, stock_quantity, variant_price, sku, status
       FROM product_variants
       WHERE product_id = ?
       ORDER BY variant_id ASC`,
      [id],
    );

    return { ...products[0], images, variants };
  }

  /**
   * Kiểm tra slug đã tồn tại chưa (dùng cho create/update).
   * @param {string} slug
   * @param {number|null} excludeId - id sản phẩm cần bỏ qua khi update
   */
  async findBySlug(slug, excludeId = null) {
    const db = getDB();
    let query = `SELECT product_id FROM products WHERE slug = ?`;
    const params = [slug];
    if (excludeId) {
      query += ` AND product_id != ?`;
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows[0] || null;
  }

  /**
   * Tạo sản phẩm mới.
   * @param {{ product_name, product_description, material, gender, base_price, brand_id, category_id, slug }} dto
   * @returns {number} insertId
   */
  async create(dto) {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO products
        (product_name, product_description, material, gender, base_price, brand_id, category_id, slug, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        dto.product_name,
        dto.product_description ?? null,
        dto.material ?? null,
        dto.gender,
        dto.base_price,
        dto.brand_id ?? null,
        dto.category_id ?? null,
        dto.slug,
      ],
    );
    return result.insertId;
  }

  /**
   * Cập nhật thông tin sản phẩm.
   */
  async update(id, dto) {
    const fields = [];
    const params = [];

    const updatable = [
      'product_name',
      'product_description',
      'material',
      'gender',
      'base_price',
      'brand_id',
      'category_id',
      'slug',
    ];

    for (const key of updatable) {
      if (dto[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(dto[key]);
      }
    }

    if (fields.length === 0) return;

    params.push(id);
    const db = getDB();
    await db.query(`UPDATE products SET ${fields.join(', ')} WHERE product_id = ?`, params);
  }

  /**
   * Chỉ cập nhật trạng thái (0 = INACTIVE, 1 = ACTIVE).
   */
  async updateStatus(id, status) {
    const db = getDB();
    await db.query(`UPDATE products SET status = ? WHERE product_id = ?`, [status, id]);
  }
}

export default new AdminProductRepository();
