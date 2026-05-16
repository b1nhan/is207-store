import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import requireAdmin from '../middlewares/requireAdmin.js';
import upload from '../middlewares/uploadMiddleware.js';
import uploadController from '../controllers/uploadController.js';

const router = Router();

// POST /upload/image — upload ảnh lên Cloudinary
// multipart/form-data, field name: "image"
router.post(
  '/image',
  verifyToken,
  requireAdmin,
  upload.single('image'),
  uploadController.uploadImage,
);

// DELETE /upload/image — xóa ảnh khỏi Cloudinary
// Body: { publicId: string }
router.delete('/image', verifyToken, requireAdmin, uploadController.deleteImage);

export default router;
