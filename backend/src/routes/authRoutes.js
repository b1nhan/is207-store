import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';
import validate from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from '../validations/authValdiation.js';

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);

// ── Authenticated (cần JWT access token hợp lệ) ───────────────────────────────
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getMe);
router.post(
  '/change-password',
  verifyToken,
  validate(changePasswordSchema),
  authController.changePassword,
);

export default router;
