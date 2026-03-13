import { api } from './api';
import { API_ENDPOINTS } from '@/constants/api';

// ─── Product Service ──────────────────────────────────────────────────────────

export const productService = {
  // List with filters/pagination
  getProducts: (params = {}) => api.get(API_ENDPOINTS.PRODUCTS.LIST, params),

  // Detail by ID
  getProduct: (id) => api.get(API_ENDPOINTS.PRODUCTS.DETAIL(id)),

  // Detail by slug (for shop pages)
  getProductBySlug: (slug) => api.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)),

  // Search (used by SearchBar)
  searchProducts: (query, params = {}) =>
    api.get(API_ENDPOINTS.PRODUCTS.SEARCH, { q: query, ...params }),

  // Featured products for homepage
  getFeaturedProducts: (limit = 8) =>
    api.get(API_ENDPOINTS.PRODUCTS.FEATURED, { limit }),

  // Related products on detail page
  getRelatedProducts: (id, limit = 6) =>
    api.get(API_ENDPOINTS.PRODUCTS.RELATED(id), { limit }),

  // Reviews
  getReviews: (id, params = {}) =>
    api.get(API_ENDPOINTS.PRODUCTS.REVIEWS(id), params),

  postReview: (id, data) => api.post(API_ENDPOINTS.PRODUCTS.REVIEWS(id), data),
};
