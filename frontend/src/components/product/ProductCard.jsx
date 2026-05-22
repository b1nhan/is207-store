import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currency';
import { DiscountBadge, getDiscountedPrice } from './DiscountBadge';

/**
 * ProductCard – hiển thị sản phẩm trong grid/listing.
 * Props:
 *   product  – object từ API
 *   discount – { type, value } từ getBestDiscount() (optional, từ campaign)
 */
export const ProductCard = ({ product, discount }) => {
  const productlink = `/products/${product.product_id || product.slug}`;

  // Ưu tiên sale_price từ API, nếu không thì tính từ campaign discount
  const basePrice = parseFloat(product.base_price) || 0;
  const apiSalePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const campaignPrice = discount ? getDiscountedPrice(basePrice, discount) : null;

  // Giá hiển thị cuối: ưu tiên sale_price API → campaign price → base_price
  const displayPrice = apiSalePrice ?? campaignPrice ?? basePrice;
  const originalPrice = displayPrice < basePrice ? basePrice : null;

  // Nếu không có discount prop nhưng có sale_price từ API, tạo badge từ đó
  const effectiveDiscount = discount || (apiSalePrice && apiSalePrice < basePrice
    ? {
      type: 'PERCENTAGE',
      value: Math.round((1 - apiSalePrice / basePrice) * 100),
    }
    : null);

  return (
    <div className="group relative flex w-full flex-col items-center justify-center space-y-1 rounded-xl border border-gray-50 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link href={productlink} className="flex w-full flex-col items-center">
        {/* Image container with badge */}
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={product.thumbnail || product.images?.[0]?.url}
            alt={product.product_name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <DiscountBadge discount={effectiveDiscount} />
        </div>

        <h3 className="text-text-primary line-clamp-2 flex h-12 items-center text-center text-base font-bold">
          {product.product_name}
        </h3>

        {/* Giá */}
        <div className="mt-1 flex flex-col items-center gap-0.5">
          <p className="text-primary text-center font-bold">
            {formatCurrency(displayPrice)}
          </p>
          {originalPrice && (
            <p className="text-text-muted text-center text-sm font-normal line-through">
              {formatCurrency(originalPrice)}
            </p>
          )}
        </div>

        {/* Đổi Button thành div để tránh lỗi lồng thẻ button trong thẻ a */}
        <div className="bg-primary hover:bg-hover relative mx-auto mt-4 flex h-[40px] w-full max-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg text-center text-sm font-semibold text-white transition-all active:scale-95">
          Mua ngay
        </div>
      </Link>
    </div>
  );
};

