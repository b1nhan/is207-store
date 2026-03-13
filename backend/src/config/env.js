import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_VARS = [
  // ─── Server ───────────────────────────────────────────────────────────────
  // "NODE_ENV",
  // ─── Database ─────────────────────────────────────────────────────────────
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  // ─── JWT ──────────────────────────────────────────────────────────────────
  // Uncomment khi làm Auth
  // "JWT_ACCESS_SECRET",
  // "JWT_REFRESH_SECRET",
  // "JWT_ACCESS_EXPIRES_IN",
  // "JWT_REFRESH_EXPIRES_IN",
  // ─── Cloudinary ───────────────────────────────────────────────────────────
  // Uncomment khi làm Upload
  // "CLOUDINARY_CLOUD_NAME",
  // "CLOUDINARY_API_KEY",
  // "CLOUDINARY_API_SECRET",
  'CLIENT_URL',
];

// Kiểm tra các biến bắt buộc — app sẽ crash ngay nếu thiếu
const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Thiếu biến môi trường bắt buộc: ${missing.join(', ')}`);
  process.exit(1);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  CLIENT_URL: process.env.CLIENT_URL,

  // ─── Database ─────────────────────────────────────────────────────────────
  // DB_HOST: process.env.DB_HOST,
  // DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  // DB_USER: process.env.DB_USER,
  // DB_PASSWORD: process.env.DB_PASSWORD,
  // DB_NAME: process.env.DB_NAME,

  // ─── JWT ──────────────────────────────────────────────────────────────────
  // JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  // JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  // JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  // JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // ─── Cloudinary ───────────────────────────────────────────────────────────
  // CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  // CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  // CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default env;
