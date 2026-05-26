import axios from '@/config/axios';

const adminProductService = {
  getAllProducts: (params) => {
    return axios.get('/admin/products', { params });
  },
  getProductById: (id) => {
    return axios.get(`/admin/products/${id}`);
  },
  createProduct: (data) => {
    return axios.post('/admin/products', data);
  },
  updateProduct: (id, data) => {
    return axios.put(`/admin/products/${id}`, data);
  },
  updateStatus: (id, status) => {
    return axios.patch(`/admin/products/${id}/status`, { status });
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
