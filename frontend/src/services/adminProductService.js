import axios from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';

// I9: Refactored to use API_ENDPOINTS.ADMIN.PRODUCTS constants.
//     Note: was previously TOGGLE_STATUS pointing to wrong path `/toggle-status`.
//     Now correctly UPDATE_STATUS → `/admin/products/:id/status`.
const adminProductService = {
  getAllProducts: (params) => {
    return axios.get(API_ENDPOINTS.ADMIN.PRODUCTS.LIST, { params });
  },
  getProductById: (id) => {
    return axios.get(API_ENDPOINTS.ADMIN.PRODUCTS.DETAIL(id));
  },
  createProduct: (data) => {
    return axios.post(API_ENDPOINTS.ADMIN.PRODUCTS.CREATE, data);
  },
  updateProduct: (id, data) => {
    return axios.put(API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(id), data);
  },
  updateStatus: (id, status) => {
    return axios.patch(API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE_STATUS(id), { status });
  },
  // ─── Image Management ────────────────────────────────────────────────────────
  addImage: (productId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axios.post(`/admin/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (productId, imageId) => {
    return axios.delete(`/admin/products/${productId}/images/${imageId}`);
  },
  // ─── Variants ────────────────────────────────────────────────────────────────
  addVariant: (productId, data) => {
    return axios.post(`/admin/products/${productId}/variants`, data);
  },
  updateVariant: (variantId, data) => {
    return axios.put(`/admin/products/variants/${variantId}`, data);
  },
  deleteVariant: (variantId) => {
    return axios.delete(`/admin/products/variants/${variantId}`);
  },
  generateDescription: (data) => {
    return axios.post('/admin/products/generate-description', data);
  },
};

export default adminProductService;
