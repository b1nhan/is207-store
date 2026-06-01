import { getDB } from '../database/connection.js';
import cartRepository from '../repositories/cartRepository.js';
import orderRepository from '../repositories/orderRepository.js';
import orderItemRepository from '../repositories/orderItemRepository.js';
import campaignRepository from '../repositories/campaignRepository.js';
import shippingProfileRepository from '../repositories/shippingProfileRepository.js';
import voucherService from './voucherService.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';
import ORDER_STATUS from '../constants/orderStatus.js';
import { getPagination, getPaginationData } from '../utils/pagination.js';
import mailService from './mailService.js';
import * as userRepository from '../repositories/userRepository.js';

// Phí ship cố định (có thể tách ra config sau)
const SHIPPING_FEE = 30000;

class OrderService {
  /**
   * Preview đơn hàng — tính toán tổng giá trị đơn hàng, không lưu vào DB.
   * So sánh với expected_subtotal (nếu có) để phát hiện chênh lệch giá.
   */
  async previewOrder(userId, dto) {
    const db = getDB();
    let items = [];
    let cart = null;
    let priceChangedMessages = [];
    let hasPriceChanged = false;

    if (dto.directItem) {
      const [variantRows] = await db.query(
        `SELECT 
          v.variant_id, v.product_id, v.size, v.color, v.stock_quantity,
          p.product_name, p.status as product_status,
          v.status as variant_status,
          v.variant_price, p.base_price,
          p.slug as product_slug,
          pi.image_url as product_thumbnail
          FROM product_variants v
          JOIN products p ON v.product_id = p.product_id
          LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
          WHERE v.variant_id = ? AND v.product_id = ? AND v.status = 1`,
        [dto.directItem.variant_id, dto.directItem.product_id]
      );
      if (variantRows.length === 0) {
        throw new AppError('Sản phẩm không tồn tại hoặc đã ngừng bán', 404, ERROR_CODES.ORDER.BAD_REQUEST);
      }
      const variant = variantRows[0];
      const unitPrice = Number(variant.variant_price ?? variant.base_price);

      items = [{
        product_id: variant.product_id,
        product_slug: variant.product_slug,
        variant_id: variant.variant_id,
        quantity: dto.directItem.quantity,
        unit_price: unitPrice,
        product_name: variant.product_name,
        thumbnail: variant.product_thumbnail,
        size: variant.size,
        color: variant.color,
        stock_quantity: variant.stock_quantity,
        product_status: variant.product_status,
        variant_status: variant.variant_status,
      }];
    } else {
      cart = await cartRepository.findCartWithItems(userId);
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new AppError('Giỏ hàng đang trống', 400, ERROR_CODES.ORDER.EMPTY_CART);
      }
      const { selectedItemIds } = dto;
      items = cart.items.filter((i) => selectedItemIds.includes(i.cart_item_id));

      if (items.length !== selectedItemIds.length) {
        throw new AppError('Một số sản phẩm không tồn tại trong giỏ hàng', 400, ERROR_CODES.ORDER.BAD_REQUEST);
      }
    }

    // Tính subtotal mới nhất
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.unit_price) * item.quantity,
      0,
    );

    // Kiểm tra chênh lệch giá nếu client gửi expected_subtotal
    if (dto.expected_subtotal !== undefined && Number(dto.expected_subtotal) !== subtotal) {
      hasPriceChanged = true;

      // Tìm các items bị thay đổi giá
      if (cart) {
        for (const item of items) {
          const oldPrice = Number(item.price_snapshot);
          const newPrice = Number(item.unit_price);
          if (item.price_snapshot !== null && oldPrice !== newPrice) {
            priceChangedMessages.push({
              productId: item.product_id,
              productName: item.product_name,
              oldPrice,
              newPrice,
              message: `Giá sản phẩm "${item.product_name}" đã được cập nhật từ ${oldPrice.toLocaleString('vi-VN')}₫ → ${newPrice.toLocaleString('vi-VN')}₫`
            });
            // Update snapshot here too just in case
            await cartRepository.updatePriceSnapshot(item.cart_item_id, newPrice);
          }
        }
      } else if (dto.directItem && dto.directItem.expected_price) {
        const oldPrice = Number(dto.directItem.expected_price);
        const newPrice = items[0].unit_price;
        if (oldPrice !== newPrice) {
          priceChangedMessages.push({
            productId: items[0].product_id,
            productName: items[0].product_name,
            oldPrice,
            newPrice,
            message: `Giá sản phẩm "${items[0].product_name}" đã được cập nhật từ ${oldPrice.toLocaleString('vi-VN')}₫ → ${newPrice.toLocaleString('vi-VN')}₫`
          });
        }
      }
    }

    // Apply campaign
    let appliedCampaign = null;
    let campaignDiscountTotal = 0;
    let isFreeship = false;
    const activeCampaigns = await campaignRepository.findActiveCampaigns();

    if (activeCampaigns.length > 0) {
      let bestCampaign = null;
      let maxEffectiveDiscount = -1;
      let bestDiscountTotal = 0;
      let bestFreeship = false;

      for (const campaign of activeCampaigns) {
        let discount = 0;
        let freeship = false;
        const campaignProductIds = campaign.products.map(p => p.product_id);
        const appliesToAll = campaignProductIds.length === 0;

        const applicableItems = items.filter(item =>
          appliesToAll || campaignProductIds.includes(item.product_id)
        );

        if (applicableItems.length > 0) {
          if (campaign.campaign_type === 'PERCENTAGE') {
            const pct = campaign.config.discount_value;
            applicableItems.forEach(item => {
              discount += (Number(item.unit_price) * (pct / 100)) * item.quantity;
            });
          } else if (campaign.campaign_type === 'FIXED_PRICE') {
            const fixedPrice = campaign.config.discount_value;
            applicableItems.forEach(item => {
              const originalPrice = Number(item.unit_price);
              if (originalPrice > fixedPrice) {
                discount += (originalPrice - fixedPrice) * item.quantity;
              }
            });
          } else if (campaign.campaign_type === 'TIER_DISCOUNT') {
            const totalApplicableValue = applicableItems.reduce(
              (sum, item) => sum + (Number(item.unit_price) * item.quantity), 0
            );
            const applicableTiers = campaign.tiers
              .filter(t => totalApplicableValue >= t.min_order_value)
              .sort((a, b) => b.min_order_value - a.min_order_value);

            if (applicableTiers.length > 0) {
              discount = totalApplicableValue * (applicableTiers[0].discount_value / 100);
            }
          } else if (campaign.campaign_type === 'FREESHIP') {
            freeship = true;
          }
        }

        const effectiveDiscount = discount + (freeship ? SHIPPING_FEE : 0);

        if (dto.campaign_id && campaign.campaign_id === dto.campaign_id) {
          bestCampaign = campaign;
          bestDiscountTotal = discount;
          bestFreeship = freeship;
          break;
        }

        if (!dto.campaign_id && effectiveDiscount > maxEffectiveDiscount) {
          maxEffectiveDiscount = effectiveDiscount;
          bestCampaign = campaign;
          bestDiscountTotal = discount;
          bestFreeship = freeship;
        }
      }

      if (bestCampaign && (bestDiscountTotal > 0 || bestFreeship)) {
        appliedCampaign = bestCampaign;
        campaignDiscountTotal = bestDiscountTotal;
        isFreeship = bestFreeship;
      }
    }

    // Apply voucher
    let voucherResult = null;
    const subtotalAfterCampaign = Math.max(0, subtotal - campaignDiscountTotal);

    if (dto.voucher_code) {
      try {
        voucherResult = await voucherService.applyVoucher(userId, {
          code: dto.voucher_code,
          subtotal: subtotalAfterCampaign,
        });
      } catch (err) {
        // Có thể ignore lỗi voucher trong preview hoặc trả về thông báo lỗi voucher
        // Ở đây để đơn giản ta bỏ qua nếu voucher lỗi
      }
    }

    const discountTotal = voucherResult ? voucherResult.discount_amount : 0;
    const finalShippingFee = isFreeship ? 0 : SHIPPING_FEE;
    const totalAmount = Math.max(0, subtotalAfterCampaign - discountTotal) + finalShippingFee;

    return {
      checkoutSummary: {
        items,
        subtotal,
        campaignDiscountTotal,
        voucherDiscountTotal: discountTotal,
        shippingFee: finalShippingFee,
        totalAmount,
        appliedCampaign,
        appliedVoucher: voucherResult
      },
      hasPriceChanged,
      priceChangedMessages
    };
  }

  /**
   * Checkout — đặt hàng từ giỏ hàng.
   * Toàn bộ quá trình được wrap trong một MySQL transaction để đảm bảo atomicity.
   *
   * @param {number} userId
   * @param {{ profile_id, voucher_code?, campaign_id? }} dto
   */
  async placeOrder(userId, dto) {
    const db = getDB();

    // ── 1. Lấy items (từ giỏ hàng hoặc directItem) ───────────────────────────
    let items = [];
    let cart = null;
    if (dto.directItem) {
      console.log('bypass cart');
      // ── Mua ngay (Bypass cart) ──────────────────────────────────────────────
      const [variantRows] = await db.query(
        `SELECT 
          v.variant_id, v.product_id, v.size, v.color, v.stock_quantity,
          p.product_name, p.status as product_status,
          v.status as variant_status,
          v.variant_price, p.base_price
          FROM product_variants v
          JOIN products p ON v.product_id = p.product_id
          WHERE v.variant_id = ? AND v.product_id = ? AND v.status = 1`,
        [dto.directItem.variant_id, dto.directItem.product_id]
      );
      if (variantRows.length === 0) {
        throw new AppError('Sản phẩm không tồn tại hoặc đã ngừng bán', 404, ERROR_CODES.ORDER.BAD_REQUEST);
      }
      const variant = variantRows[0];
      items = [{
        product_id: variant.product_id,
        variant_id: variant.variant_id,
        quantity: dto.directItem.quantity,
        // ── FIX BUG 1: Thêm unit_price, ưu tiên variant_price, fallback base_price
        unit_price: Number(variant.variant_price ?? variant.base_price),
        variant_price: variant.variant_price,
        base_price: variant.base_price,
        product_name: variant.product_name,
        size: variant.size,
        color: variant.color,
        stock_quantity: variant.stock_quantity,
        product_status: variant.product_status,
        variant_status: variant.variant_status,
      }];
    } else {
      // ── Mua từ giỏ hàng ─────────────────────────────────────────────────────
      cart = await cartRepository.findCartWithItems(userId);
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new AppError('Giỏ hàng đang trống', 400, ERROR_CODES.ORDER.EMPTY_CART);
      }

      const { selectedItemIds } = dto;
      const cartItemIdSet = new Set(cart.items.map((i) => i.cart_item_id));
      const invalidIds = selectedItemIds.filter((id) => !cartItemIdSet.has(id));
      if (invalidIds.length > 0) {
        throw new AppError(
          `Sản phẩm không tồn tại trong giỏ hàng: ${invalidIds.join(', ')}`,
          400,
          ERROR_CODES.ORDER.BAD_REQUEST,
        );
      }

      items = cart.items.filter((i) => selectedItemIds.includes(i.cart_item_id));
    }

    // ── 2. Validate từng item ────────────────────────────────────────────────
    for (const item of items) {
      if (item.product_status !== 1) {
        throw new AppError(
          `Sản phẩm "${item.product_name}" hiện không còn bán`,
          400,
          ERROR_CODES.ORDER.INSUFFICIENT_STOCK,
        );
      }
      if (item.variant_status !== undefined && item.variant_status !== 1) {
        throw new AppError(
          `Phiên bản sản phẩm "${item.product_name}" (${item.size}/${item.color}) hiện không còn bán`,
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


    // ── 3. Validate profile_id tồn tại và thuộc user ────────────────────────
    const profile = await shippingProfileRepository.findByIdAndUser(dto.profile_id, userId);
    if (!profile) {
      throw new AppError(
        'Shipping profile không hợp lệ hoặc không thuộc về tài khoản này',
        403,
        ERROR_CODES.SHIPPING_PROFILE.NOT_FOUND,
      );
    }

    // ── 4. Tính subtotal ─────────────────────────────────────────────────────
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.unit_price) * item.quantity,
      0,
    );

    // ── 4.5. Apply campaign ──────────────────────────────────────────────────
    let appliedCampaign = null;
    let campaignDiscountTotal = 0;
    let isFreeship = false;

    const activeCampaigns = await campaignRepository.findActiveCampaigns();

    if (activeCampaigns.length > 0) {
      let bestCampaign = null;
      let maxEffectiveDiscount = -1;
      let bestDiscountTotal = 0;
      let bestFreeship = false;

      for (const campaign of activeCampaigns) {
        let discount = 0;
        let freeship = false;
        const campaignProductIds = campaign.products.map(p => p.product_id);
        const appliesToAll = campaignProductIds.length === 0;

        const applicableItems = items.filter(item =>
          appliesToAll || campaignProductIds.includes(item.product_id)
        );

        if (applicableItems.length > 0) {
          if (campaign.campaign_type === 'PERCENTAGE') {
            const pct = campaign.config.discount_value;
            applicableItems.forEach(item => {
              discount += (Number(item.unit_price) * (pct / 100)) * item.quantity;
            });
          } else if (campaign.campaign_type === 'FIXED_PRICE') {
            const fixedPrice = campaign.config.discount_value;
            applicableItems.forEach(item => {
              const originalPrice = Number(item.unit_price);
              if (originalPrice > fixedPrice) {
                discount += (originalPrice - fixedPrice) * item.quantity;
              }
            });
          } else if (campaign.campaign_type === 'TIER_DISCOUNT') {
            const totalApplicableValue = applicableItems.reduce(
              (sum, item) => sum + (Number(item.unit_price) * item.quantity), 0
            );
            const applicableTiers = campaign.tiers
              .filter(t => totalApplicableValue >= t.min_order_value)
              .sort((a, b) => b.min_order_value - a.min_order_value);

            if (applicableTiers.length > 0) {
              discount = totalApplicableValue * (applicableTiers[0].discount_value / 100);
            }
          } else if (campaign.campaign_type === 'FREESHIP') {
            freeship = true;
          }
        }

        const effectiveDiscount = discount + (freeship ? SHIPPING_FEE : 0);

        if (dto.campaign_id && campaign.campaign_id === dto.campaign_id) {
          bestCampaign = campaign;
          bestDiscountTotal = discount;
          bestFreeship = freeship;
          break;
        }

        if (!dto.campaign_id && effectiveDiscount > maxEffectiveDiscount) {
          maxEffectiveDiscount = effectiveDiscount;
          bestCampaign = campaign;
          bestDiscountTotal = discount;
          bestFreeship = freeship;
        }
      }

      if (dto.campaign_id && (!bestCampaign || (bestDiscountTotal === 0 && !bestFreeship))) {
        throw new AppError('Campaign không hợp lệ hoặc không áp dụng được cho đơn hàng này', 400, ERROR_CODES.ORDER.BAD_REQUEST);
      } else if (bestCampaign && (bestDiscountTotal > 0 || bestFreeship)) {
        appliedCampaign = bestCampaign;
        campaignDiscountTotal = bestDiscountTotal;
        isFreeship = bestFreeship;
      }
    }

    // ── 5. Apply voucher nếu có ──────────────────────────────────────────────
    let voucherResult = null;
    const subtotalAfterCampaign = Math.max(0, subtotal - campaignDiscountTotal);

    if (dto.voucher_code) {
      voucherResult = await voucherService.applyVoucher(userId, {
        code: dto.voucher_code,
        subtotal: subtotalAfterCampaign,
      });
    }

    const discountTotal = voucherResult ? voucherResult.discount_amount : 0;
    const finalShippingFee = isFreeship ? 0 : SHIPPING_FEE;
    const totalAmount = Math.max(0, subtotalAfterCampaign - discountTotal) + finalShippingFee;

    // ── 6. Transaction: tất cả DB writes ────────────────────────────────────
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 6a. INSERT order
      const orderId = await orderRepository.create(
        {
          user_id: userId,
          profile_id: dto.profile_id,
          voucher_id: voucherResult ? voucherResult.voucher_id : null,
          voucher_code_snapshot: voucherResult ? voucherResult.code : null,
          campaign_id: appliedCampaign ? appliedCampaign.campaign_id : null,
          subtotal,
          discount_total: discountTotal,
          campaign_discount_total: campaignDiscountTotal,
          shipping_fee: finalShippingFee,
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

      // 6c. INSERT order_shipping_address (snapshot địa chỉ từ shipping_profiles)
      // Copy dữ liệu tại thời điểm đặt hàng — không dùng FK
      await conn.query(
        `INSERT INTO order_shipping_address (order_id, receiver_name, receiver_phone, full_address)
         VALUES (?, ?, ?, ?)`,
        [orderId, profile.receiver_name, profile.receiver_phone, profile.full_address],
      );

      // 6d. UPDATE stock: trừ tồn kho từng variant
      for (const item of items) {
        const [stockResult] = await conn.query(
          `UPDATE product_variants
           SET stock_quantity = stock_quantity - ?
           WHERE variant_id = ? AND stock_quantity >= ?`,
          [item.quantity, item.variant_id, item.quantity],
        );
        if (stockResult.affectedRows === 0) {
          throw new AppError(
            `Sản phẩm "${item.product_name}" (${item.size}/${item.color}) vừa hết hàng, vui lòng thử lại`,
            409,
            ERROR_CODES.ORDER.INSUFFICIENT_STOCK,
          );
        }
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

      // 6f. XÓA chỉ các cart_items được chọn (nếu mua từ giỏ hàng)
      if (cart && dto.selectedItemIds) {
        await cartRepository.removeItemsByIds(cart.cart_id, dto.selectedItemIds, conn);
      }

      await conn.commit();

      // ── 7. Trả về order detail ───────────────────────────────────────────
      const orderDetail = await this._getOrderDetail(orderId);

      // Gửi mail thông báo cho admin ajax
      userRepository.findById(userId)
        .then((user) => {
          mailService.sendOrderPlacementNotification(orderDetail, user);
        })
        .catch((err) => {
          console.error('Error fetching user info for email notification:', err);
          mailService.sendOrderPlacementNotification(orderDetail, null);
        });

      return orderDetail;
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

      // Gửi mail thông báo hủy đơn cho admin bất đồng bộ
      this._getOrderDetail(orderId)
        .then(async (orderDetail) => {
          if (orderDetail) {
            const user = await userRepository.findById(userId).catch(() => null);
            mailService.sendOrderCancellationNotification(orderDetail, user);
          }
        })
        .catch((err) => {
          console.error('Error sending order cancellation email notification:', err);
        });
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
      campaign_discount_total: Number(order.campaign_discount_total),
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
