'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect to admin products list — editing is done via modal.
 */
export default function EditProductPage() {
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
