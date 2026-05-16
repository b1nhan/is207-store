import cartRepository from '../repositories/cartRepository.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';
import { getDB } from '../database/connection.js';

class CartService {
  /**
   * Format cart response: tính subtotal, gắn flag availability
   */
  _formatCart(cart) {
    if (!cart) {
      return { items: [], subtotal: 0, total_items: 0 };
    }

    const formattedItems = (cart.items || []).map((item) => ({
      cart_item_id: item.cart_item_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      product_id: item.product_id,
      product_name: item.product_name,
      size: item.size,
      color: item.color,
      sku: item.sku,
      unit_price: Number(item.unit_price),
      line_total: Number(item.unit_price) * item.quantity,
      stock_quantity: item.stock_quantity,
      thumbnail: item.thumbnail || null,
      is_available: item.product_status === 1 && item.stock_quantity > 0,
    }));

    const subtotal = formattedItems.reduce((sum, item) => sum + item.line_total, 0);

    return {
      cart_id: cart.cart_id,
      items: formattedItems,
      subtotal,
      total_items: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  /**
   * Lấy hoặc tạo cart của user, trả về cart với items
   */
  async getCart(userId) {
    let cart = await cartRepository.findCartWithItems(userId);

    // Nếu user chưa có cart, tạo mới (cart rỗng)
    if (!cart) {
      return this._formatCart(null);
    }

    return this._formatCart(cart);
  }

  /**
   * Thêm item vào giỏ hàng
   * - Kiểm tra variant tồn tại và active
   * - Kiểm tra product active
   * - Kiểm tra stock
   * - Upsert (cộng dồn nếu đã có)
   */
  async addToCart(userId, { variant_id, quantity }) {
    const db = getDB();

    // Kiểm tra variant tồn tại và lấy thông tin product
    const [variantRows] = await db.query(
      `SELECT
        pv.variant_id,
        pv.stock_quantity,
        pv.status AS variant_status,
        p.product_id,
        p.status AS product_status
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      WHERE pv.variant_id = ?`,
      [variant_id],
    );

    if (variantRows.length === 0) {
      throw new AppError('Biến thể sản phẩm không tồn tại', 404, ERROR_CODES.PRODUCT.VARIANT_NOT_FOUND);
    }

    const variant = variantRows[0];

    // Kiểm tra product active
    if (variant.product_status !== 1) {
      throw new AppError(
        'Sản phẩm này hiện không còn bán',
        400,
        ERROR_CODES.PRODUCT.INACTIVE,
      );
    }

    // Kiểm tra variant active (nếu có cột is_active)
    // Một số schema có thể không có cột này — kiểm tra để tránh lỗi
    if (variant.is_active !== undefined && variant.is_active !== null && !variant.is_active) {
      throw new AppError(
        'Biến thể sản phẩm này hiện không còn bán',
        400,
        ERROR_CODES.PRODUCT.INACTIVE,
      );
    }

    // Lấy hoặc tạo cart
    let cartRow = await cartRepository.findCartByUserId(userId);
    if (!cartRow) {
      cartRow = await cartRepository.createCart(userId);
    }

    const cartId = cartRow.cart_id;

    // Kiểm tra nếu đã có item với variant này trong cart → tính tổng qty mới
    const existingItem = await cartRepository.findCartItemByVariant(cartId, variant_id);
    const newTotalQty = (existingItem ? existingItem.quantity : 0) + quantity;

    // Kiểm tra stock
    if (newTotalQty > variant.stock_quantity) {
      throw new AppError(
        `Chỉ còn ${variant.stock_quantity} sản phẩm trong kho`,
        400,
        ERROR_CODES.CART.EXCEED_STOCK,
      );
    }

    await cartRepository.addItem(cartId, variant_id, quantity);

    // Trả về cart mới nhất
    return this.getCart(userId);
  }

  /**
   * Cập nhật số lượng một item trong giỏ
   * - Kiểm tra item thuộc cart của user
   * - Kiểm tra stock với qty mới
   */
  async updateCartItem(userId, itemId, { quantity }) {
    // Lấy cart của user
    const cartRow = await cartRepository.findCartByUserId(userId);
    if (!cartRow) {
      throw new AppError('Giỏ hàng không tồn tại', 404, ERROR_CODES.CART.NOT_FOUND);
    }

    // Kiểm tra item tồn tại và thuộc cart của user
    const item = await cartRepository.findCartItem(cartRow.cart_id, itemId);
    if (!item) {
      throw new AppError('Sản phẩm không có trong giỏ hàng', 404, ERROR_CODES.CART.ITEM_NOT_FOUND);
    }

    // Kiểm tra stock với quantity mới
    if (quantity > item.stock_quantity) {
      throw new AppError(
        `Chỉ còn ${item.stock_quantity} sản phẩm trong kho`,
        400,
        ERROR_CODES.CART.EXCEED_STOCK,
      );
    }

    await cartRepository.updateItemQuantity(itemId, quantity);

    return this.getCart(userId);
  }

  /**
   * Xóa một item khỏi giỏ hàng
   * - Kiểm tra ownership (item phải thuộc cart của user này)
   */
  async removeCartItem(userId, itemId) {
    const cartRow = await cartRepository.findCartByUserId(userId);
    if (!cartRow) {
      throw new AppError('Giỏ hàng không tồn tại', 404, ERROR_CODES.CART.NOT_FOUND);
    }

    // Kiểm tra item thuộc cart của user
    const item = await cartRepository.findCartItem(cartRow.cart_id, itemId);
    if (!item) {
      throw new AppError('Sản phẩm không có trong giỏ hàng', 404, ERROR_CODES.CART.ITEM_NOT_FOUND);
    }

    await cartRepository.removeItem(itemId);

    return this.getCart(userId);
  }

  /**
   * Xóa toàn bộ items trong giỏ
   */
  async clearCart(userId) {
    const cartRow = await cartRepository.findCartByUserId(userId);
    if (!cartRow) {
      // Nếu cart chưa tồn tại, coi như đã clear
      return this._formatCart(null);
    }

    await cartRepository.clearCart(cartRow.cart_id);

    return this._formatCart(null);
  }
}

export default new CartService();
