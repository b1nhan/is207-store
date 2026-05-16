import { getDB } from '../database/connection.js';

class ProductVariantRepository {
  /**
   * Lấy tất cả variants theo product_id.
   */
  async findByProductId(productId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT variant_id, product_id, size, color, stock_quantity, variant_price, sku, status
       FROM product_variants
       WHERE product_id = ?
       ORDER BY variant_id ASC`,
      [productId],
    );
    return rows;
  }

  /**
   * Lấy một variant theo id.
   */
  async findById(variantId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT variant_id, product_id, size, color, stock_quantity, variant_price, sku, status
       FROM product_variants
       WHERE variant_id = ?`,
      [variantId],
    );
    return rows[0] || null;
  }

  /**
   * Kiểm tra SKU đã tồn tại chưa (loại trừ variantId hiện tại khi update).
   */
  async findBySku(sku, excludeVariantId = null) {
    const db = getDB();
    let query = `SELECT variant_id FROM product_variants WHERE sku = ?`;
    const params = [sku];
    if (excludeVariantId) {
      query += ` AND variant_id != ?`;
      params.push(excludeVariantId);
    }
    const [rows] = await db.query(query, params);
    return rows[0] || null;
  }

  /**
   * Thêm variant mới vào sản phẩm.
   * @returns {number} insertId
   */
  async create(productId, dto) {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO product_variants
        (product_id, size, color, stock_quantity, variant_price, sku, status)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        productId,
        dto.size,
        dto.color,
        dto.stock_quantity,
        dto.variant_price ?? null,
        dto.sku ?? null,
      ],
    );
    return result.insertId;
  }

  /**
   * Cập nhật variant.
   */
  async update(variantId, dto) {
    const fields = [];
    const params = [];

    const updatable = ['size', 'color', 'stock_quantity', 'variant_price', 'sku', 'status'];
    for (const key of updatable) {
      if (dto[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(dto[key]);
      }
    }

    if (fields.length === 0) return;

    params.push(variantId);
    const db = getDB();
    await db.query(
      `UPDATE product_variants SET ${fields.join(', ')} WHERE variant_id = ?`,
      params,
    );
  }

  /**
   * Xóa cứng variant.
   */
  async delete(variantId) {
    const db = getDB();
    await db.query(`DELETE FROM product_variants WHERE variant_id = ?`, [variantId]);
  }
}

export default new ProductVariantRepository();
