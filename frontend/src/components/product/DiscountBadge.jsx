import React from 'react';

/**
 * Tính discount cao nhất từ danh sách campaigns cho một sản phẩm.
 * campaigns: campaign[] từ API /campaigns/active?product_id=xxx
 * Returns: { type: 'PERCENTAGE'|'FIXED_PRICE', value: number } | null
 */
export function getBestDiscount(campaigns = []) {
  if (!campaigns || campaigns.length === 0) return null;

  let best = null;

  for (const c of campaigns) {
    if (c.campaign_type === 'PERCENTAGE' && c.config?.discount_value) {
      if (!best || c.config.discount_value > (best.type === 'PERCENTAGE' ? best.value : 0)) {
        best = { type: 'PERCENTAGE', value: c.config.discount_value };
      }
    } else if (c.campaign_type === 'FIXED_PRICE' && c.config?.discount_value) {
      // Convert fixed to "equivalent percentage" only for comparison if needed,
      // but store as FIXED_PRICE
      if (!best || best.type !== 'PERCENTAGE') {
        if (!best || c.config.discount_value > best.value) {
          best = { type: 'FIXED_PRICE', value: c.config.discount_value };
        }
      }
    }
  }

  return best;
}

/**
 * Tính giá sau giảm giá.
 * discount: { type, value } từ getBestDiscount
 * basePrice: số
 */
export function getDiscountedPrice(basePrice, discount) {
  if (!discount) return null;
  if (discount.type === 'PERCENTAGE') {
    return basePrice * (1 - discount.value / 100);
  }
  if (discount.type === 'FIXED_PRICE') {
    return Math.max(0, basePrice - discount.value);
  }
  return null;
}

/**
 * Badge hiển thị mức giảm giá.
 * Props:
 *   discount: { type: 'PERCENTAGE'|'FIXED_PRICE', value: number }
 *   className: string (override)
 */
export function DiscountBadge({ discount, className = '' }) {
  if (!discount) return null;

  let label = '';
  if (discount.type === 'PERCENTAGE') {
    label = `-${discount.value}%`;
  } else if (discount.type === 'FIXED_PRICE') {
    const formatted = new Intl.NumberFormat('vi-VN').format(discount.value);
    label = `-${formatted}đ`;
  }

  if (!label) return null;

  return (
    <span
      className={`absolute left-0 top-0 z-10 rounded-br-lg rounded-tl-lg bg-gradient-to-r from-red-500 to-rose-600 px-2 py-1 text-xs font-bold text-white shadow-md ${className}`}
    >
      {label}
    </span>
  );
}
