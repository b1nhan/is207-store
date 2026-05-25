'use client';

import { useEffect, useState } from 'react';
import { Layers, X, Check, AlertCircle } from 'lucide-react';
import adminCategoryService from '@/services/adminCategoryService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CategoryModal({ open, onClose, onSaved, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({ category_name: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? { category_name: initial.category_name, slug: initial.slug }
          : { category_name: '', slug: '' },
      );
      setError('');
    }
  }, [open, initial]);

  // Auto-generate slug from name when creating
  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      category_name: value,
      slug: isEdit
        ? prev.slug
        : value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-'),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_name.trim() || !form.slug.trim()) {
      setError('Tên và slug không được để trống');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await adminCategoryService.updateCategory(initial.category_id, form);
        toast.success('Category updated');
      } else {
        await adminCategoryService.createCategory(form);
        toast.success('Category created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
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
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Layers size={18} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEdit ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
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
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ví dụ: Áo thun"
              value={form.category_name}
              onChange={(e) => handleNameChange(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ví dụ: ao-thun"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            />
            <p className="text-xs text-gray-400">Slug dùng trong URL, chỉ chứa chữ thường, số, dấu gạch ngang</p>
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
