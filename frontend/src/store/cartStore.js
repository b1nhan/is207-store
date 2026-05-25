import { create } from 'zustand';
import cartService from '@/services/cartService';
import { toast } from 'sonner';

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
      toast.success('Cart updated');
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
      toast.info('Item removed');
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
  },

  /**
   * Xóa một số items cụ thể khỏi store (local-only, không gọi API).
   * Dùng sau khi checkout một phần — các item còn lại vẫn hiển thị trong giỏ.
   * @param {number[]} itemIds - Danh sách cart_item_id cần xóa khỏi store
   */
  removeItemsFromStore: (itemIds) => {
    const idSet = new Set(itemIds);
    set((state) => {
      const remainingItems = state.items.filter((i) => !idSet.has(i.cart_item_id));
      const newSubtotal = remainingItems.reduce(
        (sum, i) => sum + Number(i.unit_price) * i.quantity,
        0,
      );
      return {
        items: remainingItems,
        subtotal: newSubtotal,
        totalItems: remainingItems.reduce((s, i) => s + i.quantity, 0),
      };
    });
  },
}));

export default useCartStore;
