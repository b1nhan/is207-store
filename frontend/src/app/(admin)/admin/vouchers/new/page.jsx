'use client';

import { useRouter } from 'next/navigation';
import VoucherForm from '@/components/admin/VoucherForm';

export default function NewVoucherPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6">Thêm Voucher Mới</h1>
      <VoucherForm
        mode="create"
        onSuccess={() => router.push('/admin/vouchers')}
        onCancel={() => router.back()}
      />
    </div>
  );
}
