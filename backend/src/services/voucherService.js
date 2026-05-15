import voucherRepository from '../repositories/voucherRepository.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';
import VOUCHER_TYPE from '../constants/voucherType.js';
import { getPagination, getPaginationData } from '../utils/pagination.js';

class VoucherService {
  /**
   * Core business logic: Kiểm tra và tính discount amount cho một voucher.
   *
   * @param {number} userId - ID user đang áp dụng voucher
   * @param {{ code: string, subtotal: number }} param1 - Mã voucher và giá trị đơn hàng
   * @returns {{ voucher_id, code, discount_amount, discount_type }}
   */
  async applyVoucher(userId, { code, subtotal }) {
    // 1. Tìm voucher theo code
    const voucher = await voucherRepository.findByCode(code);
    if (!voucher) {
      throw new AppError('Mã voucher không tồn tại', 404, ERROR_CODES.VOUCHER.CODE_NOT_FOUND);
    }

    // 2. Kiểm tra is_active
    if (!voucher.is_active) {
      throw new AppError('Voucher này không còn hiệu lực', 400, ERROR_CODES.VOUCHER.INACTIVE);
    }

    const now = new Date();

    // 3. Kiểm tra start_date
    if (voucher.start_date && new Date(voucher.start_date) > now) {
      throw new AppError('Voucher này chưa đến ngày bắt đầu', 400, ERROR_CODES.VOUCHER.NOT_STARTED);
    }

    // 4. Kiểm tra expiry_date
    if (new Date(voucher.expiry_date) < now) {
      throw new AppError('Voucher này đã hết hạn', 400, ERROR_CODES.VOUCHER.EXPIRED);
    }

    // 5. Kiểm tra usage_limit toàn hệ thống
    if (voucher.used_count >= voucher.usage_limit) {
      throw new AppError('Voucher này đã hết lượt sử dụng', 400, ERROR_CODES.VOUCHER.USAGE_LIMIT_REACHED);
    }

    // 6. Kiểm tra user usage limit
    const userUsageCount = await voucherRepository.countUserUsage(voucher.voucher_id, userId);
    if (userUsageCount >= voucher.user_usage_limit) {
      throw new AppError(
        'Bạn đã sử dụng hết lượt dùng cho voucher này',
        400,
        ERROR_CODES.VOUCHER.USER_LIMIT_REACHED,
      );
    }

    // 7. Kiểm tra min_order_value
    if (subtotal < Number(voucher.min_order_value)) {
      throw new AppError(
        `Đơn hàng phải đạt tối thiểu ${Number(voucher.min_order_value).toLocaleString('vi-VN')}đ để dùng voucher này`,
        400,
        ERROR_CODES.VOUCHER.MIN_ORDER_NOT_MET,
      );
    }

    // 8. Tính discount_amount theo type
    let discountAmount = 0;

    if (voucher.discount_type === VOUCHER_TYPE.PERCENTAGE) {
      discountAmount = subtotal * (Number(voucher.discount_value) / 100);
    } else if (voucher.discount_type === VOUCHER_TYPE.FIXED) {
      discountAmount = Number(voucher.discount_value);
    } else if (voucher.discount_type === VOUCHER_TYPE.FREESHIP) {
      // Discount amount = shipping fee, nhưng tại bước apply chỉ trả về giá trị từ discount_value
      discountAmount = Number(voucher.discount_value);
    }

    // 9. Áp dụng max_discount_amount cap nếu có
    if (voucher.max_discount_amount && discountAmount > Number(voucher.max_discount_amount)) {
      discountAmount = Number(voucher.max_discount_amount);
    }

    // Đảm bảo discount không vượt subtotal
    discountAmount = Math.min(discountAmount, subtotal);
    discountAmount = Math.round(discountAmount * 100) / 100; // làm tròn 2 chữ số thập phân

    // 10. Trả về kết quả
    return {
      voucher_id: voucher.voucher_id,
      code: voucher.code,
      discount_amount: discountAmount,
      discount_type: voucher.discount_type,
      description: voucher.description,
    };
  }

  /**
   * Lấy danh sách vouchers đang hiệu lực mà user có thể sử dụng
   */
  async getActiveVouchers(userId) {
    const vouchers = await voucherRepository.findActive(userId);
    return vouchers.map((v) => ({
      voucher_id: v.voucher_id,
      code: v.code,
      description: v.description,
      discount_type: v.discount_type,
      discount_value: Number(v.discount_value),
      max_discount_amount: v.max_discount_amount ? Number(v.max_discount_amount) : null,
      min_order_value: Number(v.min_order_value),
      expiry_date: v.expiry_date,
      remaining_uses: v.usage_limit - v.used_count,
      user_remaining_uses: v.user_usage_limit - v.user_usage_count,
    }));
  }

  // ─── Admin CRUD ─────────────────────────────────────────────────────────────

  /**
   * Admin: Lấy tất cả vouchers với pagination
   */
  async getAll({ page = 1, limit = 20 } = {}) {
    const { limit: lim, offset, currentPage } = getPagination(page, limit);
    const { rows, total } = await voucherRepository.findAll({ limit: lim, offset });
    const pagination = getPaginationData(total, currentPage, lim);
    return { vouchers: rows, pagination };
  }

  /**
   * Admin: Lấy chi tiết một voucher theo ID
   */
  async getById(id) {
    const voucher = await voucherRepository.findById(id);
    if (!voucher) {
      throw new AppError('Voucher không tồn tại', 404, ERROR_CODES.VOUCHER.NOT_FOUND);
    }
    return voucher;
  }

  /**
   * Admin: Tạo voucher mới
   * - Kiểm tra trùng code
   */
  async createVoucher(dto, adminUserId) {
    const existing = await voucherRepository.findByCode(dto.code);
    if (existing) {
      throw new AppError('Mã voucher đã tồn tại', 409, ERROR_CODES.VOUCHER.CODE_ALREADY_EXISTS);
    }
    return voucherRepository.create({ ...dto, created_by: adminUserId });
  }

  /**
   * Admin: Cập nhật voucher
   * - Kiểm tra tồn tại
   * - Kiểm tra trùng code nếu code thay đổi
   */
  async updateVoucher(id, dto) {
    const voucher = await voucherRepository.findById(id);
    if (!voucher) {
      throw new AppError('Voucher không tồn tại', 404, ERROR_CODES.VOUCHER.NOT_FOUND);
    }

    // Nếu code thay đổi, kiểm tra trùng
    if (dto.code && dto.code.toUpperCase() !== voucher.code) {
      const existing = await voucherRepository.findByCode(dto.code);
      if (existing) {
        throw new AppError('Mã voucher đã tồn tại', 409, ERROR_CODES.VOUCHER.CODE_ALREADY_EXISTS);
      }
    }

    return voucherRepository.update(id, dto);
  }

  /**
   * Admin: Xóa mềm voucher (set is_active = 0)
   */
  async deleteVoucher(id) {
    const voucher = await voucherRepository.findById(id);
    if (!voucher) {
      throw new AppError('Voucher không tồn tại', 404, ERROR_CODES.VOUCHER.NOT_FOUND);
    }
    await voucherRepository.delete(id);
  }
}

export default new VoucherService();
