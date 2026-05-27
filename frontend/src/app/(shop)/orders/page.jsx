'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import useAuthStore from '@/store/authStore';
import orderService from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { PackageSearchIcon } from 'lucide-react';
import { formatDate } from '@/utils/date';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipping: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' },
  returned: { label: 'Trả hàng', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export default function OrdersPage() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const pathname = usePathname();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchOrders(page);
    } else if (isInitialized && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isInitialized, isAuthenticated, page]);

  const fetchOrders = async (currentPage) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await orderService.getOrders({ page: currentPage, limit: 10 });
      console.log(response)
      setOrders(response.orders || []);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized || isLoading) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Đơn hàng của bạn</h1>
        <p className="text-text-secondary mb-8">Bạn cần đăng nhập để xem đơn hàng.</p>
        <Button asChild size="lg">
          <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>Đăng nhập ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Profile', href: '/profile' }, { label: 'Đơn hàng của tôi' }]} className="mb-6" />
      <h1 className="text-3xl font-bold text-text-primary mb-8">Lịch sử đơn hàng</h1>

      {error && (
        <div className="bg-error-bg text-error border border-error-border p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl shadow-elevated border border-card-border">
          <PackageSearchIcon className="mx-auto h-16 w-16 text-icon-muted mb-4" />
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-text-secondary mb-6">Bạn chưa đặt mua sản phẩm nào.</p>
          <Button asChild size="lg">
            <Link href="/products">Mua sắm ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };

            return (
              <div key={order.order_id} className="bg-surface rounded-2xl shadow-sm border border-card-border p-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-border">
                  <div>
                    <h3 className="font-semibold text-lg text-text-primary">
                      Đơn hàng #{order.order_id}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      Ngày đặt: {formatDate(order.order_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {Number(order.total_amount).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <div>
                    <h3 className="font-medium text-md text-text-primary">
                      Người nhận: {order.receiver_name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      SĐT: {order.receiver_phone}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/orders/${order.order_id}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Trang trước
              </Button>
              <span className="text-text-secondary px-4">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
