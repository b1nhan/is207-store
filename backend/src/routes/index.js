import { Router } from 'express';

// ─── Import Routes ────────────────────────────────────────────────────────────
// Uncomment từng nhóm khi bắt đầu làm đến giai đoạn đó

// const authRoutes     = require("./authRoutes");
import productRoutes from './productRoutes.js';

// const categoryRoutes = require("./categoryRoutes");
// const brandRoutes    = require("./brandRoutes");
// const cartRoutes     = require("./cartRoutes");
// const orderRoutes    = require("./orderRoutes");
// const voucherRoutes  = require("./voucherRoutes");
// const uploadRoutes   = require("./uploadRoutes");
// const adminRoutes    = require("./adminRoutes");

const routes = Router();

// ─── Mount Routes ─────────────────────────────────────────────────────────────
// Giai đoạn 1 — Public API
routes.use('/products', productRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/brands",     brandRoutes);

// Giai đoạn 2 — Auth
// router.use("/auth",       authRoutes);

// Giai đoạn 3 — Admin (upload ảnh dùng chung cho admin)
// router.use("/upload",     uploadRoutes);
// router.use("/admin",      adminRoutes);

// Giai đoạn 4 — Cart & Order (yêu cầu auth)
// router.use("/cart",       cartRoutes);
// router.use("/orders",     orderRoutes);

// Giai đoạn 5 — Voucher
// router.use("/vouchers",   voucherRoutes);

export { routes };
