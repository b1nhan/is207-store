import { api } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export const brandService = {
  getBrand: () => api.get(API_ENDPOINTS.BRANDS.LIST),

  getProductByID: (id) => api.get(API_ENDPOINTS.BRANDS.BY_ID(id)),
};
