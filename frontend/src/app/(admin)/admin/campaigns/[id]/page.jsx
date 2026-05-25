'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  ArrowLeft,
  Edit,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Tag,
  Zap,
  Megaphone,
  Truck,
  Clock,
} from 'lucide-react';
import adminCampaignService from '@/services/adminCampaignService';
import CampaignForm from '@/components/admin/CampaignForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CAMPAIGN_TYPE_META = {
  PERCENTAGE: { label: 'Giảm %', color: 'bg-violet-100 text-violet-700', Icon: Tag },
  FIXED_PRICE: { label: 'Đồng giá', color: 'bg-blue-100 text-blue-700', Icon: Zap },
  TIER_DISCOUNT: { label: 'Theo bậc', color: 'bg-orange-100 text-orange-700', Icon: Megaphone },
  FREESHIP: { label: 'Freeship', color: 'bg-green-100 text-green-700', Icon: Truck },
};

function getCampaignRunStatus(campaign) {
  const now = new Date();
  const start = new Date(campaign.start_date);
  const end = new Date(campaign.end_date);
  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'running';
}

const RUN_STATUS_META = {
  upcoming: { label: 'Sắp diễn ra', color: 'bg-yellow-100 text-yellow-700' },
  running: { label: 'Đang chạy', color: 'bg-emerald-100 text-emerald-700' },
  ended: { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-500' },
};

function InfoRow({ label, children }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
      <span className="w-44 shrink-0 text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{children}</span>
    </div>
  );
}

import { useConfirm } from '@/components/ui/ConfirmDialog';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [toggling, setToggling] = useState(false);
  const confirm = useConfirm();

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const res = await adminCampaignService.getCampaignById(id);
      // Axios interceptor returns JSON body: { success, data: <campaign> }
      setCampaign(res.data);
    } catch (err) {
      console.error('Failed to load campaign', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const handleToggleStatus = async () => {
    setToggling(true);
    try {
      await adminCampaignService.updateStatus(id, campaign.status === 1 ? 0 : 1);
      toast.success('Campaign status updated');
      fetchCampaign();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm(`Bạn có chắc muốn xóa campaign "${campaign.name}"?`, {
      title: 'Xóa campaign',
      confirmLabel: 'Xóa',
      type: 'danger',
    });
    if (!isConfirmed) return;
    try {
      await adminCampaignService.deleteCampaign(id);
      toast.info('Campaign deleted');
      router.push('/admin/campaigns');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa campaign thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Campaign không tồn tại.</p>
        <Link href="/admin/campaigns" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const typeMeta = CAMPAIGN_TYPE_META[campaign.campaign_type] || {};
  const runStatus = getCampaignRunStatus(campaign);
  const runMeta = RUN_STATUS_META[runStatus];
  const isUpcoming = runStatus === 'upcoming';
  const isEnded = runStatus === 'ended';

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs
        root={{ label: 'Admin', href: '/admin' }}
        items={[
          { label: 'Chiến dịch', href: '/admin/campaigns' },
          { label: campaign.name },
        ]}
      />
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/campaigns" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {campaign.name}
              <span className={`ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeMeta.color}`}>
                {typeMeta.Icon && <typeMeta.Icon size={11} />}
                {typeMeta.label}
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${runMeta.color}`}>
                {runMeta.label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${campaign.status === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                {campaign.status === 1 ? '● Bật' : '○ Tắt'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle status — always available */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={toggling}
            className="flex items-center gap-1.5"
          >
            {campaign.status === 1 ? (
              <><ToggleRight size={16} className="text-emerald-500" /> Tắt</>
            ) : (
              <><ToggleLeft size={16} className="text-gray-400" /> Bật</>
            )}
          </Button>

          {/* Edit — only upcoming */}
          {isUpcoming && mode === 'view' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMode('edit')}
              className="flex items-center gap-1.5"
            >
              <Edit size={15} />
              Chỉnh sửa
            </Button>
          )}

          {/* Delete — only upcoming */}
          {isUpcoming && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="flex items-center gap-1.5 border-red-200 text-red-500 hover:bg-red-50"
            >
              <Trash2 size={15} />
              Xóa
            </Button>
          )}
        </div>
      </div>

      {/* Non-editable notice */}
      {!isUpcoming && mode === 'view' && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${isEnded ? 'bg-gray-50 text-gray-500 border border-gray-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
          <Clock size={15} />
          {isEnded
            ? 'Campaign đã kết thúc. Bạn chỉ có thể xem thông tin.'
            : 'Campaign đang trong thời gian diễn ra. Chỉ có thể bật/tắt — không thể chỉnh sửa nội dung.'}
        </div>
      )}

      {mode === 'edit' ? (
        // Edit mode
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-700">Chỉnh sửa Campaign</h2>
            <button
              onClick={() => setMode('view')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Hủy chỉnh sửa
            </button>
          </div>
          <CampaignForm initialData={campaign} isEdit={true} />
        </div>
      ) : (
        // View mode
        <div className="space-y-4">
          {/* Basic info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Thông tin chung</h2>
            <InfoRow label="ID">#{campaign.campaign_id}</InfoRow>
            {campaign.description && (
              <InfoRow label="Mô tả">{campaign.description}</InfoRow>
            )}
            <InfoRow label="Thời gian">
              {new Date(campaign.start_date).toLocaleString('vi-VN')} → {new Date(campaign.end_date).toLocaleString('vi-VN')}
            </InfoRow>
            <InfoRow label="Ngày tạo">
              {new Date(campaign.created_at).toLocaleString('vi-VN')}
            </InfoRow>
          </div>

          {/* Config */}
          {campaign.config && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Cấu hình giảm giá</h2>
              {campaign.campaign_type === 'PERCENTAGE' && (
                <InfoRow label="Phần trăm giảm">{campaign.config.discount_value}%</InfoRow>
              )}
              {campaign.campaign_type === 'FIXED_PRICE' && (
                <InfoRow label="Đồng giá">{Number(campaign.config.discount_value).toLocaleString('vi-VN')}₫</InfoRow>
              )}
            </div>
          )}

          {/* Tiers */}
          {campaign.tiers && campaign.tiers.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Bậc giảm giá</h2>
              <div className="space-y-2">
                {campaign.tiers.map((t) => (
                  <div key={t.tier_id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">
                      Từ {Number(t.min_order_value).toLocaleString('vi-VN')}₫
                    </span>
                    <span className="font-semibold text-orange-600 text-sm">Giảm {t.discount_value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Sản phẩm áp dụng ({campaign.products?.length ?? 0})
            </h2>
            {!campaign.products || campaign.products.length === 0 ? (
              <p className="text-sm text-gray-400">
                {campaign.campaign_type === 'TIER_DISCOUNT'
                  ? 'Áp dụng toàn bộ sản phẩm'
                  : 'Không có sản phẩm'}
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {campaign.products.map((p) => (
                  <div
                    key={p.product_id}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{p.product_name}</p>
                      <p className="text-xs text-gray-400">ID #{p.product_id}</p>
                    </div>
                    {p.base_price != null && (
                      <span className="text-sm text-gray-500">
                        {Number(p.base_price).toLocaleString('vi-VN')}₫
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
