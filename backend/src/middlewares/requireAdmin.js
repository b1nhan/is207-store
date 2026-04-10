import AppError from '../utils/AppError.js';
import UserRole from '../constants/userRole.js';

/**
 * Middleware bảo vệ route chỉ dành cho Admin.
 * Phải đặt SAU verifyToken trong chuỗi middleware.
 *
 * @example
 * router.post('/products', verifyToken, requireAdmin, productController.create);
 */
const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== UserRole.ADMIN) {
    return next(new AppError('Không có quyền truy cập', 403, 'FORBIDDEN'));
  }
  next();
};

export default requireAdmin;
