'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import { authService } from '@/services/authService';
import { STORAGE_KEYS } from '@/constants';

export default function AuthGuard({ children }) {
  const { setUser, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      
      if (!token) {
        setInitialized(true);
        return;
      }

      try {
        const response = await authService.getMe();
        // Assuming backend returns { data: user } or { data: { user } }
        const user = response.data?.user || response.data || response;
        setUser(user);
      } catch (error) {
        console.error('Failed to initialize auth', error);
        // If getting profile fails (e.g., token invalid and refresh failed), clear tokens
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, setUser, setInitialized]);

  return <>{children}</>;
}
