import axiosInstance from '@/config/axios';

const cartService = {
  getCart: async () => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  addToCart: async ({ variant_id, quantity }) => {
    const response = await axiosInstance.post('/cart', { variant_id, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, { quantity }) => {
    const response = await axiosInstance.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeCartItem: async (itemId) => {
    const response = await axiosInstance.delete(`/cart/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await axiosInstance.delete('/cart');
    return response.data;
  },
};

export default cartService;
