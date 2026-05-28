import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/constants/api';

// I5: Refactored to use API_ENDPOINTS.CART — paths now centrally maintained.
const cartService = {
  getCart: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  addToCart: async ({ variant_id, quantity }) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, { variant_id, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, { quantity }) => {
    const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE(itemId), { quantity });
    return response.data;
  },

  updateCartItemVariant: async (itemId, { variant_id, quantity }) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.CART.UPDATE_VARIANT(itemId), { variant_id, quantity });
    return response.data;
  },

  removeCartItem: async (itemId) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(itemId));
    return response.data;
  },

  clearCart: async () => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);
    return response.data;
  },
};

export default cartService;
