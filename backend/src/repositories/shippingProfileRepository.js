import { getDB } from '../database/connection.js';

class ShippingProfileRepository {
  /**
   * Lấy tất cả profile của một user.
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  async findAllByUser(userId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT profile_id, user_id, receiver_name, receiver_phone,
              full_address, label, is_default, created_at
       FROM shipping_profiles
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [userId],
    );
    return rows;
  }

  /**
   * Tìm một profile theo profile_id.
   * @param {number} profileId
   * @returns {Promise<object|null>}
   */
  async findById(profileId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT profile_id, user_id, receiver_name, receiver_phone,
              full_address, label, is_default, created_at
       FROM shipping_profiles
       WHERE profile_id = ?`,
      [profileId],
    );
    return rows[0] || null;
  }

  /**
   * Tìm profile theo profile_id VÀ user_id (ownership check).
   * @param {number} profileId
   * @param {number} userId
   * @returns {Promise<object|null>}
   */
  async findByIdAndUser(profileId, userId) {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT profile_id, user_id, receiver_name, receiver_phone,
              full_address, label, is_default, created_at
       FROM shipping_profiles
       WHERE profile_id = ? AND user_id = ?`,
      [profileId, userId],
    );
    return rows[0] || null;
  }

  /**
   * Tạo profile mới, trả về profileId vừa tạo.
   * @param {{ user_id, receiver_name, receiver_phone, full_address, label?, is_default? }} dto
   * @param {object|null} conn - optional transaction connection
   * @returns {Promise<number>}
   */
  async create(dto, conn = null) {
    const db = conn || getDB();
    const [result] = await db.query(
      `INSERT INTO shipping_profiles
         (user_id, receiver_name, receiver_phone, full_address, label, is_default)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dto.user_id,
        dto.receiver_name,
        dto.receiver_phone,
        dto.full_address,
        dto.label || null,
        dto.is_default ? 1 : 0,
      ],
    );
    return result.insertId;
  }

  /**
   * Cập nhật profile (chỉ các field được cung cấp).
   * @param {number} profileId
   * @param {{ receiver_name?, receiver_phone?, full_address?, label?, is_default? }} dto
   * @param {object|null} conn
   */
  async update(profileId, dto, conn = null) {
    const db = conn || getDB();
    await db.query(
      `UPDATE shipping_profiles
       SET receiver_name  = COALESCE(?, receiver_name),
           receiver_phone = COALESCE(?, receiver_phone),
           full_address   = COALESCE(?, full_address),
           label          = ?,
           is_default     = COALESCE(?, is_default)
       WHERE profile_id = ?`,
      [
        dto.receiver_name ?? null,
        dto.receiver_phone ?? null,
        dto.full_address ?? null,
        // label có thể set null (xóa nhãn) nên không dùng COALESCE
        Object.prototype.hasOwnProperty.call(dto, 'label') ? (dto.label ?? null) : undefined,
        Object.prototype.hasOwnProperty.call(dto, 'is_default') ? (dto.is_default ? 1 : 0) : null,
        profileId,
      ],
    );
  }

  /**
   * Xóa profile theo profile_id.
   * @param {number} profileId
   * @param {object|null} conn
   */
  async delete(profileId, conn = null) {
    const db = conn || getDB();
    await db.query(`DELETE FROM shipping_profiles WHERE profile_id = ?`, [profileId]);
  }

  /**
   * Unset is_default = 0 cho TẤT CẢ profile của user (trừ một profile cụ thể).
   * Dùng trước khi set một profile khác làm default.
   * @param {number} userId
   * @param {number|null} excludeProfileId - Profile ID được giữ nguyên (không unset)
   * @param {object|null} conn
   */
  async unsetDefaultForUser(userId, excludeProfileId = null, conn = null) {
    const db = conn || getDB();
    if (excludeProfileId !== null) {
      await db.query(
        `UPDATE shipping_profiles
         SET is_default = 0
         WHERE user_id = ? AND profile_id != ?`,
        [userId, excludeProfileId],
      );
    } else {
      await db.query(
        `UPDATE shipping_profiles SET is_default = 0 WHERE user_id = ?`,
        [userId],
      );
    }
  }

  /**
   * Set một profile làm default.
   * @param {number} profileId
   * @param {object|null} conn
   */
  async setDefault(profileId, conn = null) {
    const db = conn || getDB();
    await db.query(
      `UPDATE shipping_profiles SET is_default = 1 WHERE profile_id = ?`,
      [profileId],
    );
  }
}

export default new ShippingProfileRepository();
