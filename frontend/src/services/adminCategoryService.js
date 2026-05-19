import axios from '@/config/axios';

const adminCategoryService = {
  // Public route – dùng lại để lấy list (không cần admin)
  getAllCategories: (params) => {
    return axios.get('/categories', { params });
  },
  getCategoryById: (id) => {
    return axios.get(`/admin/categories/${id}`);
  },
  createCategory: (data) => {
    return axios.post('/admin/categories', data);
  },
  updateCategory: (id, data) => {
    return axios.put(`/admin/categories/${id}`, data);
  },
  deleteCategory: (id) => {
    return axios.delete(`/admin/categories/${id}`);
  },
};

export default adminCategoryService;
