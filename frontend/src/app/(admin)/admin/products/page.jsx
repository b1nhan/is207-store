'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import adminProductService from '@/services/adminProductService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProductFormModal from './_components/ProductFormModal';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminProductService.getAllProducts({ page: currentPage, limit: pageSize });
      console.log(response);
      const { items = [], pagination } = response.data;
      setProducts(items);
      setTotalItems(pagination?.totalItems ?? items.length);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── Modal helpers ── */
  const openCreateModal = () => {
    setIsEdit(false);
    setEditProductId(null);
    setModalOpen(true);
  };

  const openEditModal = (productId) => {
    setIsEdit(true);
    setEditProductId(productId);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditProductId(null);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setEditProductId(null);
    fetchProducts();
  };

  /* ── Hide / Show toggle ── */
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setTogglingId(id);
    try {
      await adminProductService.updateStatus(id, newStatus);
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.product_id === id ? { ...p, status: newStatus } : p))
      );
      toast.success('Product status updated');
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error(error.response?.data?.message || error.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setTogglingId(null);
    }
  };

  /* ── Pagination ── */
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Generate page numbers to display (window of 5 around current)
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push('...');
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <div className="space-y-6">
        <Breadcrumbs
          root={{ label: 'Admin', href: '/admin' }}
          items={[{ label: 'Sản phẩm' }]}
        />
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
          <Button className="flex items-center gap-2" onClick={openCreateModal}>
            <Plus size={16} />
            <span>Thêm Sản phẩm</span>
          </Button>
        </div>

        {/* Stats cards */}
        {!loading && totalItems > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Tổng Sản Phẩm</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalItems}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Đang Hiển Thị (Trang hiện tại - {currentPage}/{totalPages})</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {products.filter((p) => p.status === 1).length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium">Đã Ẩn (Trang hiện tại - {currentPage}/{totalPages})</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {products.filter((p) => p.status === 0).length}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Ảnh</th>
                <th className="p-4 font-semibold text-gray-600">Tên sản phẩm</th>
                <th className="p-4 font-semibold text-gray-600">Giá</th>
                <th className="p-4 font-semibold text-gray-600">Danh mục</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Tồn kho</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Đã bán</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Ẩn/Hiện</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.product_id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${product.status === 0 ? 'opacity-50' : ''
                      }`}
                  >
                    {/* Thumbnail */}
                    <td className="p-4">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.product_name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
                          No img
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{product.product_name}</p>
                      <p className="text-xs text-gray-400 font-mono">{product.slug}</p>
                    </td>

                    {/* Price */}
                    <td className="p-4 text-gray-700">
                      {Number(product.base_price).toLocaleString('vi-VN')}₫
                    </td>

                    {/* Category */}
                    <td className="p-4 text-gray-600">
                      {product.category?.category_name || (
                        <span className="text-gray-300 italic">N/A</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="p-4 text-center text-gray-700 font-medium">
                      {product.total_stock ?? 0}
                    </td>

                    {/* Sold */}
                    <td className="p-4 text-center text-gray-700 font-medium">
                      {product.total_sold ?? 0}
                    </td>

                    {/* Status badge */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.status === 1
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                          }`}
                      >
                        {product.status === 1 ? 'Hiển thị' : 'Đã ẩn'}
                      </span>
                    </td>

                    {/* Hide/Show toggle button */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(product.product_id, product.status)}
                        disabled={togglingId === product.product_id}
                        title={product.status === 1 ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${product.status === 1
                          ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                      >
                        {togglingId === product.product_id ? (
                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        ) : product.status === 1 ? (
                          <>
                            <EyeOff size={13} />
                            Ẩn
                          </>
                        ) : (
                          <>
                            <Eye size={13} />
                            Hiện
                          </>
                        )}
                      </button>
                    </td>

                    {/* Edit action */}
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        title="Chỉnh sửa"
                        onClick={() => openEditModal(product.product_id)}
                      >
                        <Edit size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && totalItems > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Page size selector */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Hiển thị</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span>/ {totalItems} sản phẩm</span>
            </div>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${page === currentPage
                      ? 'bg-indigo-600 text-white shadow-sm cursor-default'
                      : 'border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {modalOpen && (
        <ProductFormModal
          isEdit={isEdit}
          productId={editProductId}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
}
