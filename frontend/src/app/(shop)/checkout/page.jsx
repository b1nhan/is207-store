'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import orderService from '@/services/orderService';
import voucherService from '@/services/voucherService';
import shippingProfileService from '@/services/shippingProfileService';
import AddShippingProfileModal from '@/components/AddShippingProfileModal';
import { Button } from '@/components/ui/button';
import {
  CreditCardIcon,
  MapPinIcon,
  TicketIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  Loader2Icon,
  CheckCircle2Icon,
} from 'lucide-react';
import Link from 'next/link';

const SHIPPING_FEE = 30000;

// ─── Skeleton loader cho danh sách profiles ──────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="border border-border rounded-lg p-4 flex gap-3">
          <div className="w-4 h-4 rounded-full bg-border mt-1 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-border rounded w-1/3" />
            <div className="h-3 bg-border rounded w-1/4" />
            <div className="h-3 bg-border rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isLoading: cartLoading, clearCartState } = useCartStore();
  const { isAuthenticated, isInitialized } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ─── Shipping profiles state ────────────────────────────────────────────────
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ─── Voucher state ──────────────────────────────────────────────────────────
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Fetch profiles ─────────────────────────────────────────────────────────
  const fetchProfiles = useCallback(async () => {
    setProfilesLoading(true);
    setProfilesError('');
    try {
      const response = await shippingProfileService.getProfiles();
      // axiosInstance unwraps to response.data — handle cả hai dạng
      const list = Array.isArray(response) ? response : (response?.data ?? []);
      setProfiles(list);

      // Pre-select profile default (nếu có)
      const defaultProfile = list.find((p) => p.is_default);
      if (defaultProfile) {
        setSelectedProfileId(defaultProfile.profile_id);
      } else if (list.length > 0) {
        setSelectedProfileId(list[0].profile_id);
      }

      // Nếu user chưa có profile nào, mở modal luôn
      if (list.length === 0) {
        setIsModalOpen(true);
      }
    } catch (err) {
      setProfilesError('Không thể tải danh sách địa chỉ. Vui lòng thử lại.');
    } finally {
      setProfilesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchProfiles();
  }, [isAuthenticated, fetchProfiles]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleProfileSelect = (id) => {
    setSelectedProfileId(id);
    setSetAsDefault(false); // reset checkbox khi đổi profile
  };

  const handleModalSuccess = (newProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
    setSelectedProfileId(newProfile.profile_id);
    setIsModalOpen(false);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError('Vui lòng nhập mã giảm giá');
      return;
    }
    setIsApplyingVoucher(true);
    setVoucherError('');
    try {
      const response = await voucherService.applyVoucher({ code: voucherCode.trim(), subtotal });
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

    if (!selectedProfileId) {
      setError('Vui lòng chọn địa chỉ giao hàng.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Nếu user muốn đặt làm default và profile đó chưa phải default → gọi PATCH trước
      const selectedProfile = profiles.find((p) => p.profile_id === selectedProfileId);
      if (setAsDefault && selectedProfile && !selectedProfile.is_default) {
        await shippingProfileService.setDefault(selectedProfileId);
      }

      const data = {
        profile_id: selectedProfileId,
        ...(appliedVoucher && { voucher_code: appliedVoucher.code }),
      };

      const response = await orderService.checkout(data);
      clearCartState();
      router.push(`/orders/${response.data?.order_id ?? response.order_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Guards ──────────────────────────────────────────────────────────────────
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

  const discountAmount = appliedVoucher ? appliedVoucher.discount_amount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount) + SHIPPING_FEE;
  const selectedProfile = profiles.find((p) => p.profile_id === selectedProfileId);

  console.log(profiles)

  return (
    <>
      <AddShippingProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Thanh toán</h1>

        {error && (
          <div className="bg-error-bg text-error border border-error-border p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">

              {/* ── Shipping Profile Section ── */}
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MapPinIcon className="text-primary" />
                    Địa chỉ giao hàng
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <PlusCircleIcon size={16} />
                    Thêm địa chỉ mới
                  </button>
                </div>

                {/* Loading */}
                {profilesLoading && <ProfileSkeleton />}

                {/* Error */}
                {!profilesLoading && profilesError && (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-error text-sm">{profilesError}</p>
                    <Button type="button" variant="outline" size="sm" onClick={fetchProfiles}>
                      <RefreshCwIcon size={14} className="mr-1.5" />
                      Thử lại
                    </Button>
                  </div>
                )}

                {/* Empty state */}
                {!profilesLoading && !profilesError && profiles.length === 0 && (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-text-secondary text-sm">
                      Bạn chưa có địa chỉ giao hàng nào.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <PlusCircleIcon size={14} className="mr-1.5" />
                      Thêm địa chỉ ngay
                    </Button>
                  </div>
                )}

                {/* Profile list */}
                {!profilesLoading && !profilesError && profiles.length > 0 && (
                  <div className="space-y-3">
                    {profiles.map((profile) => {
                      const isSelected = profile.profile_id === selectedProfileId;
                      return (
                        <label
                          key={profile.profile_id}
                          htmlFor={`profile-${profile.profile_id}`}
                          className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-all ${isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <input
                            type="radio"
                            id={`profile-${profile.profile_id}`}
                            name="shipping_profile"
                            value={profile.profile_id}
                            checked={isSelected}
                            onChange={() => handleProfileSelect(profile.profile_id)}
                            className="mt-1 accent-primary flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {profile.label && (
                                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  {profile.label}
                                </span>
                              )}
                              {profile.is_default && (
                                <span className="text-xs font-semibold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2Icon size={11} />
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-text-primary mt-1">
                              {profile.receiver_name}
                              <span className="text-text-secondary font-normal ml-2 text-sm">
                                {profile.receiver_phone}
                              </span>
                            </p>
                            <p className="text-text-secondary text-sm mt-0.5 break-words">
                              {profile.full_address}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Checkbox đặt làm mặc định */}
                {!profilesLoading && selectedProfile && (
                  <div className="mt-4 pt-4 border-t border-divider">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={setAsDefault}
                        onChange={(e) => setSetAsDefault(e.target.checked)}
                        disabled={!!selectedProfile.is_default}
                        className="accent-primary w-4 h-4 disabled:cursor-not-allowed"
                      />
                      <span
                        className={`text-sm ${selectedProfile.is_default
                          ? 'text-text-secondary cursor-not-allowed'
                          : 'text-text-primary group-hover:text-primary transition-colors'
                          }`}
                      >
                        {selectedProfile.is_default
                          ? 'Đây đã là địa chỉ mặc định'
                          : 'Đặt làm địa chỉ mặc định'}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* ── Payment Method Section ── */}
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCardIcon className="text-primary" />
                  Phương thức thanh toán
                </h2>
                <div className="border border-primary rounded-lg p-4 bg-primary/5 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-4 border-primary bg-surface flex-shrink-0" />
                    <span className="font-medium text-text-primary">
                      Thanh toán khi nhận hàng (COD)
                    </span>
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
                <Button
                  onClick={handleApplyVoucher}
                  disabled={isApplyingVoucher || !voucherCode.trim()}
                >
                  Áp dụng
                </Button>
              </div>
              {voucherError && <p className="text-error text-sm mt-1">{voucherError}</p>}
              {appliedVoucher && (
                <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                  Đã áp dụng mã: <span className="font-bold">{appliedVoucher.code}</span>
                  <button
                    onClick={() => {
                      setAppliedVoucher(null);
                      setVoucherCode('');
                    }}
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
                  <span className="font-medium text-text-primary">
                    {subtotal.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-text-primary">
                    {SHIPPING_FEE.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-green-500">
                    <span>Giảm giá ({appliedVoucher.code})</span>
                    <span className="font-medium">- {discountAmount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                )}
                <div className="border-t border-divider pt-4 flex justify-between items-center">
                  <span className="font-semibold text-text-primary text-lg">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-primary">
                    {totalAmount.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                className="w-full font-semibold"
                size="lg"
                disabled={isSubmitting || cartLoading || profilesLoading || !selectedProfileId}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2Icon size={16} className="animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  'Đặt hàng'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
