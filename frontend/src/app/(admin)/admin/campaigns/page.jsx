'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  Plus,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Tag,
  Zap,
  Truck,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import adminCampaignService from '@/services/adminCampaignService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CAMPAIGN_TYPE_META = {
  PERCENTAGE: {
    label: 'Giảm %',
    color: 'bg-violet-100 text-violet-700',
    Icon: Tag,
  },
  FIXED_PRICE: {
    label: 'Đồng giá',
    color: 'bg-blue-100 text-blue-700',
    Icon: Zap,
  },
  TIER_DISCOUNT: {
    label: 'Theo bậc',
    color: 'bg-orange-100 text-orange-700',
    Icon: Megaphone,
  },
  FREESHIP: {
    label: 'Freeship',
    color: 'bg-green-100 text-green-700',
    Icon: Truck,
  },
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
  running: { label: 'Đang trong thời gian diễn ra', color: 'bg-emerald-100 text-emerald-700' },
  ended: { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-500' },
};

import { useConfirm } from '@/components/ui/ConfirmDialog';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', campaign_type: '', status: '', page: 1 });
  const [togglingId, setTogglingId] = useState(null);
  const confirm = useConfirm();

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.campaign_type) params.campaign_type = filters.campaign_type;
      if (filters.status !== '') params.status = filters.status;
      params.page = filters.page;
      params.limit = 20;

      const res = await adminCampaignService.getAllCampaigns(params);
      // Axios interceptor returns JSON body: { success, data: { items, pagination } }
      const { items, pagination: pg } = res.data || {};
      setCampaigns(items || []);
      if (pg) setPagination(pg);
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleToggleStatus = async (campaign) => {
    setTogglingId(campaign.campaign_id);
    try {
      await adminCampaignService.updateStatus(campaign.campaign_id, campaign.status === 1 ? 0 : 1);
      toast.success('Campaign status updated');
      fetchCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (campaign) => {
    const isConfirmed = await confirm(`Bạn có chắc muốn xóa campaign "${campaign.name}"?`, {
      title: 'Xóa campaign',
      confirmLabel: 'Xóa',
      type: 'danger',
    });
    if (!isConfirmed) return;
    try {
      await adminCampaignService.deleteCampaign(campaign.campaign_id);
      toast.info('Campaign deleted');
      fetchCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa campaign thất bại');
    }
  };

  const canEdit = (campaign) => {
    return getCampaignRunStatus(campaign) === 'upcoming';
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        root={{ label: 'Admin', href: '/admin' }}
        items={[{ label: 'Chiến dịch' }]}
      />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý chương trình khuyến mãi</p>
        </div>
        <Link href="/admin/campaigns/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Tạo Campaign
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      {!loading && campaigns.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Tổng Campaign</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{pagination.totalItems || campaigns.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Đang bật (Active)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {campaigns.filter((c) => c.status === 1).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Đang chạy</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {campaigns.filter((c) => getCampaignRunStatus(c) === 'running').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Sắp diễn ra</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {campaigns.filter((c) => getCampaignRunStatus(c) === 'upcoming').length}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên campaign..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.campaign_type}
          onChange={(e) => handleFilterChange('campaign_type', e.target.value)}
        >
          <option value="">Tất cả loại</option>
          <option value="PERCENTAGE">Giảm %</option>
          <option value="FIXED_PRICE">Đồng giá</option>
          <option value="TIER_DISCOUNT">Theo bậc</option>
          <option value="FREESHIP">Freeship</option>
        </select>

        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đang bật</option>
          <option value="0">Đang tắt</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Tên Campaign</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Loại</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Thời gian</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Sản phẩm</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <Megaphone size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Không có campaign nào</p>
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => {
                  const typeMeta = CAMPAIGN_TYPE_META[c.campaign_type] || {};
                  const runStatus = getCampaignRunStatus(c);
                  const runMeta = RUN_STATUS_META[runStatus];
                  const editable = canEdit(c);

                  return (
                    <tr key={c.campaign_id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">ID #{c.campaign_id}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeMeta.color}`}>
                          {typeMeta.Icon && <typeMeta.Icon size={11} />}
                          {typeMeta.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div>{new Date(c.start_date).toLocaleDateString('vi-VN')}</div>
                        <div className="text-gray-400">→ {new Date(c.end_date).toLocaleDateString('vi-VN')}</div>
                        <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${runMeta.color}`}>
                          {runMeta.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {c.product_count ?? '—'} SP
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          disabled={togglingId === c.campaign_id}
                          className="flex items-center gap-1.5 text-sm font-medium disabled:opacity-50 transition-opacity"
                          title={c.status === 1 ? 'Đang bật — click để tắt' : 'Đang tắt — click để bật'}
                        >
                          {c.status === 1 ? (
                            <ToggleRight size={22} className="text-emerald-500" />
                          ) : (
                            <ToggleLeft size={22} className="text-gray-400" />
                          )}
                          <span className={c.status === 1 ? 'text-emerald-600' : 'text-gray-400'}>
                            {c.status === 1 ? 'Bật' : 'Tắt'}
                          </span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/campaigns/${c.campaign_id}`}>
                            <Button variant="outline" size="icon" title="Xem / Chỉnh sửa">
                              <Eye size={15} />
                            </Button>
                          </Link>
                          {editable && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(c)}
                              title="Xóa"
                            >
                              <Trash2 size={15} className="text-red-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-500">
              Tổng {pagination.totalItems} campaign
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={filters.page <= 1}
                onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-gray-600">
                {filters.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={filters.page >= pagination.totalPages}
                onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
