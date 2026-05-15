import { getDB } from '../database/connection.js';

class VoucherRepository {
  /**
   * Tìm voucher theo code (case-insensitive)
   */
  async findByCode(code) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        voucher_id, code, description, discount_type, discount_value,
        max_discount_amount, min_order_value, usage_limit, used_count,
        user_usage_limit, start_date, expiry_date, is_active, created_by, created_at
       FROM vouchers
       WHERE code = ?`,
      [code.toUpperCase()],
    );
    return rows[0] || null;
  }

  /**
   * Tìm voucher theo ID
   */
  async findById(id) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        voucher_id, code, description, discount_type, discount_value,
        max_discount_amount, min_order_value, usage_limit, used_count,
        user_usage_limit, start_date, expiry_date, is_active, created_by, created_at, updated_at
       FROM vouchers
       WHERE voucher_id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  /**
   * Admin: Lấy tất cả vouchers với pagination
   */
  async findAll({ limit = 20, offset = 0 } = {}) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        voucher_id, code, description, discount_type, discount_value,
        max_discount_amount, min_order_value, usage_limit, used_count,
        user_usage_limit, start_date, expiry_date, is_active, created_at
       FROM vouchers
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM vouchers`);

    return { rows, total };
  }

  /**
   * User: Lấy vouchers hiệu lực mà user chưa dùng hết lượt
   * - is_active = 1
   * - expiry_date >= NOW()
   * - start_date <= NOW() (hoặc start_date IS NULL)
   * - used_count < usage_limit
   * - user chưa dùng hết user_usage_limit
   */
  async findActive(userId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT
        v.voucher_id, v.code, v.description, v.discount_type, v.discount_value,
        v.max_discount_amount, v.min_order_value, v.usage_limit, v.used_count,
        v.user_usage_limit, v.start_date, v.expiry_date,
        COALESCE(vu.usage_count, 0) AS user_usage_count
       FROM vouchers v
       LEFT JOIN (
         SELECT voucher_id, COUNT(*) AS usage_count
         FROM voucher_usages
         WHERE user_id = ?
         GROUP BY voucher_id
       ) vu ON v.voucher_id = vu.voucher_id
       WHERE v.is_active = 1
         AND v.expiry_date >= NOW()
         AND (v.start_date IS NULL OR v.start_date <= NOW())
         AND v.used_count < v.usage_limit
         AND COALESCE(vu.usage_count, 0) < v.user_usage_limit
       ORDER BY v.expiry_date ASC`,
      [userId],
    );
    return rows;
  }

  /**
   * Đếm số lần user đã dùng một voucher cụ thể
   */
  async countUserUsage(voucherId, userId) {
    const db = getDB();
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM voucher_usages
       WHERE voucher_id = ? AND user_id = ?`,
      [voucherId, userId],
    );
    return count;
  }

  /**
   * Tạo voucher mới
   */
  async create(dto) {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO vouchers
        (code, description, discount_type, discount_value, max_discount_amount,
         min_order_value, usage_limit, user_usage_limit, start_date, expiry_date, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        dto.code.toUpperCase(),
        dto.description || null,
        dto.discount_type,
        dto.discount_value,
        dto.max_discount_amount || null,
        dto.min_order_value ?? 0,
        dto.usage_limit,
        dto.user_usage_limit ?? 1,
        dto.start_date || null,
        dto.expiry_date,
        dto.created_by || null,
      ],
    );
    return this.findById(result.insertId);
  }

  /**
   * Cập nhật voucher
   */
  async update(id, dto) {
    const db = getDB();
    const fields = [];
    const values = [];

    const allowed = [
      'code',
      'description',
      'discount_type',
      'discount_value',
      'max_discount_amount',
      'min_order_value',
      'usage_limit',
      'user_usage_limit',
      'start_date',
      'expiry_date',
      'is_active',
    ];

    for (const key of allowed) {
      if (dto[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === 'code' ? dto[key].toUpperCase() : dto[key]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await db.query(`UPDATE vouchers SET ${fields.join(', ')} WHERE voucher_id = ?`, values);
    return this.findById(id);
  }

  /**
   * Soft delete voucher: set is_active = 0
   */
  async delete(id) {
    const db = getDB();
    await db.query(`UPDATE vouchers SET is_active = 0 WHERE voucher_id = ?`, [id]);
  }
}

export default new VoucherRepository();
