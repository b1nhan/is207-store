'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Info } from 'lucide-react';
import adminCampaignService from '@/services/adminCampaignService';
import adminProductService from '@/services/adminProductService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toDatetimeLocal, toISOString } from '@/utils/date';

// ── sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function FieldRow({ label, required, hint, action, children }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {action}
      </div>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// Product picker — table style with checkbox & search
function ProductPicker({ selectedIds, onChange, allProducts, loadingProducts }) {
  const [search, setSearch] = useState('');

  const filtered = allProducts.filter((p) =>
    (p.product_name || p.name || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((p) => selectedIds.includes(p.product_id));

  const toggleAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filtered.map((p) => p.product_id));
      onChange(selectedIds.filter((id) => !filteredIds.has(id)));
    } else {
      const next = new Set(selectedIds);
      filtered.forEach((p) => next.add(p.product_id));
      onChange([...next]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Count badge */}
      {selectedIds.length > 0 && (
        <p className="text-xs text-blue-600 font-medium">
          ✓ Đã chọn <span className="font-bold">{selectedIds.length}</span> sản phẩm
        </p>
      )}

      {/* Table */}
      {loadingProducts ? (
        <div className="flex items-center justify-center py-8 gap-2 text-sm text-gray-400">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Đang tải danh sách sản phẩm...
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2.5 text-left w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      title={allFilteredSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    />
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium text-gray-600 text-xs uppercase tracking-wide">#ID</th>
                  <th className="px-3 py-2.5 text-left font-medium text-gray-600 text-xs uppercase tracking-wide">Tên sản phẩm</th>
                  <th className="px-3 py-2.5 text-right font-medium text-gray-600 text-xs uppercase tracking-wide">Giá gốc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-sm text-gray-400">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const checked = selectedIds.includes(p.product_id);
                    const name = p.product_name || p.name || '—';
                    return (
                      <tr
                        key={p.product_id}
                        onClick={() => toggle(p.product_id)}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${checked ? 'bg-blue-50' : ''
                          }`}
                      >
                        <td className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(p.product_id)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-2.5 text-gray-400 font-mono text-xs">{p.product_id}</td>
                        <td className="px-3 py-2.5">
                          <span className={`font-medium ${checked ? 'text-blue-700' : 'text-gray-800'
                            }`}>
                            {name}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-600 tabular-nums">
                          {p.base_price != null
                            ? Number(p.base_price).toLocaleString('vi-VN') + '₫'
                            : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400">
            {filtered.length} sản phẩm active
            {search && ` · kết quả cho "${search}"`}
          </div>
        </div>
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
  const [errors, setErrors] = useState({});
  const [generatingAiDesc, setGeneratingAiDesc] = useState(false);

  const handleGenerateAiDescription = async () => {
    if (!form.name) return;
    setGeneratingAiDesc(true);
    try {
      const response = await adminCampaignService.generateDescription({
        name: form.name,
        campaign_type: form.campaign_type,
        discount_value: form.discount_value,
      });
      const aiDescription = response.data?.description;
      if (aiDescription) {
        setField('description', aiDescription);
        toast.success('Tạo mô tả chiến dịch bằng AI thành công!');
      } else {
        toast.error('Không nhận được mô tả từ AI.');
      }
    } catch (error) {
      console.error('Failed to generate campaign description', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tạo mô tả bằng AI. Vui lòng kiểm tra lại cấu hình.');
    } finally {
      setGeneratingAiDesc(false);
    }
  };

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

  // Load active products only
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await adminProductService.getAllProducts({ limit: 500, page: 1, status: 1 });
        console.log(res)
        const items = res.data?.items || [];
        setAllProducts(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const needsConfig = ['PERCENTAGE', 'FIXED_PRICE'].includes(form.campaign_type);
  const needsTiers = form.campaign_type === 'TIER_DISCOUNT';
  const needsProducts = ['PERCENTAGE', 'FIXED_PRICE', 'FREESHIP'].includes(form.campaign_type);

  const validate = () => {
    const newErrors = {};
    if (!form.name || !form.name.trim()) {
      newErrors.name = 'Tên campaign không được để trống.';
    } else if (form.name.length > 255) {
      newErrors.name = 'Tên campaign tối đa 255 ký tự.';
    }
    if (!form.campaign_type) {
      newErrors.campaign_type = 'Vui lòng chọn loại campaign.';
    }
    if (!form.start_date) {
      newErrors.start_date = 'Vui lòng chọn ngày bắt đầu.';
    }
    if (!form.end_date) {
      newErrors.end_date = 'Vui lòng chọn ngày kết thúc.';
    } else if (form.start_date && new Date(form.end_date) <= new Date(form.start_date)) {
      newErrors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu.';
    }
    if (needsConfig) {
      const discountVal = Number(form.discount_value);
      if (form.discount_value === '' || form.discount_value === null || form.discount_value === undefined) {
        newErrors.discount_value = 'Giá trị giảm giá không được để trống.';
      } else if (isNaN(discountVal) || discountVal <= 0) {
        newErrors.discount_value = 'Giá trị giảm giá phải lớn hơn 0.';
      } else if (form.campaign_type === 'PERCENTAGE' && discountVal >= 100) {
        newErrors.discount_value = 'Phần trăm giảm giá phải nhỏ hơn 100%.';
      }
    }
    if (needsTiers) {
      const invalidTiers = form.tiers.some(t => {
        const minVal = Number(t.min_order_value);
        const discVal = Number(t.discount_value);
        return (
          t.min_order_value === '' || isNaN(minVal) || minVal <= 0 ||
          t.discount_value === '' || isNaN(discVal) || discVal <= 0 || discVal >= 100
        );
      });
      if (invalidTiers) {
        newErrors.tiers = 'Vui lòng nhập ngưỡng > 0 và phần trăm giảm từ 1 đến 99 cho tất cả các bậc.';
      }
    }
    if (needsProducts && form.campaign_type !== 'TIER_DISCOUNT') {
      if (!form.product_ids || form.product_ids.length === 0) {
        newErrors.product_ids = 'Vui lòng chọn ít nhất một sản phẩm cho chiến dịch.';
      }
    }
    return newErrors;
  };

  const buildPayload = () => {
    const payload = {
      name: form.name,
      description: form.description || undefined,
      campaign_type: form.campaign_type,
      start_date: toISOString(form.start_date),
      end_date: toISOString(form.end_date),
      status: Number(form.status),
    };
    console.log(payload);

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
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await adminCampaignService.updateCampaign(initialData.campaign_id, payload);
        toast.success('Cập nhật Campaign thành công');
      } else {
        await adminCampaignService.createCampaign(payload);
        toast.success('Tạo Campaign thành công');
      }
      router.push('/admin/campaigns');
    } catch (err) {
      const msg = err.response?.data?.message || (isEdit ? 'Cập nhật thất bại' : 'Tạo thất bại');
      toast.error(msg);
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Basic info */}
      <SectionCard title="Thông tin cơ bản">
        <FieldRow label="Tên campaign" required>
          <input
            type="text"
            maxLength={255}
            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-200'
            }`}
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="VD: Flash Sale 5.5"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </FieldRow>

        <FieldRow
          label="Mô tả"
          action={
            <button
              type="button"
              onClick={handleGenerateAiDescription}
              disabled={generatingAiDesc || !form.name}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              {generatingAiDesc ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo bằng AI...
                </>
              ) : (
                <>✨ Viết mô tả bằng AI</>
              )}
            </button>
          }
        >
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
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.start_date ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.start_date}
              onChange={(e) => setField('start_date', e.target.value)}
            />
            {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
          </FieldRow>

          <FieldRow label="Ngày kết thúc" required>
            <input
              type="datetime-local"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.end_date ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.end_date}
              onChange={(e) => setField('end_date', e.target.value)}
            />
            {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
          </FieldRow>
        </div>
      </SectionCard>

      {/* Config — PERCENTAGE / FIXED_PRICE */}
      {needsConfig && (
        <SectionCard title="Cấu hình giảm giá">
          <FieldRow label={configLabel} hint={configHint}>
            <input
              type="number"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.discount_value ? 'border-red-500' : 'border-gray-200'
              }`}
              value={form.discount_value}
              onChange={(e) => setField('discount_value', e.target.value)}
              placeholder={form.campaign_type === 'PERCENTAGE' ? '50' : '99000'}
            />
            {errors.discount_value && <p className="text-red-500 text-xs mt-1">{errors.discount_value}</p>}
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
          {errors.tiers && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.tiers}</p>}
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
          onChange={(ids) => {
            setField('product_ids', ids);
            if (errors.product_ids) setErrors((prev) => ({ ...prev, product_ids: '' }));
          }}
          allProducts={allProducts}
          loadingProducts={loadingProducts}
        />
        {errors.product_ids && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.product_ids}</p>}
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
