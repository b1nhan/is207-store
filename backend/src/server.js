require('dotenv').config();
const app = require('./app');
// const { connectDB } = require("./database/connection");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  // ─── Database ───────────────────────────────────────────────────────────────
  // Uncomment khi đã cấu hình database/connection.js
  // await connectDB();

  // ─── Start HTTP Server ──────────────────────────────────────────────────────
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    // console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();

// ─── Unhandled Errors ────────────────────────────────────────────────────────
// Bắt các lỗi async không được xử lý — nên uncomment khi lên production
// process.on("unhandledRejection", (reason) => {
//   console.error("Unhandled Rejection:", reason);
//   process.exit(1);
// });

// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   process.exit(1);
// });
