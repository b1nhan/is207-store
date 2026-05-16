'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import orderService from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, MapPinIcon, PackageIcon } from 'lucide-react';
import { formatDate } from '@/utils/date';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipping: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' },
  returned: { label: 'Trả hàng', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export default function OrderDetailPage({ params }) {
  // Use React.use to unwrap params since Next.js 15+ expects it for async params
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;

  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchOrderDetail();
    } else if (isInitialized && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isInitialized, isAuthenticated, orderId]);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

    setIsCancelling(true);
    try {
      await orderService.cancelOrder(orderId, 'Khách hàng hủy đơn');
      await fetchOrderDetail(); // Reload order detail to show cancelled status
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isInitialized || isLoading) {
    return <div className="flex justify-center items-center h-64">Đang tải chi tiết đơn hàng...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Chi tiết đơn hàng</h1>
        <p className="text-text-secondary mb-8">Bạn cần đăng nhập để xem đơn hàng.</p>
        <Button asChild size="lg">
          <Link href="/login">Đăng nhập ngay</Link>
        </Button>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-error-bg text-error border border-error-border p-4 rounded-md inline-block mb-6">
          {error || 'Không tìm thấy đơn hàng'}
        </div>
        <br />
        <Button asChild variant="outline">
          <Link href="/orders">Quay lại danh sách đơn hàng</Link>
        </Button>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/orders" className="inline-flex items-center text-text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeftIcon size={16} className="mr-2" />
        Quay lại danh sách đơn hàng
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Đơn hàng #{order.order_id}</h1>
          <p className="text-text-secondary mt-1">
            Ngày đặt: {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {order.status === 'pending' && (
            <Button
              variant="outline"
              className="text-error border-error hover:bg-error hover:text-white"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Shipping Info */}
        <div className="md:col-span-2 bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPinIcon className="text-primary" />
            Địa chỉ nhận hàng
          </h2>
          {/* Note: In real app, you might want to fetch the exact shipping address snapshot from the backend if it returns it. For now assuming it is not directly returned or returned as receiver_name */}
          <div className="text-text-secondary">
            {order.shipping_address ? (
              <>
                <p className="font-medium text-text-primary text-lg mb-1">{order.receiver_name}</p>
                <p className="mb-1">Số điện thoại: {order.receiver_phone}</p>
                <p>Địa chỉ: {order.shipping_address}</p>
              </>
            ) : (
              <p className="italic">Đang cập nhật thông tin vận chuyển...</p>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
          <h2 className="text-lg font-semibold mb-4">Tổng quan</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Tạm tính</span>
              <span className="font-medium text-text-primary">{Number(order.subtotal).toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Phí vận chuyển</span>
              <span className="font-medium text-text-primary">{Number(order.shipping_fee).toLocaleString('vi-VN')} ₫</span>
            </div>
            {Number(order.discount_total) > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Giảm giá</span>
                <span className="font-medium">- {Number(order.discount_total).toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
            <div className="border-t border-divider pt-3 flex justify-between items-center">
              <span className="font-semibold text-text-primary">Tổng cộng</span>
              <span className="text-xl font-bold text-primary">{Number(order.total_amount).toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-surface rounded-2xl shadow-sm border border-card-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <PackageIcon className="text-primary" />
            Sản phẩm đã mua
          </h2>
        </div>
        <div className="divide-y divide-border">
          {order.items?.map((item) => (
            <div key={item.unit_price_snapshot} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Product Info */}
              <div className="flex-grow">
                <Link href={`/products/${item.product_id || '#'}`} className="text-lg font-medium text-text-primary hover:text-primary transition-colors">
                  {item.product_name_snapshot}
                </Link>
                <div className="text-sm text-text-secondary mt-1">
                  Phân loại: {item.color_snapshot} - {item.size_snapshot}
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="flex items-center gap-8 text-right min-w-[200px] justify-end">
                <div className="text-text-secondary">
                  {Number(item.unit_price_snapshot).toLocaleString('vi-VN')} ₫ <span className="mx-1">x</span> {item.quantity}
                </div>
                <div className="font-semibold text-primary w-24">
                  {Number(item.line_total).toLocaleString('vi-VN')} ₫
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
