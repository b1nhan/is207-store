'use client';

import { useEffect, useState, useCallback } from 'react';
import adminOrderService from '@/services/adminOrderService';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'shipping': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'returned': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'failed': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatCurrency = (value) =>
  `${Number(value).toLocaleString('vi-VN')}₫`;

const TERMINAL_STATUSES = ['delivered', 'cancelled', 'returned'];

/* ─────────────────────────── Order Detail Modal ─────────────────────────── */
function OrderDetailModal({ orderId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await adminOrderService.getOrderById(orderId);
        console.log(res.data);
        setDetail(res.data);
      } catch (err) {
        console.error('Failed to fetch order detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [orderId]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Chi tiết đơn hàng #{orderId}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : !detail ? (
          <p className="p-6 text-center text-gray-500">Không tìm thấy đơn hàng.</p>
        ) : (
          <div className="p-6 space-y-6">
            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(detail.status)}`}>
                {detail.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(detail.payment_status)}`}>
                Thanh toán: {detail.payment_status}
              </span>
              {detail.cancelled_by && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                  Huỷ bởi: {detail.cancelled_by}
                </span>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoRow label="Khách hàng" value={detail.user_full_name || detail.user_email} />
              <InfoRow label="Email" value={detail.user_email} />
              <InfoRow label="Người nhận" value={detail.receiver_name} />
              <InfoRow label="SĐT người nhận" value={detail.receiver_phone} />
              <InfoRow label="Địa chỉ giao" value={detail.shipping_address} />
              {detail.voucher_code_snapshot && (
                <InfoRow label="Voucher" value={detail.voucher_code_snapshot} />
              )}
              <InfoRow
                label="Ngày đặt"
                value={new Date(detail.order_date).toLocaleString('vi-VN')}
              />
            </div>

            {/* Price summary */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <PriceRow label="Tạm tính" value={formatCurrency(detail.subtotal)} />
              {Number(detail.discount_total) > 0 && (
                <PriceRow label="Giảm giá voucher" value={`-${formatCurrency(detail.discount_total)}`} color="text-red-500" />
              )}
              {Number(detail.campaign_discount_total) > 0 && (
                <PriceRow label="Giảm giá campaign" value={`-${formatCurrency(detail.campaign_discount_total)}`} color="text-red-500" />
              )}
              <PriceRow label="Phí vận chuyển" value={formatCurrency(detail.shipping_fee)} />
              <div className="border-t border-gray-200 pt-2 mt-1">
                <PriceRow label="Tổng cộng" value={formatCurrency(detail.total_amount)} bold />
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Sản phẩm</h3>
              <div className="space-y-2">
                {detail.items?.map((item) => (
                  <div
                    key={item.order_item_id}
                    className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.product_name_snapshot}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {item.color_snapshot} / {item.size_snapshot} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800 shrink-0 ml-4">
                      {formatCurrency(item.line_total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-gray-700 font-medium">{value || '—'}</p>
    </div>
  );
}

function PriceRow({ label, value, color = 'text-gray-700', bold = false }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`${color} ${bold ? 'font-bold text-base' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

/* ──────────────────────────── Main Page ──────────────────────────── */
const STATUS_WEIGHT = {
  pending: 1,
  confirmed: 2,
  shipping: 3,
  delivered: 4,
  cancelled: 5,
  returned: 6,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrderId, setViewingOrderId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Multi-select state
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');

  // Sorting state
  const [sortConfig, setSortConfig] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminOrderService.getAllOrders({ page: currentPage, limit: pageSize });
      const { orders = [], pagination = {} } = response.data || {};
      setOrders(orders);
      setTotalItems(pagination.totalItems ?? orders.length);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ── Pagination ── */
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

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

  const handleStatusChange = async (id, newStatus) => {
    if (!confirm(`Xác nhận chuyển trạng thái đơn hàng thành "${newStatus}"?`)) return;
    try {
      await adminOrderService.updateOrderStatus(id, newStatus);
      toast.success('Order status updated');
      setOrders((prev) => prev.map((o) => (o.order_id === id ? { ...o, status: newStatus } : o)));
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error(error.response?.data?.message || error.message || 'Cập nhật thất bại');
    }
  };

  // -- MULTI-SELECT --
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrderIds(orders.map((o) => o.order_id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectRow = (e, orderId) => {
    if (e.target.checked) {
      setSelectedOrderIds((prev) => [...prev, orderId]);
    } else {
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  // -- BULK UPDATE --
  const handleBulkApply = async () => {
    if (!bulkStatus) {
      toast.error('Vui lòng chọn trạng thái muốn áp dụng');
      return;
    }
    if (selectedOrderIds.length === 0) return;

    if (!confirm(`Xác nhận chuyển ${selectedOrderIds.length} đơn hàng đã chọn sang "${bulkStatus}"?`)) return;

    try {
      const response = await adminOrderService.updateBulkOrderStatus(selectedOrderIds, bulkStatus);
      const { succeeded, failed } = response.data;

      // Update successful ones in UI without refetching
      if (succeeded && succeeded.length > 0) {
        setOrders((prev) =>
          prev.map((o) => (succeeded.includes(o.order_id) ? { ...o, status: bulkStatus } : o))
        );
        toast.success(`Đã cập nhật thành công ${succeeded.length} đơn hàng`);
      }

      // Show toast errors for failed ones
      if (failed && failed.length > 0) {
        failed.forEach((f) => {
          toast.error(`Lỗi đơn #${f.id}: ${f.message}`);
        });
      }

      // Clear selection after process
      setSelectedOrderIds([]);
      setBulkStatus('');
    } catch (error) {
      console.error('Bulk update failed', error);
      toast.error(error.response?.data?.message || error.message || 'Cập nhật hàng loạt thất bại');
    }
  };

  // -- SORTING LOGIC --
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleResetSort = () => {
    setSortConfig(null);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const isAsc = direction === 'asc';

    if (key === 'status') {
      const weightA = STATUS_WEIGHT[a.status] || 99;
      const weightB = STATUS_WEIGHT[b.status] || 99;
      return isAsc ? weightA - weightB : weightB - weightA;
    } else if (key === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return isAsc ? dateA - dateB : dateB - dateA;
    } else if (key === 'total_amount') {
      const amountA = Number(a.total_amount);
      const amountB = Number(b.total_amount);
      return isAsc ? amountA - amountB : amountB - amountA;
    }
    return 0;
  });

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders Management</h1>

      {/* Stats cards */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Tổng Đơn Hàng</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Chờ Xử Lý</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {orders.filter((o) => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Đang Giao Hàng</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {orders.filter((o) => o.status === 'shipping').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Đã Giao</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {orders.filter((o) => o.status === 'delivered').length}
            </p>
          </div>
        </div>
      )}

      {/* Toolbar: Sorting & Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Bulk Action Toolbar */}
        {selectedOrderIds.length > 0 ? (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg w-full sm:w-auto">
            <span className="text-sm font-medium text-blue-700 whitespace-nowrap">
              Đã chọn {selectedOrderIds.length} đơn
            </span>
            <select
              className="border border-blue-200 rounded px-2 py-1 text-sm bg-white focus:outline-none"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="confirmed">confirmed</option>
              <option value="shipping">shipping</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
            <button
              onClick={handleBulkApply}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            * Chọn các đơn hàng để thao tác hàng loạt
          </div>
        )}

        {/* Reset Sort Button */}
        {sortConfig && (
          <button
            onClick={handleResetSort}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
          >
            ↺ Reset Sort
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">ID</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Khách hàng</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Người nhận</th>
                <th
                  className="p-4 font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total_amount')}
                >
                  Tổng tiền {renderSortIcon('total_amount')}
                </th>
                <th
                  className="p-4 font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Trạng thái {renderSortIcon('status')}
                </th>
                <th
                  className="p-4 font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  Ngày tạo {renderSortIcon('created_at')}
                </th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Cập nhật TT</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Xem</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr key={order.order_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        checked={selectedOrderIds.includes(order.order_id)}
                        onChange={(e) => handleSelectRow(e, order.order_id)}
                      />
                    </td>
                    <td className="p-4 text-gray-700 font-medium">#{order.order_id}</td>

                    {/* Khách hàng */}
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-800">{order.user_email}</div>
                    </td>

                    {/* Người nhận */}
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-800">{order.receiver_name}</div>
                      <div className="text-xs text-gray-500">{order.receiver_phone}</div>
                    </td>

                    {/* Tổng tiền */}
                    <td className="p-4 font-semibold text-gray-800">
                      {formatCurrency(order.total_amount)}
                    </td>

                    {/* Trạng thái */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Ngày tạo */}
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Cập nhật trạng thái */}
                    <td className="p-4">
                      <select
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white disabled:opacity-40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        disabled={TERMINAL_STATUSES.includes(order.status)}
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="shipping">shipping</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>

                    {/* Xem chi tiết */}
                    <td className="p-4">
                      <button
                        onClick={() => setViewingOrderId(order.order_id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span>/ {totalItems} đơn hàng</span>
          </div>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                  className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition ${page === currentPage
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {viewingOrderId && (
        <OrderDetailModal
          orderId={viewingOrderId}
          onClose={() => setViewingOrderId(null)}
        />
      )}
    </div>
  );
}
