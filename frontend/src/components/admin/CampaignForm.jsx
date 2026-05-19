'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Info } from 'lucide-react';
import adminCampaignService from '@/services/adminCampaignService';
import adminProductService from '@/services/adminProductService';
import { Button } from '@/components/ui/button';

// ── helpers ──────────────────────────────────────────────────────────────────

function toDatetimeLocal(iso) {
  if (!iso) return '';
  return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

function toISOString(local) {
  if (!local) return '';
  return new Date(local).toISOString();
}

// ── sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function FieldRow({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// Product picker with search
function ProductPicker({ selectedIds, onChange, allProducts, loadingProducts }) {
  const [search, setSearch] = useState('');

  const filtered = allProducts.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(p.product_id).includes(search)
  );

  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loadingProducts ? (
        <p className="text-sm text-gray-400 py-2">Đang tải sản phẩm...</p>
      ) : (
        <div className="max-h-52 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <p className="p-3 text-sm text-gray-400 text-center">Không tìm thấy sản phẩm</p>
          ) : (
            filtered.map((p) => {
              const checked = selectedIds.includes(p.product_id);
              return (
                <label
                  key={p.product_id}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${checked ? 'bg-blue-50/50' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(p.product_id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">ID #{p.product_id}</p>
                  </div>
                  {p.base_price != null && (
                    <span className="text-xs text-gray-500 shrink-0">
                      {p.base_price.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </label>
              );
            })
          )}
        </div>
      )}
      {selectedIds.length > 0 && (
        <p className="text-xs text-blue-600 font-medium">✓ Đã chọn {selectedIds.length} sản phẩm</p>
      )}
    </div>
  );
}

// Tier editor
function TiersEditor({ tiers, onChange }) {
  const addTier = () => {
    onChange([...tiers, { min_order_value: '', discount_value: '' }]);
  };

  const removeTier = (idx) => {
    onChange(tiers.filter((_, i) => i !== idx));
  };

  const updateTier = (idx, field, value) => {
    const next = tiers.map((t, i) => (i === idx ? { ...t, [field]: value } : t));
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {tiers.map((tier, idx) => (
        <div key={idx} className="flex items-end gap-3">
          <div className="flex-1">
            {idx === 0 && (
              <label className="block text-xs font-medium text-gray-500 mb-1">Tổng tiền tối thiểu (VND)</label>
            )}
            <input
              type="number"
              placeholder="VD: 500000"
              min={0}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tier.min_order_value}
              onChange={(e) => updateTier(idx, 'min_order_value', e.target.value)}
            />
          </div>
          <div className="flex-1">
            {idx === 0 && (
              <label className="block text-xs font-medium text-gray-500 mb-1">Giảm (%)</label>
            )}
            <input
              type="number"
              placeholder="VD: 10"
              min={1}
              max={99}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tier.discount_value}
              onChange={(e) => updateTier(idx, 'discount_value', e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => removeTier(idx)}
            className="p-2 text-red-400 hover:text-red-600 transition-colors"
            title="Xóa bậc này"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addTier}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus size={15} />
        Thêm bậc
      </button>
    </div>
  );
}

// ── Main Form Component ───────────────────────────────────────────────────────

export default function CampaignForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        description: initialData.description || '',
        campaign_type: initialData.campaign_type || 'PERCENTAGE',
        start_date: toDatetimeLocal(initialData.start_date),
        end_date: toDatetimeLocal(initialData.end_date),
        status: initialData.status ?? 1,
        discount_value: initialData.config?.discount_value ?? '',
        tiers: initialData.tiers?.map((t) => ({
          min_order_value: t.min_order_value,
          discount_value: t.discount_value,
        })) || [{ min_order_value: '', discount_value: '' }],
        product_ids: (initialData.products || []).map((p) => p.product_id),
      };
    }
    return {
      name: '',
      description: '',
      campaign_type: 'PERCENTAGE',
      start_date: '',
      end_date: '',
      status: 1,
      discount_value: '',
      tiers: [{ min_order_value: '', discount_value: '' }],
      product_ids: [],
    };
  });

  // Load all products for the picker
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await adminProductService.getAllProducts({ limit: 200, page: 1 });
        const items = res.data?.data?.items || res.data?.data || res.data || [];
        setAllProducts(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const needsConfig = ['PERCENTAGE', 'FIXED_PRICE'].includes(form.campaign_type);
  const needsTiers = form.campaign_type === 'TIER_DISCOUNT';
  const needsProducts = ['PERCENTAGE', 'FIXED_PRICE', 'FREESHIP'].includes(form.campaign_type);

  const buildPayload = () => {
    const payload = {
      name: form.name,
      description: form.description || undefined,
      campaign_type: form.campaign_type,
      start_date: toISOString(form.start_date),
      end_date: toISOString(form.end_date),
      status: Number(form.status),
    };

    if (needsConfig) {
      payload.config = { discount_value: Number(form.discount_value) };
    }

    if (needsTiers) {
      payload.tiers = form.tiers.map((t) => ({
        min_order_value: Number(t.min_order_value),
        discount_value: Number(t.discount_value),
      }));
    }

    if (needsProducts || form.campaign_type === 'TIER_DISCOUNT') {
      payload.product_ids = form.product_ids;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await adminCampaignService.updateCampaign(initialData.campaign_id, payload);
      } else {
        await adminCampaignService.createCampaign(payload);
      }
      router.push('/admin/campaigns');
    } catch (err) {
      const msg = err.response?.data?.message || (isEdit ? 'Cập nhật thất bại' : 'Tạo thất bại');
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const configLabel = form.campaign_type === 'PERCENTAGE'
    ? 'Phần trăm giảm (%) *'
    : 'Đồng giá — Giá bán (VND) *';

  const configHint = form.campaign_type === 'PERCENTAGE'
    ? 'Nhập từ 1 đến 99'
    : 'Tất cả sản phẩm trong campaign sẽ bán với mức giá này';

  const productPickerTitle =
    form.campaign_type === 'TIER_DISCOUNT'
      ? 'Sản phẩm áp dụng (để trống = áp toàn bộ)'
      : 'Sản phẩm áp dụng *';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <SectionCard title="Thông tin cơ bản">
        <FieldRow label="Tên campaign" required>
          <input
            type="text"
            required
            maxLength={255}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="VD: Flash Sale 5.5"
          />
        </FieldRow>

        <FieldRow label="Mô tả">
          <textarea
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Mô tả ngắn về campaign..."
          />
        </FieldRow>

        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="Loại campaign" required>
            <select
              required
              disabled={isEdit}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
              value={form.campaign_type}
              onChange={(e) => setField('campaign_type', e.target.value)}
            >
              <option value="PERCENTAGE">Giảm % (PERCENTAGE)</option>
              <option value="FIXED_PRICE">Đồng giá (FIXED_PRICE)</option>
              <option value="TIER_DISCOUNT">Theo bậc (TIER_DISCOUNT)</option>
              <option value="FREESHIP">Freeship</option>
            </select>
          </FieldRow>

          <FieldRow label="Trạng thái">
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status}
              onChange={(e) => setField('status', Number(e.target.value))}
            >
              <option value={1}>Bật</option>
              <option value={0}>Tắt</option>
            </select>
          </FieldRow>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="Ngày bắt đầu" required>
            <input
              type="datetime-local"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.start_date}
              onChange={(e) => setField('start_date', e.target.value)}
            />
          </FieldRow>

          <FieldRow label="Ngày kết thúc" required>
            <input
              type="datetime-local"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.end_date}
              onChange={(e) => setField('end_date', e.target.value)}
            />
          </FieldRow>
        </div>
      </SectionCard>

      {/* Config — PERCENTAGE / FIXED_PRICE */}
      {needsConfig && (
        <SectionCard title="Cấu hình giảm giá">
          <FieldRow label={configLabel} hint={configHint}>
            <input
              type="number"
              required
              min={1}
              max={form.campaign_type === 'PERCENTAGE' ? 99 : undefined}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.discount_value}
              onChange={(e) => setField('discount_value', e.target.value)}
              placeholder={form.campaign_type === 'PERCENTAGE' ? '50' : '99000'}
            />
          </FieldRow>
        </SectionCard>
      )}

      {/* Tiers — TIER_DISCOUNT */}
      {needsTiers && (
        <SectionCard title="Bậc giảm giá (Tiers)">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>
              Hệ thống sẽ chọn bậc có ngưỡng cao nhất mà tổng đơn hàng đạt được. Mỗi bậc phải có ngưỡng và % giảm khác nhau.
            </span>
          </div>
          <TiersEditor tiers={form.tiers} onChange={(tiers) => setField('tiers', tiers)} />
        </SectionCard>
      )}

      {/* Product selection */}
      <SectionCard title={productPickerTitle}>
        {form.campaign_type === 'TIER_DISCOUNT' && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 mb-2">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>
              Nếu không chọn sản phẩm nào, campaign sẽ áp dụng cho toàn bộ sản phẩm trong đơn hàng.
            </span>
          </div>
        )}
        <ProductPicker
          selectedIds={form.product_ids}
          onChange={(ids) => setField('product_ids', ids)}
          allProducts={allProducts}
          loadingProducts={loadingProducts}
        />
      </SectionCard>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật Campaign' : 'Tạo Campaign'}
        </Button>
      </div>
    </form>
  );
}
