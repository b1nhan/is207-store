import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash một plain-text password.
 * @param {string} plainPassword
 * @returns {Promise<string>} bcrypt hash
 */
export const hashPassword = (plainPassword) =>
  bcrypt.hash(plainPassword, SALT_ROUNDS);

/**
 * So sánh plain-text password với hash đã lưu trong DB.
 * @param {string} plainPassword
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const comparePassword = (plainPassword, hash) =>
  bcrypt.compare(plainPassword, hash);
