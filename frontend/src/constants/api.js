// ─── API Endpoints ────────────────────────────────────────────────────────────
// Tất cả endpoint gọi tới backend. baseURL được cấu hình trong config/axios.js.
// Các trường là function sẽ nhận tham số động (id, slug, ...).

export const API_ENDPOINTS = {
  // ── Auth ───────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // ── Products ───────────────────────────────────────────────────────────────
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    BY_SLUG: (slug) => `/products/slug/${slug}`,
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    RELATED: (id) => `/products/${id}/related`,
    REVIEWS: (id) => `/products/${id}/reviews`,
  },

  // ── Categories ─────────────────────────────────────────────────────────────
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id) => `/categories/${id}`,
    BY_SLUG: (slug) => `/categories/slug/${slug}`,
  },

  // ── Brands ─────────────────────────────────────────────────────────────────
  BRANDS: {
    LIST: '/brands',
    DETAIL: (id) => `/brands/${id}`,
    BY_SLUG: (slug) => `/brands/slug/${slug}`,
  },

  // ── Cart ───────────────────────────────────────────────────────────────────
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (itemId) => `/cart/items/${itemId}`,
    REMOVE: (itemId) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear',
  },

  // ── Orders ─────────────────────────────────────────────────────────────────
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CREATE: '/orders',
    CANCEL: (id) => `/orders/${id}/cancel`,
  },

  // ── Vouchers (shop) ────────────────────────────────────────────────────────
  VOUCHERS: {
    VALIDATE: '/vouchers/validate',
    APPLY: '/vouchers/apply',
  },

  // ── User ───────────────────────────────────────────────────────────────────
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    ADDRESSES: '/user/addresses',
    ADDRESS_DETAIL: (id) => `/user/addresses/${id}`,
    WISHLIST: '/user/wishlist',
    WISHLIST_ITEM: (id) => `/user/wishlist/${id}`,
  },

  // ── Upload ─────────────────────────────────────────────────────────────────
  UPLOAD: {
    IMAGE: '/upload/image',
    IMAGES: '/upload/images',
  },

  // ── Admin — Dashboard ──────────────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: {
      STATS: '/admin/dashboard/stats',
      REVENUE: '/admin/dashboard/revenue',
      TOP_PRODUCTS: '/admin/dashboard/top-products',
      RECENT_ORDERS: '/admin/dashboard/recent-orders',
    },

    // ── Admin — Products ─────────────────────────────────────────────────────
    PRODUCTS: {
      LIST: '/admin/products',
      DETAIL: (id) => `/admin/products/${id}`,
      CREATE: '/admin/products',
      UPDATE: (id) => `/admin/products/${id}`,
      DELETE: (id) => `/admin/products/${id}`,
      TOGGLE_STATUS: (id) => `/admin/products/${id}/toggle-status`,
    },

    // ── Admin — Categories ───────────────────────────────────────────────────
    CATEGORIES: {
      LIST: '/admin/categories',
      DETAIL: (id) => `/admin/categories/${id}`,
      CREATE: '/admin/categories',
      UPDATE: (id) => `/admin/categories/${id}`,
      DELETE: (id) => `/admin/categories/${id}`,
    },

    // ── Admin — Brands ───────────────────────────────────────────────────────
    BRANDS: {
      LIST: '/admin/brands',
      DETAIL: (id) => `/admin/brands/${id}`,
      CREATE: '/admin/brands',
      UPDATE: (id) => `/admin/brands/${id}`,
      DELETE: (id) => `/admin/brands/${id}`,
    },

    // ── Admin — Orders ───────────────────────────────────────────────────────
    ORDERS: {
      LIST: '/admin/orders',
      DETAIL: (id) => `/admin/orders/${id}`,
      UPDATE_STATUS: (id) => `/admin/orders/${id}/status`,
      UPDATE_PAYMENT: (id) => `/admin/orders/${id}/payment-status`,
    },

    // ── Admin — Vouchers ─────────────────────────────────────────────────────
    VOUCHERS: {
      LIST: '/admin/vouchers',
      DETAIL: (id) => `/admin/vouchers/${id}`,
      CREATE: '/admin/vouchers',
      UPDATE: (id) => `/admin/vouchers/${id}`,
      DELETE: (id) => `/admin/vouchers/${id}`,
      TOGGLE: (id) => `/admin/vouchers/${id}/toggle`,
    },

    // ── Admin — Users ────────────────────────────────────────────────────────
    USERS: {
      LIST: '/admin/users',
      DETAIL: (id) => `/admin/users/${id}`,
      UPDATE_ROLE: (id) => `/admin/users/${id}/role`,
      TOGGLE_BAN: (id) => `/admin/users/${id}/ban`,
    },

    // ── Admin — Upload ───────────────────────────────────────────────────────
    UPLOAD: {
      IMAGE: '/admin/upload/image',
      IMAGES: '/admin/upload/images',
    },
  },
};
