import axios from '@/config/axios';

const adminDashboardService = {
  getSummary: () => {
    return axios.get('/admin/dashboard/summary');
  },
  getRevenue: () => {
    return axios.get('/admin/dashboard/revenue');
  },
  getTopProducts: () => {
    return axios.get('/admin/dashboard/top-products');
  },
};

export default adminDashboardService;
