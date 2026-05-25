'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Layers } from 'lucide-react';
import adminCategoryService from '@/services/adminCategoryService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CategoryModal from './CategoryModal';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

// ─── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirmModal({ open, onClose, onConfirm, category, deleting }) {
  if (!open || !category) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-50 rounded-xl">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Xóa danh mục</h2>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Bạn có chắc muốn xóa danh mục{' '}
          <span className="font-semibold text-gray-900">&ldquo;{category.category_name}&rdquo;</span>?
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminCategoryService.getAllCategories();
      // API returns { success, data: { items } }
      setCategories(res.data?.items || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditTarget(cat);
    setModalOpen(true);
  };

  const handleOpenDelete = (cat) => {
    setDeleteModal({ open: true, category: cat });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminCategoryService.deleteCategory(deleteModal.category.category_id);
      setDeleteModal({ open: false, category: null });
      toast.info('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa danh mục thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.category_name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchCategories}
        initial={editTarget}
      />
      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, category: null })}
        onConfirm={handleDelete}
        category={deleteModal.category}
        deleting={deleting}
      />

      <div className="space-y-6">
        <Breadcrumbs
          root={{ label: 'Admin', href: '/admin' }}
          items={[{ label: 'Danh mục' }]}
        />
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Danh mục</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Quản lý tất cả danh mục sản phẩm · <span className="font-medium">{categories.length}</span> danh mục
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2 self-start sm:self-auto">
            <Plus size={16} />
            Tạo danh mục
          </Button>
        </div>

        {/* Stats cards */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Tổng danh mục</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Danh mục có SP</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categories.filter((c) => Number(c.product_count) > 0).length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Danh mục trống</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categories.filter((c) => Number(c.product_count) === 0).length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categories.reduce((sum, c) => sum + Number(c.product_count || 0), 0)}
              </p>
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc slug..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
                  <th className="p-4 font-semibold text-gray-600 text-sm w-12">#</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Tên danh mục</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Slug</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-center">Sản phẩm</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      <Layers size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">
                        {search ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục nào'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat, idx) => (
                    <tr
                      key={cat.category_id}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="p-4 text-sm text-gray-400">{idx + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Layers size={15} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{cat.category_name}</p>
                            <p className="text-xs text-gray-400">ID #{cat.category_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {cat.slug}
                        </code>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {cat.product_count ?? 0}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenEdit(cat)}
                            title="Chỉnh sửa"
                          >
                            <Pencil size={15} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDelete(cat)}
                            title="Xóa"
                            disabled={Number(cat.product_count) > 0}
                          >
                            <Trash2
                              size={15}
                              className={Number(cat.product_count) > 0 ? 'text-gray-300' : 'text-red-500'}
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
            * Danh mục đang chứa sản phẩm không thể xóa trực tiếp
          </p>
        )}
      </div>
    </>
  );
}
