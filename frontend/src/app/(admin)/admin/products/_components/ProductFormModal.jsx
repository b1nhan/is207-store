'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check, Upload, Trash2, ImagePlus, Star, Plus, Pencil, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import adminProductService from '@/services/adminProductService';
import adminCategoryService from '@/services/adminCategoryService';
import adminBrandService from '@/services/adminBrandService';

/* ─── Multi-select dropdown ─── */
function MultiSelect({ label, options, selected, onChange, valueKey, labelKey, required }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
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

/* ─── Image Upload Panel ─── */
function ImageUploadPanel({ productId, existingImages, onImagesChange, isEdit }) {
  const [pendingFiles, setPendingFiles] = useState([]); // { file, preview }[]
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPending = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const removePending = (id) => {
    setPendingFiles((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  // Upload all pending files (called before form submit if in edit mode)
  // In create mode, we return the files list to be uploaded after product is created
  const uploadPending = async (pid) => {
    if (pendingFiles.length === 0) return [];
    setUploading(true);
    const uploaded = [];
    try {
      for (const pending of pendingFiles) {
        const result = await adminProductService.addImage(pid, pending.file);
        uploaded.push(result.data || result);
      }
      setPendingFiles([]);
      return uploaded;
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteExisting = async (imageId) => {
    if (!productId) return;
    setDeletingId(imageId);
    try {
      await adminProductService.deleteImage(productId, imageId);
      onImagesChange(existingImages.filter((img) => img.image_id !== imageId));
    } catch (err) {
      alert(err.message || 'Không thể xóa ảnh');
    } finally {
      setDeletingId(null);
    }
  };

  // Expose uploadPending to parent via ref-like approach
  // We do this by calling it from the parent's submit handler
  useEffect(() => {
    if (onImagesChange.__setPendingUploader) {
      onImagesChange.__setPendingUploader(uploadPending);
    }
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>

      {/* Existing images (edit mode) */}
      {isEdit && existingImages.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Ảnh hiện tại:</p>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img) => (
              <div key={img.image_id} className="relative group">
                <img
                  src={img.image_url}
                  alt="product"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                {img.is_primary === 1 && (
                  <div className="absolute top-1 left-1 bg-yellow-400 rounded-full p-0.5">
                    <Star size={10} className="text-white fill-white" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(img.image_id)}
                  disabled={deletingId === img.image_id}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {deletingId === img.image_id ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <X size={12} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending (new) image previews */}
      {pendingFiles.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Ảnh sẽ được tải lên:</p>
          <div className="flex flex-wrap gap-2">
            {pendingFiles.map((p) => (
              <div key={p.id} className="relative group">
                <img
                  src={p.preview}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-dashed border-indigo-300"
                />
                <button
                  type="button"
                  onClick={() => removePending(p.id)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors w-full justify-center"
      >
        <ImagePlus size={16} />
        {uploading ? 'Đang tải ảnh...' : 'Chọn ảnh (có thể chọn nhiều)'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
      <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG, WEBP. Ảnh đầu tiên sẽ là ảnh đại diện.</p>

      {/* Return pending files count info */}
      {pendingFiles.length > 0 && !isEdit && (
        <p className="text-xs text-indigo-600 mt-1">
          {pendingFiles.length} ảnh sẽ được tải lên sau khi tạo sản phẩm.
        </p>
      )}
    </div>
  );
}

/* ─── Empty variant form state ─── */
const EMPTY_VARIANT = { color: '', size: '', stock_quantity: '', variant_price: '', sku: '' };

/* ─── Variant Section ─── */
function VariantSection({ productId, variants, setVariants }) {
  // editingId: variant_id being edited, or 'new' for a new row
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_VARIANT);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const startAdd = () => {
    setEditingId('new');
    setEditForm(EMPTY_VARIANT);
  };

  const startEdit = (v) => {
    setEditingId(v.variant_id);
    setEditForm({
      color: v.color || '',
      size: v.size || '',
      stock_quantity: v.stock_quantity ?? '',
      variant_price: v.variant_price ?? '',
      sku: v.sku || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(EMPTY_VARIANT);
  };

  const handleSave = async () => {
    if (!editForm.size && !editForm.color) {
      alert('Vui lòng nhập ít nhất Size hoặc Màu sắc');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        color: editForm.color || undefined,
        size: editForm.size || undefined,
        stock_quantity: editForm.stock_quantity !== '' ? Number(editForm.stock_quantity) : 0,
        variant_price: editForm.variant_price !== '' ? Number(editForm.variant_price) : undefined,
        sku: editForm.sku || undefined,
      };

      if (editingId === 'new') {
        const res = await adminProductService.addVariant(productId, payload);
        setVariants((prev) => [...prev, res.data]);
      } else {
        const res = await adminProductService.updateVariant(editingId, payload);
        setVariants((prev) =>
          prev.map((v) => (v.variant_id === editingId ? res.data : v))
        );
      }
      cancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Lưu variant thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (variantId) => {
    if (!confirm('Xác nhận xóa variant này?')) return;
    setDeletingId(variantId);
    try {
      await adminProductService.deleteVariant(variantId);
      setVariants((prev) => prev.filter((v) => v.variant_id !== variantId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Xóa variant thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls =
    'w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition';

  return (
    <div className="mt-1">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Biến thể sản phẩm</h3>
        {!editingId && productId && (
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={13} />
            Thêm variant
          </button>
        )}
        {!productId && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1">
            Lưu sản phẩm trước để thêm variant
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide">
              <th className="px-3 py-2 text-left font-medium">Màu</th>
              <th className="px-3 py-2 text-left font-medium">Size</th>
              <th className="px-3 py-2 text-right font-medium">Tồn kho</th>
              <th className="px-3 py-2 text-right font-medium">Giá riêng</th>
              <th className="px-3 py-2 text-left font-medium">SKU</th>
              <th className="px-3 py-2 text-center font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {variants.length === 0 && editingId !== 'new' && (
              <tr>
                <td colSpan={6} className="px-3 py-5 text-center text-gray-400 italic">
                  Chưa có variant nào
                </td>
              </tr>
            )}

            {variants.map((v) =>
              editingId === v.variant_id ? (
                /* ── Inline edit row ── */
                <tr key={v.variant_id} className="bg-indigo-50">
                  <td className="px-2 py-2"><input className={inputCls} value={editForm.color} onChange={(e) => setEditForm(p => ({ ...p, color: e.target.value }))} placeholder="Màu sắc" /></td>
                  <td className="px-2 py-2"><input className={inputCls} value={editForm.size} onChange={(e) => setEditForm(p => ({ ...p, size: e.target.value }))} placeholder="Size" /></td>
                  <td className="px-2 py-2"><input className={inputCls} type="number" min="0" value={editForm.stock_quantity} onChange={(e) => setEditForm(p => ({ ...p, stock_quantity: e.target.value }))} placeholder="0" /></td>
                  <td className="px-2 py-2"><input className={inputCls} type="number" min="0" value={editForm.variant_price} onChange={(e) => setEditForm(p => ({ ...p, variant_price: e.target.value }))} placeholder="(theo SP)" /></td>
                  <td className="px-2 py-2"><input className={inputCls} value={editForm.sku} onChange={(e) => setEditForm(p => ({ ...p, sku: e.target.value }))} placeholder="SKU" /></td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <button type="button" onClick={handleSave} disabled={saving} className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition" title="Lưu">
                        {saving ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
                      </button>
                      <button type="button" onClick={cancelEdit} disabled={saving} className="p-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition" title="Hủy">
                        <XCircle size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ── Normal display row ── */
                <tr key={v.variant_id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2.5 text-gray-700">{v.color || <span className="text-gray-300">—</span>}</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-block bg-gray-100 text-gray-700 rounded px-2 py-0.5 font-medium">{v.size || '—'}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium text-gray-800">{v.stock_quantity ?? 0}</td>
                  <td className="px-3 py-2.5 text-right text-gray-600">
                    {v.variant_price ? v.variant_price.toLocaleString('vi-VN') + ' ₫' : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-500">{v.sku || <span className="text-gray-300">—</span>}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(v)}
                        disabled={!!editingId}
                        className="p-1 rounded text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 transition"
                        title="Sửa"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.variant_id)}
                        disabled={!!editingId || deletingId === v.variant_id}
                        className="p-1 rounded text-red-500 hover:bg-red-50 disabled:opacity-40 transition"
                        title="Xóa"
                      >
                        {deletingId === v.variant_id
                          ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}

            {/* New variant row */}
            {editingId === 'new' && (
              <tr className="bg-indigo-50">
                <td className="px-2 py-2"><input className={inputCls} value={editForm.color} onChange={(e) => setEditForm(p => ({ ...p, color: e.target.value }))} placeholder="Màu sắc" /></td>
                <td className="px-2 py-2"><input className={inputCls} value={editForm.size} onChange={(e) => setEditForm(p => ({ ...p, size: e.target.value }))} placeholder="Size" /></td>
                <td className="px-2 py-2"><input className={inputCls} type="number" min="0" value={editForm.stock_quantity} onChange={(e) => setEditForm(p => ({ ...p, stock_quantity: e.target.value }))} placeholder="0" /></td>
                <td className="px-2 py-2"><input className={inputCls} type="number" min="0" value={editForm.variant_price} onChange={(e) => setEditForm(p => ({ ...p, variant_price: e.target.value }))} placeholder="(theo SP)" /></td>
                <td className="px-2 py-2"><input className={inputCls} value={editForm.sku} onChange={(e) => setEditForm(p => ({ ...p, sku: e.target.value }))} placeholder="SKU" /></td>
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <button type="button" onClick={handleSave} disabled={saving} className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition" title="Lưu">
                      {saving ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
                    </button>
                    <button type="button" onClick={cancelEdit} disabled={saving} className="p-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition" title="Hủy">
                      <XCircle size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main Modal ─── */
export default function ProductFormModal({ isEdit = false, productId = null, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [variants, setVariants] = useState([]);

  // Ref to call image upload from child
  const pendingUploaderRef = useRef(null);

  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    material: '',
    gender: 'unisex',
    base_price: '',
    slug: '',
    category_ids: [],
    brand_ids: [],
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
        setExistingImages(p.images || []);
        setVariants(p.variants || []);
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
        category_id: formData.category_ids.length > 0 ? formData.category_ids[0] : undefined,
        brand_id: formData.brand_ids.length > 0 ? formData.brand_ids[0] : undefined,
        category_ids: formData.category_ids.length > 0 ? formData.category_ids : undefined,
        brand_ids: formData.brand_ids.length > 0 ? formData.brand_ids : undefined,
      };

      let targetProductId = productId;

      if (isEdit) {
        await adminProductService.updateProduct(productId, payload);
        // Upload any pending new images for the existing product
        if (pendingUploaderRef.current) {
          await pendingUploaderRef.current(productId);
        }
      } else {
        const createRes = await adminProductService.createProduct(payload);
        targetProductId = createRes.data?.product_id;
        // Upload pending images for the newly created product
        if (targetProductId && pendingUploaderRef.current) {
          await pendingUploaderRef.current(targetProductId);
        }
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

  // Create a stable callback ref for ImageUploadPanel to register its uploader
  const imagesChangeHandler = (imgs) => setExistingImages(imgs);
  imagesChangeHandler.__setPendingUploader = (fn) => {
    pendingUploaderRef.current = fn;
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(2px)' }}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col"
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

              {/* Image Upload */}
              <ImageUploadPanel
                productId={productId}
                existingImages={existingImages}
                onImagesChange={imagesChangeHandler}
                isEdit={isEdit}
              />

              {/* Variants */}
              <div className="border-t border-gray-100 pt-5">
                <VariantSection
                  productId={productId}
                  variants={variants}
                  setVariants={setVariants}
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
