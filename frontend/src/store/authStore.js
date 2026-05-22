import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setUser: (user) => set({ user, isAuthenticated: !!user, isInitialized: true }),

  updateUser: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : state.user,
    })),

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    set({ user: null, isAuthenticated: false });
  },

  setInitialized: (status) => set({ isInitialized: status })
}));

export default useAuthStore;
