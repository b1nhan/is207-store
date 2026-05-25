'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ShoppingBag } from 'lucide-react';
import adminBrandService from '@/services/adminBrandService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BrandModal from './BrandModal';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

// ─── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirmModal({ open, onClose, onConfirm, brand, deleting }) {
  if (!open || !brand) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-50 rounded-xl">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Xóa thương hiệu</h2>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Bạn có chắc muốn xóa thương hiệu{' '}
          <span className="font-semibold text-gray-900">&ldquo;{brand.brand_name}&rdquo;</span>?
        </p>
        <p className="text-xs text-gray-400 mb-5">Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={deleting}>
            Hủy
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xóa...
              </span>
            ) : (
              'Xóa'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ open: false, brand: null });
  const [deleting, setDeleting] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminBrandService.getAllBrands();
      // Public API returns { success, data: { items } }
      setBrands(res.data?.items || []);
    } catch (err) {
      console.error('Failed to fetch brands', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditTarget(brand);
    setModalOpen(true);
  };

  const handleOpenDelete = (brand) => {
    setDeleteModal({ open: true, brand });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminBrandService.deleteBrand(deleteModal.brand.brand_id);
      setDeleteModal({ open: false, brand: null });
      toast.info('Brand deleted');
      fetchBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa thương hiệu thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = brands.filter((b) =>
    b.brand_name.toLowerCase().includes(search.toLowerCase()),
  );

  // Generate initials / color for avatar
  const getBrandColor = (name) => {
    const colors = [
      'bg-purple-100 text-purple-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600',
      'bg-teal-100 text-teal-600',
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <>
      <BrandModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchBrands}
        initial={editTarget}
      />
      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, brand: null })}
        onConfirm={handleDelete}
        brand={deleteModal.brand}
        deleting={deleting}
      />

      <div className="space-y-6">
        <Breadcrumbs
          root={{ label: 'Admin', href: '/admin' }}
          items={[{ label: 'Thương hiệu' }]}
        />
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thương hiệu</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Quản lý tất cả thương hiệu · <span className="font-medium">{brands.length}</span> thương hiệu
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2 self-start sm:self-auto">
            <Plus size={16} />
            Tạo thương hiệu
          </Button>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên thương hiệu..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats cards */}
        {!loading && brands.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Tổng Brand</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{brands.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Brand có sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {brands.filter((b) => Number(b.product_count) > 0).length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Brand không có sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {brands.filter((b) => Number(b.product_count) === 0).length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {brands.reduce((sum, b) => sum + Number(b.product_count || 0), 0)}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600 text-sm w-12">#</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Thương hiệu</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-center">Số sản phẩm</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-400">
                      <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">
                        {search ? 'Không tìm thấy thương hiệu phù hợp' : 'Chưa có thương hiệu nào'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((brand, idx) => (
                    <tr
                      key={brand.brand_id}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="p-4 text-sm text-gray-400">{idx + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${getBrandColor(brand.brand_name)}`}
                          >
                            {brand.brand_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{brand.brand_name}</p>
                            <p className="text-xs text-gray-400">ID #{brand.brand_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[2rem] px-2.5 py-0.5 rounded-full text-xs font-medium ${Number(brand.product_count) > 0
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                          {brand.product_count ?? 0}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenEdit(brand)}
                            title="Chỉnh sửa"
                          >
                            <Pencil size={15} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDelete(brand)}
                            title="Xóa"
                            disabled={Number(brand.product_count) > 0}
                          >
                            <Trash2
                              size={15}
                              className={
                                Number(brand.product_count) > 0 ? 'text-gray-300' : 'text-red-500'
                              }
                            />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Info note */}
        {!loading && (
          <p className="text-xs text-gray-400 text-center">
            * Thương hiệu đang chứa sản phẩm không thể xóa trực tiếp
          </p>
        )}
      </div>
    </>
  );
}
