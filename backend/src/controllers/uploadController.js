import uploadService from '../services/uploadService.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';
import { sendSuccess } from '../utils/response.js';

class UploadController {
  /**
   * POST /upload/image
   * Body: multipart/form-data — field name "image"
   * Middleware chain: verifyToken → requireAdmin → upload.single('image') → đây
   */
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        throw new AppError(
          'Không có file được gửi lên.',
          400,
          ERROR_CODES.UPLOAD.NO_FILE,
        );
      }

      const { buffer, mimetype } = req.file;
      const result = await uploadService.uploadImage(buffer, mimetype);

      sendSuccess(res, {
        data: result,
        message: 'Upload ảnh thành công.',
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /upload/image
   * Body: { publicId: string }
   */
  async deleteImage(req, res, next) {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        throw new AppError(
          'publicId là bắt buộc.',
          400,
          ERROR_CODES.UPLOAD.PUBLIC_ID_REQUIRED,
        );
      }

      await uploadService.deleteImage(publicId);

      sendSuccess(res, { data: null, message: 'Xóa ảnh thành công.' });
    } catch (err) {
      next(err);
    }
  }
}

export default new UploadController();
