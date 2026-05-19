'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import adminProductService from '@/services/adminProductService';
import adminCategoryService from '@/services/adminCategoryService';
import adminBrandService from '@/services/adminBrandService';

/* ─── Multi-select dropdown component ─── */
function MultiSelect({ label, options, selected, onChange, valueKey, labelKey, required }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (val) => {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
    );
  };

  const selectedLabels = options
    .filter((o) => selected.includes(o[valueKey]))
    .map((o) => o[labelKey]);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between border rounded-lg px-4 py-2 text-sm bg-white text-left transition
          ${open ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <span className={selectedLabels.length === 0 ? 'text-gray-400' : 'text-gray-800'}>
          {selectedLabels.length === 0
            ? `Chọn ${label.toLowerCase()}...`
            : selectedLabels.join(', ')}
        </span>
        <ChevronDown size={16} className={`shrink-0 ml-2 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-52 overflow-y-auto">
          {options.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">Không có dữ liệu</p>
          )}
          {options.map((opt) => {
            const val = opt[valueKey];
            const isSelected = selected.includes(val);
            return (
              <button
                key={val}
                type="button"
                onClick={() => toggle(val)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition
                  ${isSelected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <span>{opt[labelKey]}</span>
                {isSelected && <Check size={14} className="text-indigo-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main Modal ─── */
export default function ProductFormModal({ isEdit = false, productId = null, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    material: '',
    gender: 'unisex',
    base_price: '',
    slug: '',
    category_ids: [],   // multi-select
    brand_ids: [],      // multi-select
  });

  /* Load categories & brands on mount */
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          adminCategoryService.getAllCategories({ limit: 100 }),
          adminBrandService.getAllBrands({ limit: 100 }),
        ]);
        setCategories(catRes.data?.items || catRes.data || []);
        setBrands(brandRes.data?.items || brandRes.data || []);
      } catch (err) {
        console.error('Failed to load options', err);
      }
    };
    loadOptions();
  }, []);

  /* Load product data when editing */
  useEffect(() => {
    if (!isEdit || !productId) return;
    setLoading(true);
    adminProductService.getProductById(productId)
      .then((res) => {
        const p = res.data;
        setFormData({
          product_name: p.product_name || '',
          product_description: p.product_description || '',
          material: p.material || '',
          gender: p.gender || 'unisex',
          base_price: p.base_price || '',
          slug: p.slug || '',
          // Support single or multi category/brand from response
          category_ids: p.categories
            ? p.categories.map((c) => c.category_id)
            : p.category?.category_id
            ? [p.category.category_id]
            : [],
          brand_ids: p.brands
            ? p.brands.map((b) => b.brand_id)
            : p.brand?.brand_id
            ? [p.brand.brand_id]
            : [],
        });
      })
      .catch((err) => {
        console.error(err);
        alert('Không thể tải thông tin sản phẩm');
      })
      .finally(() => setLoading(false));
  }, [isEdit, productId]);

  /* Handlers */
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setFormData((prev) => ({ ...prev, product_name: name, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        product_name: formData.product_name,
        product_description: formData.product_description || undefined,
        material: formData.material || undefined,
        gender: formData.gender,
        base_price: Number(formData.base_price),
        slug: formData.slug,
        // Send first selected value if backend accepts single; adapt if backend supports array
        category_id: formData.category_ids.length > 0 ? formData.category_ids[0] : undefined,
        brand_id: formData.brand_ids.length > 0 ? formData.brand_ids[0] : undefined,
        // Also send arrays for possible multi-support
        category_ids: formData.category_ids.length > 0 ? formData.category_ids : undefined,
        brand_ids: formData.brand_ids.length > 0 ? formData.brand_ids : undefined,
      };

      if (isEdit) {
        await adminProductService.updateProduct(productId, payload);
      } else {
        await adminProductService.createProduct(payload);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save product', error);
      alert(error.response?.data?.message || error.message || 'Lưu sản phẩm thất bại!');
    } finally {
      setSaving(false);
    }
  };

  /* Prevent background scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(2px)' }}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ animation: 'modalIn 0.18s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? `Sửa Sản phẩm #${productId}` : 'Thêm Sản phẩm Mới'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? 'Chỉnh sửa thông tin sản phẩm' : 'Điền thông tin để tạo sản phẩm mới'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : (
            <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                  value={formData.product_name}
                  onChange={handleNameChange}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  title="Slug chỉ chứa chữ thường, số và dấu gạch nối"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                  value={formData.slug}
                  onChange={handleInput}
                />
                <p className="text-xs text-gray-400 mt-1">Tự động tạo từ tên. Chỉ chữ thường, số và dấu -</p>
              </div>

              {/* Giá & Giới tính */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá cơ bản (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="base_price"
                    required
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    value={formData.base_price}
                    onChange={handleInput}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    value={formData.gender}
                    onChange={handleInput}
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Nam</option>
                    <option value="women">Nữ</option>
                    <option value="kids">Trẻ em</option>
                  </select>
                </div>
              </div>

              {/* Category & Brand multi-select */}
              <div className="grid grid-cols-2 gap-4">
                <MultiSelect
                  label="Danh mục"
                  options={categories}
                  selected={formData.category_ids}
                  onChange={(vals) => setFormData((prev) => ({ ...prev, category_ids: vals }))}
                  valueKey="category_id"
                  labelKey="category_name"
                />
                <MultiSelect
                  label="Thương hiệu"
                  options={brands}
                  selected={formData.brand_ids}
                  onChange={(vals) => setFormData((prev) => ({ ...prev, brand_ids: vals }))}
                  valueKey="brand_id"
                  labelKey="brand_name"
                />
              </div>

              {/* Chất liệu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chất liệu</label>
                <input
                  type="text"
                  name="material"
                  maxLength={100}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                  value={formData.material}
                  onChange={handleInput}
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="product_description"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none"
                  value={formData.product_description}
                  onChange={handleInput}
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-gray-50 rounded-b-2xl">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" form="product-form" disabled={saving || loading}>
            {saving
              ? 'Đang lưu...'
              : isEdit
              ? 'Lưu thay đổi'
              : 'Thêm Sản phẩm'}
          </Button>
        </div>
      </div>

      {/* Modal animation */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
