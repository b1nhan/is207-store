import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';
import validate from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validations/authValdiation.js';
import shippingProfileRoutes from './shippingProfileRoutes.js';

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);

// ── Authenticated (cần JWT access token hợp lệ) ───────────────────────────────
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getMe);
router.patch(
  '/me/profile',
  verifyToken,
  validate(updateProfileSchema),
  authController.updateProfile,
);
router.post(
  '/change-password',
  verifyToken,
  validate(changePasswordSchema),
  authController.changePassword,
);

// ── Shipping Profiles ────────────────────────────────────────────────────────────────
// Sub-router được bảo vệ bởi verifyToken — áp cho toàn bộ /auth/shipping-profiles
router.use('/shipping-profiles', verifyToken, shippingProfileRoutes);

export default router;
