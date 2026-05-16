'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import orderService from '@/services/orderService';
import voucherService from '@/services/voucherService';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, MapPinIcon, TicketIcon } from 'lucide-react';
import Link from 'next/link';

const SHIPPING_FEE = 30000;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isLoading: cartLoading, clearCartState } = useCartStore();
  const { isAuthenticated, isInitialized } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  
  // Voucher State
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

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
        <h1 className="text-3xl font-bold text-text-primary mb-6">Thanh toán</h1>
        <p className="text-text-secondary mb-8">Bạn cần đăng nhập để tiến hành thanh toán.</p>
        <Button asChild size="lg">
          <Link href="/login">Đăng nhập ngay</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0 && !cartLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Thanh toán</h1>
        <p className="text-text-secondary mb-8">Giỏ hàng của bạn đang trống.</p>
        <Button asChild size="lg">
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsApplyingVoucher(true);
    setVoucherError('');
    try {
      const response = await voucherService.applyVoucher({
        code: voucherCode.trim(),
        subtotal
      });
      setAppliedVoucher(response.data);
    } catch (err) {
      setVoucherError(err.response?.data?.message || 'Mã giảm giá không hợp lệ');
      setAppliedVoucher(null);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!receiverName || !receiverPhone || !fullAddress) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    if (!/^0\d{9}$/.test(receiverPhone)) {
      setError('Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 chữ số).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = {
        receiver_name: receiverName,
        receiver_phone: receiverPhone,
        full_address: fullAddress,
        ...(appliedVoucher && { voucher_code: appliedVoucher.code })
      };
      
      const response = await orderService.checkout(data);
      // Xóa state giỏ hàng vì backend đã tự clear
      clearCartState();
      
      // Chuyển hướng tới trang chi tiết đơn hàng hoặc lịch sử đơn hàng
      router.push(`/orders/${response.data.order_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountAmount = appliedVoucher ? appliedVoucher.discount_amount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount) + SHIPPING_FEE;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Thanh toán</h1>
      
      {error && (
        <div className="bg-error-bg text-error border border-error-border p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Info */}
        <div className="lg:col-span-2 space-y-6">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPinIcon className="text-primary" />
                Thông tin nhận hàng
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Nhập họ và tên người nhận"
                    className="w-full px-4 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    placeholder="VD: 0912345678"
                    className="w-full px-4 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Địa chỉ giao hàng</label>
                  <textarea
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCardIcon className="text-primary" />
                Phương thức thanh toán
              </h2>
              <div className="border border-primary rounded-lg p-4 bg-primary/5 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-4 border-primary bg-surface flex-shrink-0" />
                  <span className="font-medium text-text-primary">Thanh toán khi nhận hàng (COD)</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          {/* Voucher Section */}
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TicketIcon className="text-primary" />
              Mã giảm giá
            </h2>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã giảm giá"
                className="flex-grow px-4 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <Button onClick={handleApplyVoucher} disabled={isApplyingVoucher || !voucherCode.trim()}>
                Áp dụng
              </Button>
            </div>
            {voucherError && <p className="text-error text-sm mt-1">{voucherError}</p>}
            {appliedVoucher && (
              <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                Đã áp dụng mã: <span className="font-bold">{appliedVoucher.code}</span>
                <button 
                  onClick={() => { setAppliedVoucher(null); setVoucherCode(''); }}
                  className="text-error hover:underline ml-2 text-xs"
                >
                  Xóa
                </button>
              </p>
            )}
          </div>

          {/* Total Summary Section */}
          <div className="bg-surface p-6 rounded-2xl shadow-elevated border border-card-border sticky top-24">
            <h2 className="text-xl font-semibold mb-6 text-text-primary">Tổng đơn hàng</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Tạm tính ({items.length} sản phẩm)</span>
                <span className="font-medium text-text-primary">{subtotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-text-primary">{SHIPPING_FEE.toLocaleString('vi-VN')} ₫</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-green-500">
                  <span>Giảm giá ({appliedVoucher.code})</span>
                  <span className="font-medium">- {discountAmount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
              <div className="border-t border-divider pt-4 flex justify-between items-center">
                <span className="font-semibold text-text-primary text-lg">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-primary">{totalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              className="w-full font-semibold" 
              size="lg" 
              disabled={isSubmitting || cartLoading}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
