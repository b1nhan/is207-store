'use client';

import { useEffect, useState } from 'react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Trash2Icon, MinusIcon, PlusIcon, ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, subtotal, isLoading, error, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated, isInitialized } = useAuthStore();
  
  // To avoid hydration errors since Zustand state might differ from SSR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isInitialized) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Giỏ hàng của bạn</h1>
        <p className="text-text-secondary mb-8">Bạn cần đăng nhập để xem giỏ hàng.</p>
        <Button asChild size="lg">
          <Link href="/login">Đăng nhập ngay</Link>
        </Button>
      </div>
    );
  }

  if (isLoading && items.length === 0) {
     return <div className="flex justify-center items-center h-64">Đang tải giỏ hàng...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Giỏ hàng của bạn</h1>
      
      {error && (
        <div className="bg-error-bg text-error border border-error-border p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl shadow-elevated border border-card-border">
          <ShoppingBagIcon className="mx-auto h-16 w-16 text-icon-muted mb-4" />
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Giỏ hàng trống</h2>
          <p className="text-text-secondary mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Button asChild size="lg">
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
              <Button variant="ghost" className="text-error hover:text-error hover:bg-error-bg" onClick={() => clearCart()}>
                Xóa tất cả
              </Button>
            </div>
            {items.map((item) => (
              <div key={item.cart_item_id} className="flex gap-4 p-4 bg-surface rounded-2xl shadow-sm border border-card-border">
                <div className="w-24 h-24 flex-shrink-0 bg-secondary rounded-lg overflow-hidden relative">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs text-center">No Image</div>
                  )}
                </div>
                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/products/${item.product_id}`} className="text-lg font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2">
                        {item.product_name}
                      </Link>
                      <p className="text-sm text-text-secondary mt-1">
                        Phân loại: <span className="font-medium text-text-primary">{item.color}</span> - <span className="font-medium text-text-primary">{item.size}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-primary">{item.unit_price.toLocaleString('vi-VN')} ₫</p>
                      {!item.is_available && (
                        <p className="text-xs text-error mt-1 font-medium bg-error-bg px-2 py-0.5 rounded-full inline-block">Ngừng bán</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-border rounded-md overflow-hidden bg-surface">
                      <button 
                        className="p-2 text-text-secondary hover:text-primary hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isLoading}
                      >
                        <MinusIcon size={16} />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                      <button 
                        className="p-2 text-text-secondary hover:text-primary hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock_quantity || isLoading}
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>
                    <button 
                      className="p-2 text-text-muted hover:text-error transition-colors bg-surface rounded-md border border-transparent hover:border-error-border"
                      onClick={() => removeItem(item.cart_item_id)}
                      disabled={isLoading}
                    >
                      <Trash2Icon size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-surface p-6 rounded-2xl shadow-elevated border border-card-border h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-6 text-text-primary">Tổng đơn hàng</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Tạm tính</span>
                <span className="font-medium text-text-primary">{subtotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Giảm giá</span>
                <span className="font-medium text-text-primary">0 ₫</span>
              </div>
              <div className="border-t border-divider pt-4 flex justify-between items-center">
                <span className="font-semibold text-text-primary text-lg">Tổng tiền</span>
                <span className="text-2xl font-bold text-primary">{subtotal.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
            <Button className="w-full font-semibold" size="lg" asChild>
              <Link href="/checkout">Tiến hành thanh toán</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
