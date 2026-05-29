import dotenv from 'dotenv';
dotenv.config();

/**
 * CẤU HÌNH GỬI MAIL THÔNG BÁO CHO ADMIN
 * Bạn có thể chỉnh sửa trực tiếp email nhận và thông tin SMTP tại đây,
 * hoặc cấu hình qua file .env ở thư mục backend.
 */
export const MAIL_CONFIG = {
  // 1. Email của Admin nhận thông báo (Chỉnh sửa trực tiếp ở đây hoặc điền ADMIN_EMAIL trong file .env)
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',

  // 2. Email gửi đi (Sender)
  FROM_EMAIL: process.env.SMTP_USER || 'noreply@yourstore.com',

  // 3. Cấu hình dịch vụ gửi mail (SMTP)
  SMTP: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true cho port 465, false cho các port khác (như 587)
    auth: {
      user: process.env.SMTP_USER || '', // Tên đăng nhập SMTP (vd: email Gmail của bạn)
      pass: process.env.SMTP_PASS || '', // Mật khẩu ứng dụng (App Password) hoặc mật khẩu SMTP
    },
  },
};

export default MAIL_CONFIG;
