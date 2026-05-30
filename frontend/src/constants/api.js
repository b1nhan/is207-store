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
    UPDATE_PROFILE: '/auth/me/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // ── Products ───────────────────────────────────────────────────────────────
  PRODUCTS: {
    LIST: '/products',
    NEW_ARRIVALS: '/products/new-arrivals',
    BEST_SELLERS: '/products/best-sellers',
    HOT: '/products/hot',
    DETAIL: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    RELATED: (id) => `/products/${id}/related`,
    // C3: BY_SLUG removed — no backend /products/slug/:slug route.
    // C4: FEATURED removed — no backend /products/featured route.
    // I3: REVIEWS removed — no reviews DB table or backend route.
  },

  // ── Categories ─────────────────────────────────────────────────────────────
  CATEGORIES: {
    LIST: '/categories',
    BY_SLUG: (slug) => `/categories/${slug}`,
  },

  // ── Brands ─────────────────────────────────────────────────────────────────
  BRANDS: {
    LIST: '/brands',
    BY_ID: (id) => `/brands/${id}/products`,
  },

  // ── Cart ───────────────────────────────────────────────────────────────────
  // I5: Fixed incorrect paths to match actual backend routes.
  CART: {
    GET: '/cart',
    ADD: '/cart',
    UPDATE: (itemId) => `/cart/${itemId}`,
    UPDATE_VARIANT: (itemId) => `/cart/${itemId}/variant`,
    REMOVE: (itemId) => `/cart/${itemId}`,
    CLEAR: '/cart',
  },

  // ── Orders ─────────────────────────────────────────────────────────────────
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CHECKOUT_PREVIEW: '/orders/checkout/preview',
    CHECKOUT: '/orders/checkout',
    CANCEL: (id) => `/orders/${id}/cancel`,
  },

  // ── Vouchers (shop) ────────────────────────────────────────────────────────
  // W4: VALIDATE removed — no backend /vouchers/validate route.
  VOUCHERS: {
    ACTIVE: '/vouchers/active',
    APPLY: '/vouchers/apply',
  },

  // ── Campaigns (shop) ───────────────────────────────────────────────────────
  CAMPAIGNS: {
    ACTIVE: '/campaigns/active',
    DISCOUNTED_PRODUCTS: '/campaigns/discounted-products',
    DETAIL: (id) => `/campaigns/${id}`,
  },

  // ── Shipping Profiles ──────────────────────────────────────────────────────
  SHIPPING_PROFILES: {
    LIST: '/shipping-profiles',
    DETAIL: (id) => `/shipping-profiles/${id}`,
    CREATE: '/shipping-profiles',
    UPDATE: (id) => `/shipping-profiles/${id}`,
    DELETE: (id) => `/shipping-profiles/${id}`,
    SET_DEFAULT: (id) => `/shipping-profiles/${id}/default`,
  },

  // ── Upload ─────────────────────────────────────────────────────────────────
  UPLOAD: {
    IMAGE: '/upload/image',
    IMAGES: '/upload/images',
  },

  // ── Admin — Dashboard ──────────────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: {
      // I6: Renamed STATS → SUMMARY to match actual backend route /admin/dashboard/summary.
      SUMMARY: '/admin/dashboard/summary',
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
      // I9: Renamed TOGGLE_STATUS → UPDATE_STATUS, fixed path to match backend PATCH /admin/products/:id/status.
      UPDATE_STATUS: (id) => `/admin/products/${id}/status`,
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
    // W5: UPDATE_PAYMENT removed — no backend /admin/orders/:id/payment-status route.
    ORDERS: {
      LIST: '/admin/orders',
      DETAIL: (id) => `/admin/orders/${id}`,
      UPDATE_STATUS: (id) => `/admin/orders/${id}/status`,
      BULK_STATUS: '/admin/orders/bulk-status',
    },

    // ── Admin — Vouchers ─────────────────────────────────────────────────────
    VOUCHERS: {
      LIST: '/admin/vouchers',
      DETAIL: (id) => `/admin/vouchers/${id}`,
      CREATE: '/admin/vouchers',
      UPDATE: (id) => `/admin/vouchers/${id}`,
      DELETE: (id) => `/admin/vouchers/${id}`,
    },

    // ── Admin — Campaigns ────────────────────────────────────────────────────
    CAMPAIGNS: {
      LIST: '/admin/campaigns',
      DETAIL: (id) => `/admin/campaigns/${id}`,
      CREATE: '/admin/campaigns',
      UPDATE: (id) => `/admin/campaigns/${id}`,
      DELETE: (id) => `/admin/campaigns/${id}`,
      UPDATE_STATUS: (id) => `/admin/campaigns/${id}/status`,
      GENERATE_DESCRIPTION: '/admin/campaigns/generate-description',
    },

    // ── Admin — Upload ───────────────────────────────────────────────────────
    UPLOAD: {
      IMAGE: '/admin/upload/image',
      IMAGES: '/admin/upload/images',
    },

    // I1: USER.* group removed — profile via AUTH.ME/UPDATE_PROFILE, addresses via SHIPPING_PROFILES.
    // I2: ADMIN.USERS.* group removed — no backend implementation for user management.
  },
};
