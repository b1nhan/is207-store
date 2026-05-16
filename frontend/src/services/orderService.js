import axiosInstance from '@/config/axios';

const orderService = {
  checkout: async (data) => {
    // Expected data: { shipping_address, payment_method, voucher_code, note } etc.
    const response = await axiosInstance.post('/orders/checkout', data);
    return response.data;
  },

  getOrders: async (params) => {
    const response = await axiosInstance.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id, reason) => {
    const response = await axiosInstance.post(`/orders/${id}/cancel`, { cancel_reason: reason });
    return response.data;
  },
};

export default orderService;
