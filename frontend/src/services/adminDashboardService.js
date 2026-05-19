import axios from '@/config/axios';

const adminDashboardService = {
  getSummary: () => {
    return axios.get('/admin/dashboard/summary');
  },
  // Backend accepts: from, to, groupBy (e.g. 'day'|'week'|'month')
  getRevenue: (params = {}) => {
    return axios.get('/admin/dashboard/revenue', { params });
  },
  // Backend accepts: limit, from, to
  getTopProducts: (params = {}) => {
    return axios.get('/admin/dashboard/top-products', { params });
  },
};

export default adminDashboardService;
