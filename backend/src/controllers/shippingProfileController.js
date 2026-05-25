import shippingProfileService from '../services/shippingProfileService.js';
import { sendSuccess } from '../utils/response.js';

class ShippingProfileController {
  /**
   * GET /auth/shipping-profiles
   * Lấy danh sách shipping profile của user đang đăng nhập.
   */
  getProfiles = async (req, res, next) => {
    try {
      const profiles = await shippingProfileService.getProfiles(req.user.user_id);
      sendSuccess(res, {
        data: profiles,
        message: 'Lấy danh sách shipping profile thành công',
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /auth/shipping-profiles/:id
   * Lấy chi tiết một shipping profile (kiểm tra ownership).
   */
  getProfileById = async (req, res, next) => {
    try {
      const profile = await shippingProfileService.getProfileById(
        req.user.user_id,
        Number(req.params.id),
      );
      sendSuccess(res, { data: profile });
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /auth/shipping-profiles
   * Tạo shipping profile mới.
   * Body: { receiver_name, receiver_phone, full_address, label?, is_default? }
   */
  createProfile = async (req, res, next) => {
    try {
      const profile = await shippingProfileService.createProfile(
        req.user.user_id,
        req.body,
      );
      sendSuccess(res, {
        data: profile,
        message: 'Tạo shipping profile thành công',
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * PUT /auth/shipping-profiles/:id
   * Cập nhật shipping profile (kiểm tra ownership).
   */
  updateProfile = async (req, res, next) => {
    try {
      const profile = await shippingProfileService.updateProfile(
        req.user.user_id,
        Number(req.params.id),
        req.body,
      );
      sendSuccess(res, {
        data: profile,
        message: 'Cập nhật shipping profile thành công',
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * DELETE /auth/shipping-profiles/:id
   * Xóa shipping profile (kiểm tra ownership).
   * Nếu profile đang là default, KHÔNG tự set default mới.
   */
  deleteProfile = async (req, res, next) => {
    try {
      await shippingProfileService.deleteProfile(
        req.user.user_id,
        Number(req.params.id),
      );
      sendSuccess(res, { message: 'Xóa shipping profile thành công' });
    } catch (err) {
      next(err);
    }
  };

  /**
   * PATCH /auth/shipping-profiles/:id/default
   * Set profile này làm default, unset profile default cũ.
   */
  setDefault = async (req, res, next) => {
    try {
      const profile = await shippingProfileService.setDefault(
        req.user.user_id,
        Number(req.params.id),
      );
      sendSuccess(res, {
        data: profile,
        message: 'Đặt shipping profile mặc định thành công',
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new ShippingProfileController();
