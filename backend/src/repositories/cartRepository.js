import { getDB } from '../database/connection.js';

class CartRepository {
  /**
   * Tìm cart của user (chỉ lấy thông tin cart, không kèm items)
   */
  async findCartByUserId(userId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT cart_id, user_id, created_at FROM carts WHERE user_id = ?`,
      [userId],
    );
    return rows[0] || null;
  }

  /**
   * Tạo cart mới cho user (auto-create khi user lần đầu thêm sản phẩm)
   */
  async createCart(userId) {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO carts (user_id) VALUES (?)`,
      [userId],
    );
    return { cart_id: result.insertId, user_id: userId };
  }

  /**
   * Lấy cart kèm toàn bộ items, variant info và product info
   */
  async findCartWithItems(userId) {
    const db = getDB();

    // Lấy cart
    const [cartRows] = await db.query(
      `SELECT cart_id, user_id FROM carts WHERE user_id = ?`,
      [userId],
    );

    if (cartRows.length === 0) return null;

    const cart = cartRows[0];

    // Lấy items kèm thông tin variant và product
    const [itemRows] = await db.query(
      `SELECT
        ci.cart_item_id,
        ci.cart_id,
        ci.variant_id,
        ci.quantity,
        ci.price_snapshot,
        pv.size,
        pv.color,
        pv.stock_quantity,
        pv.sku,
        COALESCE(pv.variant_price, p.base_price) AS unit_price,
        p.product_id,
        p.product_name,
        p.status AS product_status,
        p.base_price,
        pi.image_url AS thumbnail
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE ci.cart_id = ?
      ORDER BY ci.cart_item_id`,
      [cart.cart_id],
    );

    return { ...cart, items: itemRows };
  }

  /**
   * Tìm một item cụ thể trong cart theo cartItemId và cartId
   */
  async findCartItem(cartId, cartItemId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        ci.cart_item_id,
        ci.cart_id,
        ci.variant_id,
        ci.quantity,
        pv.stock_quantity,
        pv.product_id
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      WHERE ci.cart_id = ? AND ci.cart_item_id = ?`,
      [cartId, cartItemId],
    );
    return rows[0] || null;
  }

  /**
   * Tìm item theo cartId và variantId (để check duplicate khi add)
   */
  async findCartItemByVariant(cartId, variantId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?`,
      [cartId, variantId],
    );
    return rows[0] || null;
  }

  /**
   * Thêm item vào cart — nếu đã có thì cộng dồn quantity (upsert)
   * Sử dụng INSERT ... ON DUPLICATE KEY UPDATE để đảm bảo atomicity
   */
  async addItem(cartId, variantId, qty, priceSnapshot) {
    const db = getDB();
    await db.query(
      `INSERT INTO cart_items (cart_id, variant_id, quantity, price_snapshot)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
          quantity = quantity + VALUES(quantity),
          price_snapshot = VALUES(price_snapshot)`,
      [cartId, variantId, qty, priceSnapshot],
    );
    // Trả về item vừa thêm/cập nhật
    const [rows] = await db.query(
      `SELECT cart_item_id, cart_id, variant_id, quantity
       FROM cart_items WHERE cart_id = ? AND variant_id = ?`,
      [cartId, variantId],
    );
    return rows[0];
  }

  /**
   * Cập nhật số lượng của một item cụ thể
   */
  async updateItemQuantity(cartItemId, qty) {
    const db = getDB();
    await db.query(
      `UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?`,
      [qty, cartItemId],
    );
  }

  /**
   * Cập nhật variant, số lượng và giá của một item
   */
  async updateItemVariant(cartItemId, variantId, qty, priceSnapshot) {
    const db = getDB();
    await db.query(
      `UPDATE cart_items SET variant_id = ?, quantity = ?, price_snapshot = ? WHERE cart_item_id = ?`,
      [variantId, qty, priceSnapshot, cartItemId],
    );
  }

  /**
   * Cập nhật price_snapshot của một item cụ thể
   */
  async updatePriceSnapshot(cartItemId, price) {
    const db = getDB();
    await db.query(
      `UPDATE cart_items SET price_snapshot = ? WHERE cart_item_id = ?`,
      [price, cartItemId],
    );
  }

  /**
   * Xóa một item khỏi cart
   */
  async removeItem(cartItemId) {
    const db = getDB();
    await db.query(`DELETE FROM cart_items WHERE cart_item_id = ?`, [cartItemId]);
  }

  /**
   * Xóa toàn bộ items trong cart (dùng khi checkout hoàn tất)
   */
  async clearCart(cartId) {
    const db = getDB();
    await db.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
  }

  /**
   * Xóa các items cụ thể khỏi cart theo danh sách cart_item_id.
   * Đảm bảo chỉ xóa items thuộc cart của user (double-check qua cart_id).
   * Hỗ trợ connection (transaction).
   */
  async removeItemsByIds(cartId, itemIds, conn = null) {
    if (!itemIds || itemIds.length === 0) return;
    const db = conn || getDB();
    const placeholders = itemIds.map(() => '?').join(', ');
    await db.query(
      `DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id IN (${placeholders})`,
      [cartId, ...itemIds],
    );
  }
}

export default new CartRepository();
