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

    // Lưu filterParams (chỉ cho WHERE) trước khi thêm LIMIT/OFFSET
    const filterParams = [...params];

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

    // Count query áp dụng cùng bộ filter (không có LIMIT/OFFSET)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      WHERE p.status = 1
      ${search ? 'AND p.product_name LIKE ?' : ''}
      ${category ? 'AND c.slug = ?' : ''}
      ${brand_id ? 'AND p.brand_id = ?' : ''}
      ${gender ? 'AND p.gender = ?' : ''}
      ${minPrice ? 'AND p.base_price >= ?' : ''}
      ${maxPrice ? 'AND p.base_price <= ?' : ''}
    `;
    const [totalRows] = await db.query(countQuery, filterParams);

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
      `SELECT variant_id, size, color, stock_quantity, variant_price, sku FROM product_variants WHERE product_id = ? AND status = 1`,
      [id],
    );

    return { ...products[0], images, variants };
  }

  async findBySlug(slug) {
    const db = getDB();
    const [products] = await db.query(
      `
      SELECT p.*, 
             b.brand_id, b.brand_name,
             c.category_id, c.category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.slug = ? AND p.status = 1
    `,
      [slug],
    );

    if (products.length === 0) return null;

    const productId = products[0].product_id;

    const [images] = await db.query(
      `SELECT image_id, image_url as url, is_primary FROM product_images WHERE product_id = ? ORDER BY sort_order ASC`,
      [productId],
    );
    const [variants] = await db.query(
      `SELECT variant_id, size, color, stock_quantity, variant_price, sku FROM product_variants WHERE product_id = ? AND status = 1`,
      [productId],
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

  /**
   * Tìm sản phẩm liên quan theo 4 mức ưu tiên.
   * @param {number} id       - product_id của sản phẩm hiện tại
   * @param {number} limit    - số lượng tối đa trả về
   */
  async findRelated(id, limit = 8) {
    const db = getDB();

    // Lấy brand_id, category_id, base_price của sản phẩm hiện tại
    const [[current]] = await db.query(
      `SELECT brand_id, category_id, base_price FROM products WHERE product_id = ? AND status = 1`,
      [id],
    );

    if (!current) return [];

    const { brand_id, category_id, base_price } = current;
    const priceMin = base_price * 0.75;
    const priceMax = base_price * 1.25;

    const baseSelect = `
      SELECT
        p.product_id,
        p.product_name,
        p.slug,
        p.base_price,
        b.brand_name,
        c.slug  AS category_slug,
        p.gender,
        pi.image_url AS thumbnail,
        p.status,
        p.created_at
      FROM products p
      LEFT JOIN brands b          ON p.brand_id = b.brand_id
      LEFT JOIN categories c      ON p.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.status = 1 AND p.product_id != ?
    `;

    const collected = [];
    const seenIds = new Set();

    const runQuery = async (extraWhere, params, priority) => {
      const remaining = limit - collected.length;
      if (remaining <= 0) return;
      const sql = `${baseSelect} AND ${extraWhere} ORDER BY p.created_at DESC LIMIT ?`;
      const [rows] = await db.query(sql, [...params, remaining]);
      for (const row of rows) {
        if (!seenIds.has(row.product_id)) {
          seenIds.add(row.product_id);
          collected.push({ ...row, _priority: priority });
        }
      }
    };

    // Priority 1 — same brand AND same category
    await runQuery(
      `p.brand_id = ? AND p.category_id = ?`,
      [id, brand_id, category_id],
      1,
    );

    // Priority 2 — same category (any brand)
    await runQuery(`p.category_id = ?`, [id, category_id], 2);

    // Priority 3 — same brand (any category)
    await runQuery(`p.brand_id = ?`, [id, brand_id], 3);

    // Priority 4 — price range ±25%
    await runQuery(
      `p.base_price BETWEEN ? AND ?`,
      [id, priceMin, priceMax],
      4,
    );

    // Strip internal _priority field before returning
    return collected.map(({ _priority, ...rest }) => rest);
  }

  async getNewArrivals(limit = 10) {
    const db = getDB();
    const query = `
      SELECT
        p.product_id, p.product_name, p.slug, p.base_price, p.gender,
        pi.image_url AS thumbnail, b.brand_name, c.category_name, c.slug AS category_slug,
        (SELECT MIN(variant_price) FROM product_variants pv WHERE pv.product_id = p.product_id) AS lowest_variant_price
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.status = 1
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    const [rows] = await db.query(query, [Number(limit)]);
    return rows;
  }

  async getBestSellers(limit = 10) {
    const db = getDB();
    const query = `
      SELECT
        p.product_id, p.product_name, p.slug, p.base_price, p.gender,
        pi.image_url AS thumbnail, b.brand_name, c.category_name, c.slug AS category_slug,
        (SELECT MIN(variant_price) FROM product_variants pv WHERE pv.product_id = p.product_id) AS lowest_variant_price,
        SUM(oi.quantity) AS total_sold
      FROM products p
      LEFT JOIN product_variants pv ON p.product_id = pv.product_id
      JOIN order_items oi ON pv.variant_id = oi.variant_id
      JOIN orders o ON oi.order_id = o.order_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.status = 1 AND o.status != 'cancelled'
      GROUP BY 
        p.product_id, 
        p.product_name, 
        p.base_price, 
        p.gender,
        pi.image_url, 
        b.brand_name, 
        c.category_name, 
        c.slug
      ORDER BY total_sold DESC
      LIMIT ?
    `;
    const [rows] = await db.query(query, [Number(limit)]);
    return rows;
  }

  async getHotProducts(limit = 10) {
    const db = getDB();
    const query = `
      SELECT
        p.product_id, p.product_name, p.slug, p.base_price, p.gender,
        pi.image_url AS thumbnail, b.brand_name, c.category_name, c.slug AS category_slug,
        (SELECT MIN(variant_price) FROM product_variants pv WHERE pv.product_id = p.product_id) AS lowest_variant_price,
        SUM(oi.quantity) AS total_sold
      FROM products p
      LEFT JOIN product_variants pv ON p.product_id = pv.product_id
      JOIN order_items oi ON pv.variant_id = oi.variant_id
      JOIN orders o ON oi.order_id = o.order_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE p.status = 1 AND o.status != 'cancelled' AND o.order_date >= NOW() - INTERVAL 14 DAY
      GROUP BY 
        p.product_id, 
        p.product_name, 
        p.base_price, 
        p.gender,
        pi.image_url, 
        b.brand_name, 
        c.category_name, 
        c.slug
      ORDER BY total_sold DESC
      LIMIT ?
    `;
    const [rows] = await db.query(query, [Number(limit)]);
    return rows;
  }
}

export default new ProductRepository();
