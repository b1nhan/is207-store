/**
 * Hằng số phân quyền người dùng.
 * Giá trị phải khớp với cột role_name trong bảng roles (DB).
 */
const UserRole = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
});

export default UserRole;
