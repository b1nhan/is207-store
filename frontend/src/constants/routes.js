// ─── App Routes ───────────────────────────────────────────────────────────────

export const ROUTES = {
  // ── Public ──────────────────────────────────────────────────────────────────
  HOME: '/',
  SEARCH: '/search',

  // ── Products ────────────────────────────────────────────────────────────────
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug) => `/products/${slug}`,
  CATEGORY: (slug) => `/category/${slug}`,

  // ── Auth ────────────────────────────────────────────────────────────────────
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,

  // ── User ────────────────────────────────────────────────────────────────────
  PROFILE: '/account/profile',
  ORDERS: '/account/orders',
  ORDER_DETAIL: (id) => `/account/orders/${id}`,
  ADDRESSES: '/account/addresses',
  WISHLIST: '/account/wishlist',

  // ── Cart & Checkout ─────────────────────────────────────────────────────────
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: (id) => `/checkout/success/${id}`,

  // ── Admin ────────────────────────────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    PRODUCT_CREATE: '/admin/products/create',
    PRODUCT_EDIT: (id) => `/admin/products/${id}/edit`,
    ORDERS: '/admin/orders',
    ORDER_DETAIL: (id) => `/admin/orders/${id}`,
    USERS: '/admin/users',
    CATEGORIES: '/admin/categories',
    SETTINGS: '/admin/settings',
  },
};
