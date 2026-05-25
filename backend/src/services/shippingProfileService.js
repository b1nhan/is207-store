import { getDB } from '../database/connection.js';
import shippingProfileRepository from '../repositories/shippingProfileRepository.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';

class ShippingProfileService {
  /**
   * Lấy danh sách tất cả shipping profile của user.
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  async getProfiles(userId) {
    return shippingProfileRepository.findAllByUser(userId);
  }

  /**
   * Lấy chi tiết một profile — kiểm tra ownership (IDOR protection).
   * @param {number} userId
   * @param {number} profileId
   * @returns {Promise<object>}
   */
  async getProfileById(userId, profileId) {
    const profile = await shippingProfileRepository.findByIdAndUser(profileId, userId);
    if (!profile) {
      throw new AppError(
        'Không tìm thấy shipping profile',
        404,
        ERROR_CODES.SHIPPING_PROFILE.NOT_FOUND,
      );
    }
    return profile;
  }

  /**
   * Tạo shipping profile mới.
   * Nếu is_default = true, unset các profile default cũ của cùng user.
   * @param {number} userId
   * @param {{ receiver_name, receiver_phone, full_address, label?, is_default? }} dto
   * @returns {Promise<object>} profile vừa tạo
   */
  async createProfile(userId, dto) {
    const db = getDB();
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Nếu muốn set default, unset các profile default cũ
      if (dto.is_default) {
        await shippingProfileRepository.unsetDefaultForUser(userId, null, conn);
      }

      const profileId = await shippingProfileRepository.create(
        { ...dto, user_id: userId },
        conn,
      );

      await conn.commit();
      return shippingProfileRepository.findById(profileId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  /**
   * Cập nhật shipping profile — kiểm tra ownership.
   * Nếu is_default = true, unset các profile default cũ của cùng user.
   * @param {number} userId
   * @param {number} profileId
   * @param {object} dto
   * @returns {Promise<object>} profile sau khi cập nhật
   */
  async updateProfile(userId, profileId, dto) {
    const existing = await shippingProfileRepository.findByIdAndUser(profileId, userId);
    if (!existing) {
      throw new AppError(
        'Không tìm thấy shipping profile',
        404,
        ERROR_CODES.SHIPPING_PROFILE.NOT_FOUND,
      );
    }

    const db = getDB();
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Nếu muốn set default, unset profile default cũ (trừ chính nó để tránh false update)
      if (dto.is_default) {
        await shippingProfileRepository.unsetDefaultForUser(userId, profileId, conn);
      }

      await shippingProfileRepository.update(profileId, dto, conn);

      await conn.commit();
      return shippingProfileRepository.findById(profileId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  /**
   * Xóa shipping profile — kiểm tra ownership.
   * Nếu xóa profile đang là default, KHÔNG tự động chọn profile mới làm default.
   * @param {number} userId
   * @param {number} profileId
   */
  async deleteProfile(userId, profileId) {
    const existing = await shippingProfileRepository.findByIdAndUser(profileId, userId);
    if (!existing) {
      throw new AppError(
        'Không tìm thấy shipping profile',
        404,
        ERROR_CODES.SHIPPING_PROFILE.NOT_FOUND,
      );
    }
    await shippingProfileRepository.delete(profileId);
  }

  /**
   * Set một profile làm default, unset profile default cũ — kiểm tra ownership.
   * @param {number} userId
   * @param {number} profileId
   * @returns {Promise<object>} profile sau khi cập nhật
   */
  async setDefault(userId, profileId) {
    const existing = await shippingProfileRepository.findByIdAndUser(profileId, userId);
    if (!existing) {
      throw new AppError(
        'Không tìm thấy shipping profile',
        404,
        ERROR_CODES.SHIPPING_PROFILE.NOT_FOUND,
      );
    }

    const db = getDB();
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Unset tất cả default cũ (trừ chính profile này)
      await shippingProfileRepository.unsetDefaultForUser(userId, profileId, conn);
      // Set profile này làm default
      await shippingProfileRepository.setDefault(profileId, conn);

      await conn.commit();
      return shippingProfileRepository.findById(profileId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

export default new ShippingProfileService();
