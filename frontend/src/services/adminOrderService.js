import axios from '@/config/axios';

const adminOrderService = {
  getAllOrders: (params) => {
    return axios.get('/admin/orders', { params });
  },
  getOrderById: (id) => {
    return axios.get(`/admin/orders/${id}`);
  },
  updateOrderStatus: (id, status) => {
    return axios.patch(`/admin/orders/${id}/status`, { status });
  },
  updateBulkOrderStatus: (orderIds, status) => {
    return axios.patch('/admin/orders/bulk-status', { orderIds, status });
  },
};

export default adminOrderService;
