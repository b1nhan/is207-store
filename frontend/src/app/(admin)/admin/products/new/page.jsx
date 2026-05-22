'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This page is kept for backward compatibility (e.g. direct link navigation).
 * Product creation is now handled via the modal on the admin products list.
 * Redirect immediately to the list page.
 */
export default function NewProductPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/products');
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center text-gray-400">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3" />
      Đang chuyển hướng...
    </div>
  );
}
