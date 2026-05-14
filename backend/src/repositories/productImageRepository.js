import { getDB } from '../database/connection.js';

class ProductImageRepository {
  /**
   * Lấy tất cả ảnh theo product_id.
   */
  async findByProductId(productId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT image_id, product_id, image_url, public_id, is_primary, sort_order
       FROM product_images
       WHERE product_id = ?
       ORDER BY sort_order ASC`,
      [productId],
    );
    return rows;
  }

  /**
   * Lấy một ảnh theo id.
   */
  async findById(imageId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT image_id, product_id, image_url, public_id, is_primary, sort_order
       FROM product_images
       WHERE image_id = ?`,
      [imageId],
    );
    return rows[0] || null;
  }

  /**
   * Thêm ảnh mới cho sản phẩm.
   * @param {number} productId
   * @param {{ image_url, public_id, is_primary, sort_order }} dto
   * @returns {number} insertId
   */
  async create(productId, dto) {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO product_images (product_id, image_url, public_id, is_primary, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        productId,
        dto.image_url,
        dto.public_id ?? null,
        dto.is_primary ? 1 : 0,
        dto.sort_order ?? 0,
      ],
    );
    return result.insertId;
  }

  /**
   * Xóa ảnh theo id.
   */
  async delete(imageId) {
    const db = getDB();
    await db.query(`DELETE FROM product_images WHERE image_id = ?`, [imageId]);
  }

  /**
   * Đặt một ảnh làm primary, bỏ primary các ảnh còn lại của cùng sản phẩm.
   */
  async setPrimary(imageId, productId) {
    const db = getDB();
    // Bỏ primary tất cả ảnh của sản phẩm
    await db.query(`UPDATE product_images SET is_primary = 0 WHERE product_id = ?`, [productId]);
    // Đặt ảnh được chọn thành primary
    await db.query(`UPDATE product_images SET is_primary = 1 WHERE image_id = ?`, [imageId]);
  }
}

export default new ProductImageRepository();
