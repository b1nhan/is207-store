import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';

class UploadService {
  /**
   * Upload ảnh lên Cloudinary từ buffer trong bộ nhớ (multer memoryStorage).
   *
   * @param {Buffer} buffer   - File buffer từ req.file.buffer
   * @param {string} mimetype - MIME type từ req.file.mimetype
   * @param {string} [folder] - Thư mục lưu trên Cloudinary (default: 'products')
   * @returns {Promise<{ url: string, publicId: string }>}
   */
  async uploadImage(buffer, mimetype, folder = 'products') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new AppError(
                'Upload ảnh lên Cloudinary thất bại.',
                500,
                ERROR_CODES.UPLOAD.CLOUDINARY_ERROR,
              ),
            );
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      // Chuyển Buffer thành Readable stream và pipe vào Cloudinary
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Xóa ảnh khỏi Cloudinary theo publicId.
   *
   * @param {string} publicId - Public ID của ảnh trên Cloudinary
   * @returns {Promise<void>}
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });

      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new AppError(
          'Xóa ảnh khỏi Cloudinary thất bại.',
          500,
          ERROR_CODES.UPLOAD.DELETE_FAILED,
        );
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        'Xóa ảnh khỏi Cloudinary thất bại.',
        500,
        ERROR_CODES.UPLOAD.DELETE_FAILED,
      );
    }
  }
}

export default new UploadService();
