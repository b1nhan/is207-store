'use client';

import { useEffect, useMemo, useState } from 'react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { campaignService } from '@/services/campaignService';
import { Button } from '@/components/ui/button';
import { Trash2Icon, MinusIcon, PlusIcon, ShoppingBagIcon, ZapIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const SHIPPING_FEE = 30000;

/**
 * Tính discount amount cho một item dựa trên danh sách campaigns đang active.
 * Trả về: { discountAmount, discountLabel, campaignName } | null
 */
function getItemCampaignDiscount(item, activeCampaigns) {
  if (!activeCampaigns.length) return null;

  let bestDiscount = 0;
  let bestLabel = '';
  let bestCampaignName = '';

  for (const campaign of activeCampaigns) {
    // Bỏ qua TIER_DISCOUNT và FREESHIP (không discount theo từng item)
    if (campaign.campaign_type === 'TIER_DISCOUNT' || campaign.campaign_type === 'FREESHIP') continue;

    const campaignProductIds = (campaign.products ?? []).map((p) => p.product_id);
    const appliesToAll = campaignProductIds.length === 0;
    const isApplicable = appliesToAll || campaignProductIds.includes(item.product_id);
    if (!isApplicable) continue;

    const price = Number(item.unit_price);
    let discount = 0;
    let label = '';

    if (campaign.campaign_type === 'PERCENTAGE') {
      const pct = campaign.config?.discount_value ?? 0;
      discount = price * (pct / 100);
      label = `-${pct}%`;
    } else if (campaign.campaign_type === 'FIXED_PRICE') {
      const fixedPrice = campaign.config?.discount_value ?? 0;
      if (price > fixedPrice) {
        discount = price - fixedPrice;
        label = `Còn ${fixedPrice.toLocaleString('vi-VN')}₫`;
      }
    }

    if (discount > bestDiscount) {
      bestDiscount = discount;
      bestLabel = label;
      bestCampaignName = campaign.name;
    }
  }

  if (bestDiscount <= 0) return null;
  return { discountAmount: bestDiscount, discountLabel: bestLabel, campaignName: bestCampaignName };
}

function QuantityInput({ value, stock, onChange, disabled }) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const commitValue = (valStr) => {
    let num = parseInt(valStr, 10);
    if (isNaN(num) || num < 1) {
      num = 1;
    } else if (num > stock) {
      num = stock;
    }
    setInputValue(String(num));
    if (num !== value) {
      onChange(num);
    }
  };

  const handleChange = (e) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setInputValue('');
      return;
    }
    const clean = rawVal.replace(/\D/g, '');
    if (clean) {
      const num = parseInt(clean, 10);
      if (num > stock) {
        setInputValue(String(stock));
      } else {
        setInputValue(clean);
      }
    }
  };

  const handleBlur = () => {
    commitValue(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitValue(inputValue);
      e.target.blur();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      className="w-12 text-center font-medium text-sm focus:outline-none focus:ring-1 focus:ring-primary border-x border-border py-1 bg-surface h-8"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    />
  );
}


export default function CartPage() {
  const router = useRouter();
  const { items, isLoading, error, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated, isInitialized } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [activeCampaigns, setActiveCampaigns] = useState([]);

  // ── Selected item IDs (cart_item_id) ────────────────────────────────────────
  // Mặc định chọn tất cả khi mở trang
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Reset selection về "chọn tất cả" mỗi khi items thay đổi (mở lại trang / fetch xong)
  useEffect(() => {
    setSelectedIds(new Set(items.map((i) => i.cart_item_id)));
  }, [items]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch active campaigns (không cần auth)
  useEffect(() => {
    campaignService.getActiveCampaigns()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setActiveCampaigns(list);
      })
      .catch(() => setActiveCampaigns([]));
  }, []);

  // Map: cart_item_id → campaign discount info
  const itemDiscountMap = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      const info = getItemCampaignDiscount(item, activeCampaigns);
      if (info) map.set(item.cart_item_id, info);
    }
    return map;
  }, [items, activeCampaigns]);

  // ── Computed values based on SELECTED items ──────────────────────────────────
  const selectedItems = useMemo(
    () => items.filter((i) => selectedIds.has(i.cart_item_id)),
    [items, selectedIds],
  );

  const selectedSubtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0),
    [selectedItems],
  );

  const selectedCampaignDiscount = useMemo(() => {
    let total = 0;
    for (const item of selectedItems) {
      const info = itemDiscountMap.get(item.cart_item_id);
      if (info) total += info.discountAmount * item.quantity;
    }
    return total;
  }, [selectedItems, itemDiscountMap]);

  const estimatedTotal = Math.max(0, selectedSubtotal - selectedCampaignDiscount);

  // ── Select-all state ─────────────────────────────────────────────────────────
  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.cart_item_id)));
    }
  };

  const toggleItem = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Checkout handler ─────────────────────────────────────────────────────────
  const handleCheckout = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds).join(',');
    router.push(`/checkout?selectedItems=${ids}`);
  };

  // ── Guards ───────────────────────────────────────────────────────────────────
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
      <Breadcrumbs items={[{ label: 'Giỏ hàng' }]} className="mb-6" />
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
          {/* ── Cart Items List ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header row: select-all + clear */}
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                {/* Custom checkbox "Select All" */}
                <span
                  onClick={toggleSelectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer
                    ${allSelected
                      ? 'bg-primary border-primary'
                      : someSelected
                        ? 'bg-primary/20 border-primary'
                        : 'border-border bg-surface group-hover:border-primary/60'
                    }`}
                >
                  {allSelected && <CheckIcon size={12} className="text-white" strokeWidth={3} />}
                  {someSelected && <span className="w-2.5 h-0.5 bg-primary rounded-full block" />}
                </span>
                <span
                  onClick={toggleSelectAll}
                  className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors"
                >
                  Chọn tất cả ({items.length})
                </span>
              </label>

              <Button
                variant="ghost"
                className="text-error hover:text-error hover:bg-error-bg text-sm"
                onClick={() => clearCart()}
              >
                Xóa tất cả
              </Button>
            </div>

            {items.map((item) => {
              const isSelected = selectedIds.has(item.cart_item_id);
              const discount = itemDiscountMap.get(item.cart_item_id);
              const discountedPrice = discount
                ? Number(item.unit_price) - discount.discountAmount
                : null;

              return (
                <div
                  key={item.cart_item_id}
                  className={`flex gap-4 p-4 bg-surface rounded-2xl shadow-sm border transition-all duration-200 ${
                    isSelected
                      ? 'border-primary/50 ring-1 ring-primary/20'
                      : 'border-card-border opacity-70'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex items-center flex-shrink-0 pt-1">
                    <span
                      onClick={() => toggleItem(item.cart_item_id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all
                        ${isSelected
                          ? 'bg-primary border-primary'
                          : 'border-border bg-surface hover:border-primary/60'
                        }`}
                    >
                      {isSelected && <CheckIcon size={12} className="text-white" strokeWidth={3} />}
                    </span>
                  </div>

                  {/* Thumbnail */}
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
                    {/* Campaign badge */}
                    {discount && (
                      <div className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight flex items-center gap-0.5">
                        <ZapIcon size={9} />
                        {discount.discountLabel}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.product_id}`}
                          className="text-lg font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.product_name}
                        </Link>
                        <p className="text-sm text-text-secondary mt-1">
                          Phân loại: <span className="font-medium text-text-primary">{item.color}</span> - <span className="font-medium text-text-primary">{item.size}</span>
                        </p>
                        {/* Campaign name tag */}
                        {discount && (
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full font-medium">
                            <ZapIcon size={10} />
                            {discount.campaignName}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        {discount ? (
                          <>
                            <p className="font-semibold text-primary">
                              {discountedPrice.toLocaleString('vi-VN')} ₫
                            </p>
                            <p className="text-xs text-text-secondary line-through">
                              {Number(item.unit_price).toLocaleString('vi-VN')} ₫
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold text-primary">
                            {Number(item.unit_price).toLocaleString('vi-VN')} ₫
                          </p>
                        )}
                        {!item.is_available && (
                          <p className="text-xs text-error mt-1 font-medium bg-error-bg px-2 py-0.5 rounded-full inline-block">Ngừng bán</p>
                        )}
                      </div>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-border rounded-md overflow-hidden bg-surface">
                        <button
                          className="p-2 text-text-secondary hover:text-primary hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          <MinusIcon size={16} />
                        </button>
                        <QuantityInput
                          value={item.quantity}
                          stock={item.stock_quantity}
                          onChange={(val) => updateQuantity(item.cart_item_id, val)}
                          disabled={isLoading}
                        />
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
              );
            })}
          </div>

          {/* ── Cart Summary ── */}
          <div className="bg-surface p-6 rounded-2xl shadow-elevated border border-card-border h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-6 text-text-primary">Tổng đơn hàng</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Đã chọn ({selectedIds.size}/{items.length} sản phẩm)</span>
                <span className="font-medium text-text-primary">{selectedSubtotal.toLocaleString('vi-VN')} ₫</span>
              </div>

              {/* Campaign discount summary for selected items */}
              {selectedCampaignDiscount > 0 && (
                <div className="rounded-lg bg-orange-500/8 border border-orange-500/20 px-3 py-2 flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-orange-500 text-sm">
                    <ZapIcon size={13} />
                    Giảm giá campaign
                  </span>
                  <span className="text-sm font-semibold text-orange-500">
                    - {selectedCampaignDiscount.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              )}

              <div className="border-t border-divider pt-4 flex justify-between items-center">
                <span className="font-semibold text-text-primary text-lg">Tạm tính</span>
                <div className="text-right">
                  {selectedCampaignDiscount > 0 && (
                    <p className="text-xs text-text-secondary line-through">
                      {selectedSubtotal.toLocaleString('vi-VN')} ₫
                    </p>
                  )}
                  <span className="text-2xl font-bold text-primary">
                    {estimatedTotal.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              {selectedCampaignDiscount > 0 && (
                <p className="text-xs text-orange-500 text-center font-medium">
                  🎉 Bạn đang tiết kiệm {selectedCampaignDiscount.toLocaleString('vi-VN')} ₫ từ campaign!
                </p>
              )}

              {selectedIds.size === 0 && (
                <p className="text-xs text-text-muted text-center italic">
                  Hãy chọn ít nhất một sản phẩm để tiến hành thanh toán.
                </p>
              )}
            </div>

            <Button
              className="w-full font-semibold"
              size="lg"
              onClick={handleCheckout}
              disabled={selectedIds.size === 0 || isLoading}
            >
              Tiến hành thanh toán
              {selectedIds.size > 0 && (
                <span className="ml-2 text-xs opacity-80">({selectedIds.size})</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
