'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CampaignForm from '@/components/admin/CampaignForm';

export default function NewCampaignPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/campaigns" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo Campaign Mới</h1>
          <p className="text-sm text-gray-500">Thiết lập chương trình khuyến mãi cho cửa hàng</p>
        </div>
      </div>

      <CampaignForm isEdit={false} />
    </div>
  );
}
