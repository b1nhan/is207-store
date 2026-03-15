/**
 * Logger đơn giản dùng console, có timestamp và log level.
 * Không dùng thư viện ngoài (winston, pino,...) để giữ project gọn.
 *
 * Log level theo môi trường:
 *   - development : debug + info + warn + error
 *   - production  : warn + error (ẩn debug và info)
 *
 * Cách dùng:
 *   const logger = require("../utils/logger");
 *
 *   logger.info("Server started on port 8080");
 *   logger.debug("Query result", { rows: 10 });
 *   logger.warn("Deprecated field used", { field: "username" });
 *   logger.error("Unhandled error", err);
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ─── Màu ANSI cho terminal ────────────────────────────────────────────────────
const COLOR = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const timestamp = () => {
  return new Date().toISOString(); // 2026-03-15T10:30:00.000Z
};

const formatMeta = (meta) => {
  if (!meta) return '';
  if (meta instanceof Error) {
    return `\n${meta.stack || meta.message}`;
  }
  try {
    return '\n' + JSON.stringify(meta, null, 2);
  } catch {
    return '\n[Unserializable object]';
  }
};

// ─── Log functions ────────────────────────────────────────────────────────────

/**
 * Debug — thông tin chi tiết khi dev (query, biến trung gian,...)
 * Bị ẩn ở production.
 */
const debug = (message, meta) => {
  if (IS_PRODUCTION) return;
  console.debug(
    `${COLOR.gray}[${timestamp()}] [DEBUG] ${message}${formatMeta(meta)}${COLOR.reset}`,
  );
};

/**
 * Info — thông tin hoạt động bình thường (server start, request,...)
 * Bị ẩn ở production.
 */
const info = (message, meta) => {
  if (IS_PRODUCTION) return;
  console.info(
    `${COLOR.cyan}[${timestamp()}] [INFO]  ${message}${formatMeta(meta)}${COLOR.reset}`,
  );
};

/**
 * Warn — cảnh báo không gây crash nhưng cần chú ý
 * (dùng deprecated field, retry,...)
 */
const warn = (message, meta) => {
  console.warn(
    `${COLOR.yellow}[${timestamp()}] [WARN]  ${message}${formatMeta(meta)}${COLOR.reset}`,
  );
};

/**
 * Error — lỗi nghiêm trọng, luôn log ở mọi môi trường.
 * Truyền Error object vào meta để in stack trace.
 *
 * @example
 * logger.error("Database connection failed", err);
 */
const error = (message, meta) => {
  console.error(
    `${COLOR.red}[${timestamp()}] [ERROR] ${message}${formatMeta(meta)}${COLOR.reset}`,
  );
};

// ─── HTTP Request Logger (dùng như Express middleware) ────────────────────────
/**
 * Log mỗi request đến server. Dùng trong app.js:
 *   app.use(logger.httpLogger);
 *
 * Chỉ active ở development.
 */
const httpLogger = (req, res, next) => {
  if (IS_PRODUCTION) return next();

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500
        ? COLOR.red
        : res.statusCode >= 400
          ? COLOR.yellow
          : COLOR.green;

    console.info(
      `${COLOR.gray}[${timestamp()}]${COLOR.reset} ` +
        `${COLOR.cyan}${req.method.padEnd(7)}${COLOR.reset} ` +
        `${statusColor}${res.statusCode}${COLOR.reset} ` +
        `${req.originalUrl} ` +
        `${COLOR.gray}(${duration}ms)${COLOR.reset}`,
    );
  });

  next();
};

const logger = { debug, info, warn, error, httpLogger };

export { logger };
