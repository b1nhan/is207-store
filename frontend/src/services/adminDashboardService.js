import axios from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';

// I6: Refactored to use API_ENDPOINTS.ADMIN.DASHBOARD constants.
//     Note: was previously STATS ('/admin/dashboard/stats'), now correctly SUMMARY.
const adminDashboardService = {
  getSummary: () => {
    return axios.get(API_ENDPOINTS.ADMIN.DASHBOARD.SUMMARY);
  },
  // Backend accepts: from, to, groupBy (e.g. 'day'|'week'|'month')
  getRevenue: (params = {}) => {
    return axios.get(API_ENDPOINTS.ADMIN.DASHBOARD.REVENUE, { params });
  },
  // Backend accepts: limit, from, to
  getTopProducts: (params = {}) => {
    return axios.get(API_ENDPOINTS.ADMIN.DASHBOARD.TOP_PRODUCTS, { params });
  },
};

export default adminDashboardService;
