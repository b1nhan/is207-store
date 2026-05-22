import { create } from 'zustand';
import cartService from '@/services/cartService';

const useCartStore = create((set, get) => ({
  cart_id: null,
  items: [],
  subtotal: 0,
  totalItems: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {

      const response = await cartService.getCart();
      console.log(response)
      set({
        cart_id: response?.cart_id || null,
        items: response?.items || [],
        subtotal: response?.subtotal || 0,
        totalItems: response?.total_items || 0,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Lỗi khi tải giỏ hàng', isLoading: false });
    }
  },

  addToCart: async (variant_id, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.addToCart({ variant_id, quantity });
      set({
        cart_id: response?.cart_id || null,
        items: response?.items || [],
        subtotal: response?.subtotal || 0,
        totalItems: response?.total_items || 0,
        isLoading: false,
      });
      return true; // Để báo thành công cho UI
    } catch (error) {
      set({ error: error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng', isLoading: false });
      return false; // Báo lỗi cho UI
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.updateCartItem(itemId, { quantity });
      set({
        cart_id: response?.cart_id || null,
        items: response?.items || [],
        subtotal: response?.subtotal || 0,
        totalItems: response?.total_items || 0,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Lỗi khi cập nhật số lượng', isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.removeCartItem(itemId);
      set({
        cart_id: response?.cart_id || null,
        items: response?.items || [],
        subtotal: response?.subtotal || 0,
        totalItems: response?.total_items || 0,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Lỗi khi xóa sản phẩm khỏi giỏ', isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.clearCart();
      set({
        cart_id: response?.cart_id || null,
        items: response?.items || [],
        subtotal: response?.subtotal || 0,
        totalItems: response?.total_items || 0,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Lỗi khi xóa giỏ hàng', isLoading: false });
    }
  },

  clearCartState: () => {
    set({
      cart_id: null,
      items: [],
      subtotal: 0,
      totalItems: 0,
      isLoading: false,
      error: null
    });
  }
}));

export default useCartStore;
