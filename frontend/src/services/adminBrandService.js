import axios from '@/config/axios';

const adminBrandService = {
  // Public route – dùng lại để lấy list (không cần admin)
  getAllBrands: (params) => {
    return axios.get('/brands', { params });
  },
  getBrandById: (id) => {
    return axios.get(`/admin/brands/${id}`);
  },
  createBrand: (data) => {
    return axios.post('/admin/brands', data);
  },
  updateBrand: (id, data) => {
    return axios.put(`/admin/brands/${id}`, data);
  },
  deleteBrand: (id) => {
    return axios.delete(`/admin/brands/${id}`);
  },
};

export default adminBrandService;
