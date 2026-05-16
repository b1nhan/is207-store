import axiosInstance from '@/config/axios';

const voucherService = {
  applyVoucher: async (data) => {
    // Expected data: { code: string, order_value: number } or just { code: string } depending on API. Based on backend, it might be { code: string }
    const response = await axiosInstance.post('/vouchers/apply', data);
    return response.data;
  },

  getActiveVouchers: async () => {
    const response = await axiosInstance.get('/vouchers/active');
    return response.data;
  },
};

export default voucherService;
