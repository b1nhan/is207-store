import { api } from './api';
import { API_ENDPOINTS } from '@/constants/api';

// ─── Product Service ──────────────────────────────────────────────────────────

export const productService = {
  // List with filters/pagination
  getProducts: (params = {}) => api.get(API_ENDPOINTS.PRODUCTS.LIST, params),

  // Detail by ID
  getProduct: (id) => api.get(API_ENDPOINTS.PRODUCTS.DETAIL(id)),

  // Search (used by SearchBar)
  searchProducts: (query, params = {}) =>
    api.get(API_ENDPOINTS.PRODUCTS.SEARCH, { q: query, ...params }),

  // Related products on detail page
  getRelatedProducts: (id, limit = 6) =>
    api.get(API_ENDPOINTS.PRODUCTS.RELATED(id), { limit }),

  // New arrivals
  getNewArrivals: (limit = 10) =>
    api.get(API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS, { limit }),

  // Best sellers
  getBestSellers: (limit = 10) =>
    api.get(API_ENDPOINTS.PRODUCTS.BEST_SELLERS, { limit }),

  // Hot products
  getHotProducts: (limit = 10) =>
    api.get(API_ENDPOINTS.PRODUCTS.HOT, { limit }),

  // Detail by slug
  getProductBySlug: (slug) => api.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)),

  // C4: getFeaturedProducts removed — no backend /products/featured route exists.
  //     Use getNewArrivals() or getHotProducts() for homepage featured sections.

  // I3: getReviews / postReview removed — no reviews DB table or backend route.
  //     Implement when the review feature is planned end-to-end.
};
