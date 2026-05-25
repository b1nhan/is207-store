'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import orderService from '@/services/orderService';
import voucherService from '@/services/voucherService';
import shippingProfileService from '@/services/shippingProfileService';
import { campaignService } from '@/services/campaignService';
import { productService } from '@/services/productService';
import AddShippingProfileModal from '@/components/AddShippingProfileModal';
import { Button } from '@/components/ui/button';
import {
  CreditCardIcon,
  MapPinIcon,
  TicketIcon,
  TagIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  Loader2Icon,
  CheckCircle2Icon,
  ZapIcon,
  PencilIcon,
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
  const searchParams = useSearchParams();
  const { items, isLoading: cartLoading, removeItemsFromStore } = useCartStore();
  const { isAuthenticated, isInitialized } = useAuthStore();

  // ─── Direct Checkout State ──────────────────────────────────────────────────
  const checkoutType = searchParams.get('type');
  const isDirectCheckout = checkoutType === 'direct';
  const directProductId = Number(searchParams.get('productId'));
  const directVariantId = Number(searchParams.get('variantId'));
  const directQuantity = Number(searchParams.get('quantity'));

  const [directItemDetails, setDirectItemDetails] = useState(null);
  const [isFetchingDirect, setIsFetchingDirect] = useState(isDirectCheckout);

  useEffect(() => {
    if (isDirectCheckout && directProductId && directVariantId && directQuantity) {
      setIsFetchingDirect(true);
      productService.getProduct(directProductId)
        .then((res) => {
          const productDetail = res.data || res;
          const variant = productDetail?.variants?.find((v) => v.variant_id === directVariantId);
          if (variant) {
            setDirectItemDetails({
              product_id: directProductId,
              variant_id: directVariantId,
              quantity: directQuantity,
              unit_price: Number(variant.variant_price ?? productDetail.base_price),
              product_name: productDetail.product_name,
              size: variant.size,
              color: variant.color,
            });
          } else {
            toast.error('Phân loại sản phẩm không hợp lệ');
          }
        })
        .catch(() => {
          toast.error('Không thể tải thông tin sản phẩm');
        })
        .finally(() => {
          setIsFetchingDirect(false);
        });
    } else {
      setIsFetchingDirect(false);
    }
  }, [isDirectCheckout, directProductId, directVariantId, directQuantity]);

  // ─── Parse selectedItemIds from URL ────────────────────────────────────────
  const selectedItemIds = useMemo(() => {
    if (isDirectCheckout) return [];
    const raw = searchParams.get('selectedItems');
    if (!raw) return [];
    return raw.split(',').map(Number).filter(Boolean);
  }, [searchParams, isDirectCheckout]);

  // Chỉ tính toán trên các items được chọn
  const selectedItems = useMemo(() => {
    if (isDirectCheckout) {
      return directItemDetails ? [directItemDetails] : [];
    }
    return items.filter((i) => selectedItemIds.includes(i.cart_item_id));
  }, [items, selectedItemIds, isDirectCheckout, directItemDetails]);

  console.log(selectedItems);

  // subtotal của các items được chọn
  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0),
    [selectedItems],
  );

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ─── Shipping profiles state ────────────────────────────────────────────────
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null); // profile đang edit

  // ─── Voucher state ──────────────────────────────────────────────────────────
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  // ─── Campaign state ─────────────────────────────────────────────────────────
  const [activeCampaigns, setActiveCampaigns] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Fetch active campaigns ──────────────────────────────────────────────────
  useEffect(() => {
    campaignService.getActiveCampaigns()
      .then((res) => {
        // campaignService dùng api helper (axiosInstance đã unwrap) → res = { success, message, data }
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setActiveCampaigns(list);
      })
      .catch(() => setActiveCampaigns([]));
  }, []);

  // ─── Tính campaign discount (mirror backend logic) ──────────────────────────
  const { appliedCampaign, campaignDiscountAmount, isFreeship } = useMemo(() => {
    if (!activeCampaigns.length || !selectedItems.length) {
      return { appliedCampaign: null, campaignDiscountAmount: 0, isFreeship: false };
    }

    const SHIP = SHIPPING_FEE;
    let bestCampaign = null;
    let maxEffective = -1;
    let bestDiscount = 0;
    let bestFreeship = false;

    for (const campaign of activeCampaigns) {
      let discount = 0;
      let freeship = false;
      const campaignProductIds = (campaign.products ?? []).map((p) => p.product_id);
      const appliesToAll = campaignProductIds.length === 0;

      const applicable = selectedItems.filter(
        (item) => appliesToAll || campaignProductIds.includes(item.product_id),
      );

      if (applicable.length > 0) {
        if (campaign.campaign_type === 'PERCENTAGE') {
          const pct = campaign.config?.discount_value ?? 0;
          applicable.forEach((item) => {
            discount += (Number(item.unit_price) * (pct / 100)) * item.quantity;
          });
        } else if (campaign.campaign_type === 'FIXED_PRICE') {
          const fixedPrice = campaign.config?.discount_value ?? 0;
          applicable.forEach((item) => {
            const orig = Number(item.unit_price);
            if (orig > fixedPrice) discount += (orig - fixedPrice) * item.quantity;
          });
        } else if (campaign.campaign_type === 'TIER_DISCOUNT') {
          const totalVal = applicable.reduce(
            (s, item) => s + Number(item.unit_price) * item.quantity, 0,
          );
          const tiers = (campaign.tiers ?? [])
            .filter((t) => totalVal >= t.min_order_value)
            .sort((a, b) => b.min_order_value - a.min_order_value);
          if (tiers.length > 0) {
            discount = totalVal * (tiers[0].discount_value / 100);
          }
        } else if (campaign.campaign_type === 'FREESHIP') {
          freeship = true;
        }
      }

      const effective = discount + (freeship ? SHIP : 0);
      if (effective > maxEffective) {
        maxEffective = effective;
        bestCampaign = campaign;
        bestDiscount = discount;
        bestFreeship = freeship;
      }
    }

    if (!bestCampaign || (bestDiscount === 0 && !bestFreeship)) {
      return { appliedCampaign: null, campaignDiscountAmount: 0, isFreeship: false };
    }
    return { appliedCampaign: bestCampaign, campaignDiscountAmount: bestDiscount, isFreeship: bestFreeship };
  }, [activeCampaigns, selectedItems]);

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
  };

  const handleSetDefault = async (profileId) => {
    setIsSettingDefault(true);
    const toastId = toast.loading('Đang đặt làm địa chỉ mặc định...');
    try {
      await shippingProfileService.setDefault(profileId);
      // Cập nhật local state
      setProfiles((prev) =>
        prev.map((p) => ({ ...p, is_default: p.profile_id === profileId }))
      );
      toast.success('Đã đặt làm địa chỉ mặc định!', { id: toastId });
    } catch (err) {
      toast.error(err?.message || 'Không thể đặt địa chỉ mặc định. Vui lòng thử lại.', { id: toastId });
    } finally {
      setIsSettingDefault(false);
    }
  };

  const handleModalSuccess = (profile) => {
    if (editingProfile) {
      // Edit: cập nhật profile trong list, nếu is_default thì unset các cái khác
      setProfiles((prev) => {
        const updated = prev.map((p) =>
          p.profile_id === profile.profile_id
            ? profile
            : profile.is_default ? { ...p, is_default: false } : p
        );
        return updated;
      });
      setSelectedProfileId(profile.profile_id);
    } else {
      // Add new: nếu is_default thì unset các cái cũ
      setProfiles((prev) => {
        const updated = profile.is_default
          ? prev.map((p) => ({ ...p, is_default: false }))
          : prev;
        return [...updated, profile];
      });
      setSelectedProfileId(profile.profile_id);
    }
    setEditingProfile(null);
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
      // axiosInstance interceptor unwraps response → response.data (HTTP body = { success, message, data })
      // voucherService đã `.data` một lần nữa → trả về chính voucher object { voucher_id, code, discount_amount, ... }
      const voucherData = await voucherService.applyVoucher({ code: voucherCode.trim(), subtotal });
      setAppliedVoucher(voucherData);
      toast.success('Voucher applied');
    } catch (err) {
      // axios interceptor normalize error thành { ...error, message }
      setVoucherError(err.message || err.response?.data?.message || 'Mã giảm giá không hợp lệ');
      toast.error('Invalid or expired voucher');
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

    if (!isDirectCheckout && selectedItemIds.length === 0) {
      setError('Không có sản phẩm nào được chọn để thanh toán.');
      return;
    }

    if (isDirectCheckout && (!directItemDetails)) {
      setError('Thông tin sản phẩm không hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = {
        profile_id: selectedProfileId,
        ...(appliedVoucher && { voucher_code: appliedVoucher.code }),
      };

      if (isDirectCheckout) {
        data.directItem = {
          product_id: directProductId,
          variant_id: directVariantId,
          quantity: directQuantity
        };
      } else {
        data.selectedItemIds = selectedItemIds;
      }

      const response = await orderService.checkout(data);
      toast.success('Order placed successfully');
      // Chỉ xóa các items đã checkout khỏi store nếu không phải mua ngay
      if (!isDirectCheckout) {
        removeItemsFromStore(selectedItemIds);
      }
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

  // Guard: nếu không có selectedItemIds hợp lệ → redirect về cart (nếu không phải direct checkout)
  if (mounted && isInitialized && isAuthenticated && !cartLoading && !isDirectCheckout && selectedItemIds.length === 0) {
    router.replace('/cart');
    return null;
  }

  // Guard: Loading direct checkout
  if (isFetchingDirect) {
    return <div className="flex justify-center items-center h-64"><Loader2Icon size={24} className="animate-spin text-primary" /></div>;
  }

  if (!isDirectCheckout && items.length === 0 && !cartLoading) {
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

  const subtotalAfterCampaign = Math.max(0, subtotal - campaignDiscountAmount);
  const voucherDiscountAmount = appliedVoucher ? appliedVoucher.discount_amount : 0;
  const finalShippingFee = isFreeship ? 0 : SHIPPING_FEE;
  const totalAmount = Math.max(0, subtotalAfterCampaign - voucherDiscountAmount) + finalShippingFee;
  const selectedProfile = profiles.find((p) => p.profile_id === selectedProfileId);

  return (
    <>
      <AddShippingProfileModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProfile(null); }}
        onSuccess={handleModalSuccess}
        initialData={editingProfile}
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
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setEditingProfile(profile); setIsModalOpen(true); }}
                            title="Chỉnh sửa"
                            className="flex-shrink-0 p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors mt-0.5"
                          >
                            <PencilIcon size={14} />
                          </button>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Checkbox đặt làm mặc định */}
                {!profilesLoading && selectedProfile && (
                  <div className="mt-4 pt-4 border-t border-divider">
                    <label className={`flex items-center gap-2 ${selectedProfile.is_default || isSettingDefault ? 'cursor-not-allowed opacity-60' : 'cursor-pointer group'}`}>
                      <input
                        type="checkbox"
                        checked={!!selectedProfile.is_default}
                        onChange={() => {
                          if (!selectedProfile.is_default && !isSettingDefault) {
                            handleSetDefault(selectedProfile.profile_id);
                          }
                        }}
                        disabled={!!selectedProfile.is_default || isSettingDefault}
                        className="accent-primary w-4 h-4 disabled:cursor-not-allowed"
                      />
                      <span
                        className={`text-sm ${selectedProfile.is_default
                          ? 'text-text-secondary'
                          : 'text-text-primary group-hover:text-primary transition-colors'
                          }`}
                      >
                        {isSettingDefault ? 'Đang cập nhật...' : 'Đặt làm địa chỉ mặc định'}
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
                  <span>Tạm tính ({selectedItems.length} sản phẩm đã chọn)</span>
                  <span className="font-medium text-text-primary">
                    {subtotal.toLocaleString('vi-VN')} ₫
                  </span>
                </div>

                {/* Campaign discount */}
                {appliedCampaign && (
                  <div className="rounded-lg bg-orange-500/8 border border-orange-500/20 px-3 py-2.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-orange-500">
                      <ZapIcon size={13} className="flex-shrink-0" />
                      <span className="text-xs font-semibold truncate">{appliedCampaign.name}</span>
                    </div>
                    {campaignDiscountAmount > 0 && (
                      <div className="flex justify-between text-orange-500">
                        <span className="text-sm">Giảm giá campaign</span>
                        <span className="text-sm font-semibold">- {campaignDiscountAmount.toLocaleString('vi-VN')} ₫</span>
                      </div>
                    )}
                    {isFreeship && (
                      <div className="flex justify-between text-orange-500">
                        <span className="text-sm">Miễn phí vận chuyển</span>
                        <span className="text-sm font-semibold">- {SHIPPING_FEE.toLocaleString('vi-VN')} ₫</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Shipping fee */}
                <div className="flex justify-between text-text-secondary">
                  <span>Phí vận chuyển</span>
                  {isFreeship ? (
                    <span className="font-medium">
                      <span className="line-through text-text-secondary/50 mr-1.5 text-sm">
                        {SHIPPING_FEE.toLocaleString('vi-VN')} ₫
                      </span>
                      <span className="text-orange-500 font-semibold">Miễn phí</span>
                    </span>
                  ) : (
                    <span className="font-medium text-text-primary">
                      {SHIPPING_FEE.toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                </div>

                {/* Voucher discount */}
                {appliedVoucher && (
                  <div className="flex justify-between text-green-500">
                    <span className="flex items-center gap-1">
                      <TagIcon size={13} />
                      Voucher ({appliedVoucher.code})
                    </span>
                    <span className="font-medium">- {voucherDiscountAmount.toLocaleString('vi-VN')} ₫</span>
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
                disabled={isSubmitting || (!isDirectCheckout && cartLoading) || profilesLoading || !selectedProfileId || isFetchingDirect}
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
