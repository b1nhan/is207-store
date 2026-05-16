'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import orderService from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  PackageIcon, 
  ShoppingCartIcon, 
  ShieldCheckIcon,
  ChevronRightIcon
} from 'lucide-react';
import { formatDate } from '@/utils/date';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipping: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' },
  returned: { label: 'Trả hàng', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const { totalItems } = useCartStore();
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentOrders();
    }
  }, [isAuthenticated]);

  const fetchRecentOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await orderService.getOrders({ page: 1, limit: 3 });
      setRecentOrders(response.orders || []);
      setTotalOrders(response.pagination?.totalItems || 0);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  if (!isInitialized || !isAuthenticated) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin cá nhân */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
              <UserIcon className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-text-primary">{user?.full_name || user?.username}</h2>
            <p className="text-text-secondary mt-1">@{user?.username}</p>
            
            {user?.role === 'ADMIN' && (
              <div className="mt-3 flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                <ShieldCheckIcon className="w-4 h-4" />
                Quản trị viên
              </div>
            )}
          </div>

          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
            <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2 text-text-primary">
              Thông tin liên hệ
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <MailIcon className="w-5 h-5 text-primary/70" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Email</p>
                  <p className="text-sm font-medium text-text-primary">{user?.email || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <PhoneIcon className="w-5 h-5 text-primary/70" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Số điện thoại</p>
                  <p className="text-sm font-medium text-text-primary">{user?.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Thống kê & Đơn hàng gần đây */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thống kê nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                <PackageIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-text-primary">{isLoadingOrders ? '...' : totalOrders}</p>
              </div>
            </div>
            
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="p-4 bg-green-100 rounded-full text-green-600">
                <ShoppingCartIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium">Sản phẩm trong giỏ</p>
                <p className="text-2xl font-bold text-text-primary">{totalItems}</p>
              </div>
            </div>
          </div>

          {/* Đơn hàng gần đây */}
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Đơn hàng gần đây</h3>
              <Button variant="ghost" asChild className="text-primary hover:bg-primary/5">
                <Link href="/orders" className="flex items-center gap-1">
                  Xem tất cả
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {isLoadingOrders ? (
              <div className="flex justify-center items-center py-8 text-text-secondary">
                Đang tải đơn hàng...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                Bạn chưa có đơn hàng nào.
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href="/products">Mua sắm ngay</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
                  
                  return (
                    <div key={order.order_id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border rounded-xl hover:border-primary/30 transition-colors gap-4">
                      <div>
                        <Link href={`/orders/${order.order_id}`} className="font-semibold text-text-primary hover:text-primary transition-colors block mb-1">
                          Đơn hàng #{order.order_id}
                        </Link>
                        <p className="text-sm text-text-secondary">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="font-semibold text-text-primary">
                          {Number(order.total_amount).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
