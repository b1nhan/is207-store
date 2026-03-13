/**
 * Cấu hình CORS cho Express.
 * Đọc danh sách origin cho phép từ biến môi trường để dễ thay đổi theo môi trường
 * mà không cần sửa code.
 *
 * Cách dùng trong app.js:
 *   const cors = require("cors");
 *   const corsOptions = require("./config/corsOptions");
 *   app.use(cors(corsOptions));
 *
 * Biến môi trường cần thêm vào .env:
 *   # Development
 *   CORS_ORIGIN=http://localhost:5173
 *
 *   # Production (nhiều origin thì ngăn cách bằng dấu phẩy, không có dấu cách)
 *   CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
 */

import env from '../config/env.js';
const rawOrigins = env.CLIENT_URL || 'http://localhost:5173';
const ALLOWED_ORIGINS = rawOrigins.split(',').map((o) => o.trim());

console.log(rawOrigins);
const corsOptions = {
  // ─── Origin ─────────────────────────
  // ─────────────────────────────────────
  origin: (origin, callback) => {
    // Cho phép request không có origin (Postman, mobile app, server-to-server)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Origin không được phép → trả lỗi
    return callback(new Error(`CORS: Origin "${origin}" không được phép`));
  },

  // ─── Credentials ─────────────────────────────────────────────────────────
  // Bắt buộc true nếu frontend gửi cookie (refresh token cookie, session,...)
  credentials: true,

  // ─── Allowed Methods ─────────────────────────────────────────────────────
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // ─── Allowed Headers ─────────────────────────────────────────────────────
  allowedHeaders: [
    'Content-Type',
    'Authorization', // Bearer <accessToken>
  ],

  // ─── Exposed Headers ─────────────────────────────────────────────────────
  // Header nào frontend được đọc từ response (ngoài các header mặc định)
  // exposedHeaders: ["X-Total-Count"], // Uncomment nếu trả pagination qua header

  // ─── Preflight Cache ──────────────────────────────────────────────────────
  // Browser cache kết quả OPTIONS preflight trong bao nhiêu giây
  maxAge: 86400, // 24 giờ
};

export default corsOptions;
