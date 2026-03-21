import express from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

// FIX 1: Removed the {} braces to match the default export from index.js
import { routes } from './routes/index.js';
import { logger } from './utils/logger.js';

const app = express();

app.use(logger.httpLogger);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// FIX 2: Removed the duplicate manual cors configuration.
// It now uses your dedicated corsOptions file to keep things clean.
app.use(cors(corsOptions));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// Health check — dùng để xác nhận server đang chạy
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Server is running 🚀' });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Phải đặt CUỐI CÙNG, sau tất cả routes
app.use(errorHandler);

export default app;
