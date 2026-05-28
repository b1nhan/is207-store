import axiosInstance from '@/config/axios';

// NOTE: axiosInstance response interceptor already unwraps response.data,
// so each method receives the full API payload { success, message, data }.
// We return `response.data` to give callers the actual data object directly.

const orderService = {
  previewCheckout: async (data) => {
    const response = await axiosInstance.post('/orders/checkout/preview', data);
    return response.data;
  },

  checkout: async (data) => {
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

  // W2: Removed unused `cancel_reason` body — backend ignores req.body entirely.
  cancelOrder: async (id) => {
    const response = await axiosInstance.post(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;
