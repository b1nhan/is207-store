const express = require('express');
// const cors = require("cors");
// const corsOptions = require("./config/corsOptions");
// const { notFound } = require("./middlewares/notFound");
// const { errorHandler } = require("./middlewares/errorHandler");
// const routes = require("./routes/index");

const app = express();

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// app.use(cors(corsOptions));

// ─── Routes ───────────────────────────────────────────────────────────────────
// app.use("/api", routes);

// Health check — dùng để xác nhận server đang chạy
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Server is running 🚀' });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
// app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Phải đặt CUỐI CÙNG, sau tất cả routes
// app.use(errorHandler);

module.exports = app;
