'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, X, Check, AlertCircle } from 'lucide-react';
import adminBrandService from '@/services/adminBrandService';
import { Button } from '@/components/ui/button';

export default function BrandModal({ open, onClose, onSaved, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({ brand_name: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initial ? { brand_name: initial.brand_name } : { brand_name: '' });
      setError('');
    }
  }, [open, initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand_name.trim()) {
      setError('Tên thương hiệu không được để trống');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await adminBrandService.updateBrand(initial.brand_id, form);
      } else {
        await adminBrandService.createBrand(form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <ShoppingBag size={18} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEdit ? 'Chỉnh sửa thương hiệu' : 'Tạo thương hiệu mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Tên thương hiệu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Ví dụ: Nike, Adidas..."
              value={form.brand_name}
              onChange={(e) => setForm({ brand_name: e.target.value })}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={saving} className="min-w-[100px]">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check size={15} />
                  {isEdit ? 'Cập nhật' : 'Tạo mới'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
