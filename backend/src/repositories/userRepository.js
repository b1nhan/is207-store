import { getDB } from '../database/connection.js';

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Tìm user theo primary key, kèm role_name.
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
export const findById = async (userId) => {
  const pool = getDB();
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.email, u.password_hash,
            u.full_name, u.phone, u.date_of_birth, u.created_at,
            r.role_name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     WHERE u.user_id = ?`,
    [userId],
  );
  return rows[0] ?? null;
};

/**
 * Tìm user theo email (dùng khi login và kiểm tra trùng).
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export const findByEmail = async (email) => {
  const pool = getDB();
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.email, u.password_hash,
            u.full_name, u.phone, u.created_at,
            r.role_name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     WHERE u.email = ?`,
    [email],
  );
  return rows[0] ?? null;
};

/**
 * Tìm user theo username (dùng khi kiểm tra trùng lúc register).
 * @param {string} username
 * @returns {Promise<object|null>}
 */
export const findByUsername = async (username) => {
  const pool = getDB();
  const [rows] = await pool.query(
    'SELECT user_id FROM users WHERE username = ?',
    [username],
  );
  return rows[0] ?? null;
};

// ─── Write ───────────────────────────────────────────────────────────────────

/**
 * Tạo user mới với role 'user' (role mặc định).
 * role_id được resolve động theo tên để tránh hardcode ID.
 *
 * @param {{ username, email, password_hash, full_name?, phone? }} userData
 * @returns {Promise<number>} insertId của user vừa tạo
 */
export const createUser = async ({
  username,
  email,
  password_hash,
  full_name = null,
  phone = null,
}) => {
  const pool = getDB();

  // Lấy role_id của 'user' — DB agnostic, không phụ thuộc thứ tự seed
  const [[role]] = await pool.query(
    "SELECT role_id FROM roles WHERE role_name = 'user'",
  );

  if (!role) {
    throw new Error(
      "Role 'user' không tồn tại trong bảng roles — hãy chạy seed trước",
    );
  }

  const [result] = await pool.query(
    `INSERT INTO users (role_id, username, email, password_hash, full_name, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [role.role_id, username, email, password_hash, full_name, phone],
  );

  return result.insertId;
};

/**
 * Cập nhật password hash cho user.
 * @param {number} userId
 * @param {string} newPasswordHash
 */
export const updatePassword = async (userId, newPasswordHash) => {
  const pool = getDB();
  await pool.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [
    newPasswordHash,
    userId,
  ]);
};
