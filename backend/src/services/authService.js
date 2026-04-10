import * as userRepo from '../repositories/userRepository.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

// ─── Register ────────────────────────────────────────────────────────────────

/**
 * Đăng ký tài khoản mới.
 * @param {{ username, email, password, full_name?, phone? }} dto
 * @returns {{ user_id, email, username, role, created_at }}
 * @throws {AppError} EMAIL_ALREADY_EXISTS | USERNAME_ALREADY_EXISTS
 */
export const register = async ({
  username,
  email,
  password,
  full_name,
  phone,
}) => {
  // 1. Kiểm tra trùng email
  const existingEmail = await userRepo.findByEmail(email);
  if (existingEmail) {
    throw new AppError(
      'Email đã được đăng ký trong hệ thống',
      409,
      'EMAIL_ALREADY_EXISTS',
    );
  }

  // 2. Kiểm tra trùng username
  const existingUsername = await userRepo.findByUsername(username);
  if (existingUsername) {
    throw new AppError('Username đã tồn tại', 409, 'USERNAME_ALREADY_EXISTS');
  }

  // 3. Hash password và lưu DB
  const password_hash = await hashPassword(password);
  const userId = await userRepo.createUser({
    username,
    email,
    password_hash,
    full_name,
    phone,
  });

  // 4. Trả về public fields (không bao giờ trả hash)
  const user = await userRepo.findById(userId);
  return {
    user_id: user.user_id,
    email: user.email,
    username: user.username,
    role: user.role.toUpperCase(),
    created_at: user.created_at,
  };
};

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * Xác thực user và cấp tokens.
 * @param {{ email, password }} dto
 * @returns {{ accessToken, refreshToken, user }}
 * @throws {AppError} INVALID_CREDENTIALS
 */
export const login = async ({ email, password }) => {
  // 1. Tìm user — dùng message chung để tránh lộ thông tin tài khoản
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError('Sai email hoặc mật khẩu', 401, 'INVALID_CREDENTIALS');
  }

  // 2. Kiểm tra password
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Sai email hoặc mật khẩu', 401, 'INVALID_CREDENTIALS');
  }

  // 3. Ký tokens
  const accessToken = generateAccessToken({
    user_id: user.user_id,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({ user_id: user.user_id });

  return {
    accessToken,
    refreshToken,
    user: {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role.toUpperCase(),
    },
  };
};

// ─── Get current user ────────────────────────────────────────────────────────

/**
 * Lấy thông tin profile của user đang đăng nhập.
 * @param {number} userId  - Lấy từ req.user.user_id (gắn bởi verifyToken)
 * @returns {object} public user fields (không có password_hash)
 * @throws {AppError} USER_NOT_FOUND
 */
export const getMe = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('Người dùng không tồn tại', 404, 'USER_NOT_FOUND');
  }

  // Loại bỏ password_hash trước khi trả về
  const { password_hash, ...publicFields } = user;
  return { ...publicFields, role: publicFields.role.toUpperCase() };
};

// ─── Change password ─────────────────────────────────────────────────────────

/**
 * Xác thực mật khẩu cũ và thay bằng mật khẩu mới.
 * @param {number} userId
 * @param {{ current_password, new_password }} dto
 * @throws {AppError} USER_NOT_FOUND | INCORRECT_PASSWORD
 */
export const changePassword = async (
  userId,
  { current_password, new_password },
) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('Người dùng không tồn tại', 404, 'USER_NOT_FOUND');
  }

  const isMatch = await comparePassword(current_password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Mật khẩu cũ không đúng', 401, 'INCORRECT_PASSWORD');
  }

  const newHash = await hashPassword(new_password);
  await userRepo.updatePassword(userId, newHash);
};
