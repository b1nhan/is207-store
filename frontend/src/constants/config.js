// ─── App Config ───────────────────────────────────────────────────────────────

export const CONFIG = {
  APP_NAME: 'MyShop',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  API_TIMEOUT: 15000,

  // ── Upload ─────────────────────────────────────────────────────────────────
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_IMAGES: 10,
  },

  // ── Pagination ─────────────────────────────────────────────────────────────
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    ADMIN_LIMIT: 20,
  },

  // ── Cache ──────────────────────────────────────────────────────────────────
  CACHE: {
    PRODUCTS_TTL: 5 * 60 * 1000, // 5 minutes
    CATEGORIES_TTL: 10 * 60 * 1000, // 10 minutes
  },

  // ── Debounce ───────────────────────────────────────────────────────────────
  DEBOUNCE_DELAY: 400,
  SEARCH_MIN_LENGTH: 2,
};
