'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';

export default function AdminGuard({ children }) {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isInitialized, user, router, pathname]);

  if (!isInitialized || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 w-full">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Truy cập bị từ chối</h1>
          <p className="text-gray-600 mb-8">
            Bạn không có quyền truy cập vào trang quản trị. Vui lòng quay lại trang chủ hoặc đăng nhập bằng tài khoản quản trị viên.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
