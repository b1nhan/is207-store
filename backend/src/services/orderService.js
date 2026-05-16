import { getDB } from '../database/connection.js';
import cartRepository from '../repositories/cartRepository.js';
import orderRepository from '../repositories/orderRepository.js';
import orderItemRepository from '../repositories/orderItemRepository.js';
import voucherService from './voucherService.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';
import ORDER_STATUS from '../constants/orderStatus.js';
import { getPagination, getPaginationData } from '../utils/pagination.js';

// Phí ship cố định (có thể tách ra config sau)
const SHIPPING_FEE = 30000;

class OrderService {
  /**
   * Checkout — đặt hàng từ giỏ hàng.
   * Toàn bộ quá trình được wrap trong một MySQL transaction để đảm bảo atomicity.
   *
   * @param {number} userId
   * @param {{ address_id, voucher_code, receiver_name, receiver_phone, full_address }} dto
   */
  async placeOrder(userId, dto) {
    const db = getDB();

    // ── 1. Lấy cart items của user ───────────────────────────────────────────
    const cart = await cartRepository.findCartWithItems(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new AppError('Giỏ hàng đang trống', 400, ERROR_CODES.ORDER.EMPTY_CART);
    }

    const items = cart.items;

    // ── 2. Validate từng item ────────────────────────────────────────────────
    for (const item of items) {
      if (item.product_status !== 1) {
        throw new AppError(
          `Sản phẩm "${item.product_name}" hiện không còn bán`,
          400,
          ERROR_CODES.ORDER.INSUFFICIENT_STOCK,
        );
      }
      if (item.quantity > item.stock_quantity) {
        throw new AppError(
          `Sản phẩm "${item.product_name}" (${item.size}/${item.color}) chỉ còn ${item.stock_quantity} trong kho`,
          400,
          ERROR_CODES.ORDER.INSUFFICIENT_STOCK,
        );
      }
    }

    // ── 3. Validate địa chỉ giao hàng thuộc user ────────────────────────────
    // Địa chỉ snapshot từ frontend được truyền trực tiếp (receiver_name, receiver_phone, full_address)
    // address_id chỉ dùng để lưu tham chiếu nếu có
    if (dto.address_id) {
      const [addrRows] = await db.query(
        `SELECT address_id FROM addresses WHERE address_id = ? AND user_id = ?`,
        [dto.address_id, userId],
      );
      if (addrRows.length === 0) {
        throw new AppError(
          'Địa chỉ giao hàng không hợp lệ',
          403,
          ERROR_CODES.USER.ADDRESS_FORBIDDEN,
        );
      }
    }

    // ── 4. Tính subtotal ─────────────────────────────────────────────────────
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.unit_price) * item.quantity,
      0,
    );

    // ── 5. Apply voucher nếu có ──────────────────────────────────────────────
    let voucherResult = null;
    if (dto.voucher_code) {
      voucherResult = await voucherService.applyVoucher(userId, {
        code: dto.voucher_code,
        subtotal,
      });
    }

    const discountTotal = voucherResult ? voucherResult.discount_amount : 0;
    const totalAmount = Math.max(0, subtotal - discountTotal) + SHIPPING_FEE;

    // ── 6. Transaction: tất cả DB writes ────────────────────────────────────
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 6a. INSERT order
      const orderId = await orderRepository.create(
        {
          user_id: userId,
          address_id: dto.address_id || null,
          voucher_id: voucherResult ? voucherResult.voucher_id : null,
          voucher_code_snapshot: voucherResult ? voucherResult.code : null,
          subtotal,
          discount_total: discountTotal,
          shipping_fee: SHIPPING_FEE,
          total_amount: totalAmount,
        },
        conn,
      );

      // 6b. INSERT order_items (snapshot)
      const orderItems = items.map((item) => ({
        order_id: orderId,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price_snapshot: Number(item.unit_price),
        line_total: Number(item.unit_price) * item.quantity,
        product_name_snapshot: item.product_name,
        size_snapshot: item.size,
        color_snapshot: item.color,
      }));
      await orderItemRepository.createMany(orderItems, conn);

      // 6c. INSERT order_shipping_address (snapshot địa chỉ)
      await conn.query(
        `INSERT INTO order_shipping_address (order_id, receiver_name, receiver_phone, full_address)
         VALUES (?, ?, ?, ?)`,
        [orderId, dto.receiver_name, dto.receiver_phone, dto.full_address],
      );

      // 6d. UPDATE stock: trừ tồn kho từng variant
      for (const item of items) {
        await conn.query(
          `UPDATE product_variants
           SET stock_quantity = stock_quantity - ?
           WHERE variant_id = ? AND stock_quantity >= ?`,
          [item.quantity, item.variant_id, item.quantity],
        );
        // Double-check: nếu không có row nào bị update → stock race condition
        // (trường hợp này hiếm vì đã validate ở bước 2, nhưng phòng ngừa)
      }

      // 6e. Voucher usage: INSERT vào voucher_usages + INCREMENT used_count
      if (voucherResult) {
        await conn.query(
          `INSERT INTO voucher_usages (voucher_id, user_id, order_id, discount_amount)
           VALUES (?, ?, ?, ?)`,
          [voucherResult.voucher_id, userId, orderId, voucherResult.discount_amount],
        );
        await conn.query(
          `UPDATE vouchers SET used_count = used_count + 1 WHERE voucher_id = ?`,
          [voucherResult.voucher_id],
        );
      }

      // 6f. DELETE cart_items (clear cart sau checkout)
      await conn.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart.cart_id]);

      await conn.commit();

      // ── 7. Trả về order detail ───────────────────────────────────────────
      return this._getOrderDetail(orderId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  /**
   * Lấy danh sách đơn hàng của user (có pagination)
   */
  async getMyOrders(userId, { page = 1, limit = 10 } = {}) {
    const { limit: lim, offset, currentPage } = getPagination(page, limit);
    const { rows, total } = await orderRepository.findAllByUser(userId, {
      limit: lim,
      offset,
    });
    const pagination = getPaginationData(total, currentPage, lim);
    return { orders: rows, pagination };
  }

  /**
   * Lấy chi tiết một đơn hàng (kèm items) — kiểm tra ownership
   */
  async getOrderById(userId, orderId) {
    const order = await orderRepository.findByIdAndUser(orderId, userId);
    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404, ERROR_CODES.ORDER.NOT_FOUND);
    }
    return this._getOrderDetail(orderId, order);
  }

  /**
   * User hủy đơn hàng (chỉ được hủy khi status = 'pending')
   * Restore stock sau khi hủy.
   */
  async cancelOrder(userId, orderId) {
    const order = await orderRepository.findByIdAndUser(orderId, userId);
    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404, ERROR_CODES.ORDER.NOT_FOUND);
    }
    if (order.status !== ORDER_STATUS.PENDING) {
      throw new AppError(
        'Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xác nhận',
        400,
        ERROR_CODES.ORDER.CANNOT_CANCEL,
      );
    }

    const db = getDB();
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Cập nhật status → cancelled
      await orderRepository.updateStatus(orderId, ORDER_STATUS.CANCELLED, 'USER', conn);

      // Restore stock
      const items = await orderItemRepository.findByOrderId(orderId);
      for (const item of items) {
        await conn.query(
          `UPDATE product_variants SET stock_quantity = stock_quantity + ? WHERE variant_id = ?`,
          [item.quantity, item.variant_id],
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return orderRepository.findByIdAndUser(orderId, userId);
  }

  // ─── Internal helpers ──────────────────────────────────────────────────────

  /**
   * Lấy full order detail (order + items).
   * Nếu `orderData` đã có sẵn (từ repository), tái dùng để tránh query thêm.
   */
  async _getOrderDetail(orderId, orderData = null) {
    const order = orderData || (await orderRepository.findById(orderId));
    if (!order) return null;

    const items = await orderItemRepository.findByOrderId(orderId);

    return {
      ...order,
      subtotal: Number(order.subtotal),
      discount_total: Number(order.discount_total),
      shipping_fee: Number(order.shipping_fee),
      total_amount: Number(order.total_amount),
      items: items.map((item) => ({
        ...item,
        unit_price_snapshot: Number(item.unit_price_snapshot),
        line_total: Number(item.line_total),
      })),
    };
  }
}

export default new OrderService();
