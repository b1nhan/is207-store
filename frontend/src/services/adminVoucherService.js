import axios from '@/config/axios';

const adminVoucherService = {
  getAllVouchers: (params) => {
    return axios.get('/admin/vouchers', { params });
  },
  getVoucherById: (id) => {
    return axios.get(`/admin/vouchers/${id}`);
  },
  createVoucher: (data) => {
    return axios.post('/admin/vouchers', data);
  },
  updateVoucher: (id, data) => {
    return axios.put(`/admin/vouchers/${id}`, data);
  },
  deleteVoucher: (id) => {
    return axios.delete(`/admin/vouchers/${id}`);
  },
  generateDescription: (data) => {
    return axios.post('/admin/vouchers/generate-description', data);
  },
};

export default adminVoucherService;
