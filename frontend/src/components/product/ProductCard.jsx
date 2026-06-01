'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currency';
import { DiscountBadge, getDiscountedPrice } from './DiscountBadge';
import { ShoppingCart } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { MagicCard } from '../ui/magic-card';

/**
 * ProductCard – hiển thị sản phẩm trong grid/listing.
 * Props:
 *   product  – object từ API
 *   discount – { type, value } từ getBestDiscount() (optional, từ campaign)
 */
export const ProductCard = ({ product, discount }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const productlink = `/products/${product.slug || product.product_id}`;

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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng!');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      setIsAdding(true);
      const res = await productService.getProduct(product.product_id);
      const productDetail = res.data;
      console.log(productDetail)

      if (!productDetail || !productDetail.variants || productDetail.variants.length === 0) {
        toast.error('Sản phẩm không hợp lệ!');
        return;
      }

      const defaultVariant = productDetail.variants.find(v => v.stock_quantity > 0) || productDetail.variants[0];

      if (defaultVariant.stock_quantity < 1) {
        toast.error('Sản phẩm đã hết hàng!');
        return;
      }

      const success = await addToCart(defaultVariant.variant_id, 1);
      if (success) {
        let variantLabel = '';
        if (defaultVariant.size || defaultVariant.color) {
          const parts = [];
          if (defaultVariant.size) parts.push(`Size ${defaultVariant.size}`);
          if (defaultVariant.color) parts.push(defaultVariant.color);
          variantLabel = ` (${parts.join(' / ')})`;
        }

        toast.success(`Đã thêm sản phẩm ${product.product_name} vào giỏ hàng`);
      } else {
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng!');
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      setIsAdding(true);
      const res = await productService.getProduct(product.product_id);
      const productDetail = res.data || res;

      if (!productDetail || !productDetail.variants || productDetail.variants.length === 0) {
        toast.error('Sản phẩm không hợp lệ!');
        return;
      }

      const defaultVariant = productDetail.variants.find(v => v.stock_quantity > 0) || productDetail.variants[0];

      if (defaultVariant.stock_quantity < 1) {
        toast.error('Sản phẩm đã hết hàng!');
        return;
      }

      const params = new URLSearchParams({
        type: 'direct',
        productId: productDetail.product_id,
        variantId: defaultVariant.variant_id,
        quantity: 1
      });
      router.push(`/checkout?${params.toString()}`);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <MagicCard
      mode="orb"
      glowFrom={"#E9D5FF"}
      glowTo={"#FBCFE8"}
      className="group relative mx-auto flex w-full max-w-[280px] flex-col items-center justify-center space-y-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      {/* <div className="group relative mx-auto flex w-full max-w-[280px] flex-col items-center justify-center space-y-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"> */}
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
        <div
          onClick={handleBuyNow}
          className="bg-primary hover:bg-hover relative mx-auto mt-4 flex h-[40px] w-full max-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg text-center text-sm font-semibold text-white transition-all active:scale-95"
        >
          Mua ngay
        </div>
      </Link>

      {/* Nút Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md hover:text-primary text-gray-600 disabled:opacity-50"
        title="Thêm vào giỏ hàng"
      >
        <ShoppingCart size={16} />
      </button>
      {/* </div> */}
    </MagicCard >

  );
};

