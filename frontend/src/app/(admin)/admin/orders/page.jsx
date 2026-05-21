'use client';

import { useEffect, useState } from 'react';
import adminOrderService from '@/services/adminOrderService';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':   return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'shipping':  return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'returned':  return 'bg-orange-100 text-orange-800';
    default:          return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'paid':    return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'failed':  return 'bg-red-100 text-red-700';
    default:        return 'bg-gray-100 text-gray-700';
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
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrderId, setViewingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminOrderService.getAllOrders();
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!confirm(`Xác nhận chuyển trạng thái đơn hàng thành "${newStatus}"?`)) return;
    try {
      await adminOrderService.updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status', error);
      alert(error.response?.data?.message || error.message || 'Cập nhật thất bại');
    }
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">ID</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Khách hàng</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Người nhận</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Tổng tiền</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Ngày tạo</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Cập nhật TT</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Xem</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
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
