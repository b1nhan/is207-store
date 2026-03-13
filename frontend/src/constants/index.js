// ─── Constants Barrel ─────────────────────────────────────────────────────────
// Import từ @/constants sẽ resolve file này.
// Re-export tất cả các file con để dùng được ở mọi nơi.

export * from './api';
export * from './routes';
export * from './config';
export * from './enums';

// ─── App-level Constants ──────────────────────────────────────────────────────

export const APP_NAME = 'MyShop';
export const APP_DESCRIPTION = 'Your one-stop online shop';

// ── Local Storage Keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CART: 'cart',
  WISHLIST: 'wishlist',
  RECENT_VIEWED: 'recent_viewed',
};

// ── Image Placeholders ────────────────────────────────────────────────────────
export const IMAGE_PLACEHOLDER = '/images/placeholder.png';
export const AVATAR_PLACEHOLDER = '/images/avatar-placeholder.png';
