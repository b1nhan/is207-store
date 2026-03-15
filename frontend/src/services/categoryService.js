import { api } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export const categoryService = {
  getCategories: () => api.get(API_ENDPOINTS.CATEGORIES.LIST),

  getProductBySlug: (slug) => api.get(API_ENDPOINTS.CATEGORIES.BY_SLUG(slug)),
};
