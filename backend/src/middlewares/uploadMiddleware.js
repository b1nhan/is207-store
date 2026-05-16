import multer from 'multer';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new AppError(
          'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPEG, PNG, WebP.',
          400,
          ERROR_CODES.UPLOAD.INVALID_TYPE,
        ),
      );
    }
    cb(null, true);
  },
});

export default upload;
