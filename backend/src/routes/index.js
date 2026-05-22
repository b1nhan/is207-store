import { Router } from 'express';

// ─── Import Routes ────────────────────────────────────────────────────────────
// Uncomment từng nhóm khi bắt đầu làm đến giai đoạn đó

// const authRoutes     = require("./authRoutes");
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import authRoutes from './authRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import adminRoutes from './adminRoutes.js';
import cartRoutes from './cartRoutes.js';
import voucherRoutes from './voucherRoutes.js';
import orderRoutes from './orderRoutes.js';
import campaignRoutes from './campaignRoutes.js';

// const cartRoutes     = require("./cartRoutes");
// const orderRoutes    = require("./orderRoutes");
// const voucherRoutes  = require("./voucherRoutes");
// const uploadRoutes   = require("./uploadRoutes");
// const adminRoutes    = require("./adminRoutes");

const routes = Router();

// ─── Mount Routes ─────────────────────────────────────────────────────────────
// Giai đoạn 1 — Public API
routes.use('/products', productRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/brands', brandRoutes);
routes.use('/campaigns', campaignRoutes);
routes.use('/auth', authRoutes);

// Giai đoạn 2 — Auth

// Giai đoạn 3 — Admin (upload ảnh dùng chung cho admin)
routes.use('/upload', uploadRoutes);
routes.use('/admin', adminRoutes);

// Giai đoạn 4 — Cart & Order (yêu cầu auth)
routes.use('/cart', cartRoutes);
routes.use('/orders', orderRoutes);

// Giai đoạn 5 — Voucher
routes.use('/vouchers', voucherRoutes);

export { routes };
