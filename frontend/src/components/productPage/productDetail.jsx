'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Users, ShieldCheck, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductActions from '../product/ProductActions';
import { getBestDiscount, getDiscountedPrice } from '@/components/product/DiscountBadge';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/services/productService';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

// ── Related Products Carousel ─────────────────────────────────────────────────
function RelatedProductsSection({ productId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setRelated([]);
    productService
      .getRelatedProducts(productId, 8)
      .then((res) => setRelated(res?.data ?? []))
      .catch(() => setRelated([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Ẩn toàn bộ section nếu API trả về 0 kết quả
  if (!loading && related.length === 0) return null;

  return (
    <div className="border-divider mt-20 border-t pt-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-text-primary text-2xl font-medium">Có thể bạn cũng thích</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="bg-secondary text-text-primary hover:bg-primary hover:text-white flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            aria-label="Cuộn trái"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="bg-secondary text-text-primary hover:bg-primary hover:text-white flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            aria-label="Cuộn phải"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-secondary h-80 w-56 flex-shrink-0 animate-pulse rounded-xl"
            />
          ))
          : related.map((product) => (
            <div key={product.product_id} className="w-56 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    </div>
  );
}

// ── Product Detail Client Component ──────────────────────────────────────────
export default function ProductDetailClient({ product, campaigns = [] }) {
  // ── Tính giá với campaign discount ──────────────────────────────────────────
  const basePrice = parseFloat(product.base_price) || 0;
  const apiSalePrice = product.sale_price ? parseFloat(product.sale_price) : null;

  // Lấy discount tốt nhất từ campaign
  const bestCampaignDiscount = getBestDiscount(campaigns);
  const campaignPrice = bestCampaignDiscount
    ? getDiscountedPrice(basePrice, bestCampaignDiscount)
    : null;

  // Giá hiển thị cuối: sale_price API > campaign price > base_price
  const displayPrice = apiSalePrice ?? campaignPrice ?? basePrice;
  const originalPrice = displayPrice < basePrice ? basePrice : null;

  // Badge: campaign discount ưu tiên cao hơn derived-from-sale-price badge
  const badgeDiscount =
    bestCampaignDiscount ||
    (apiSalePrice && apiSalePrice < basePrice
      ? { type: 'PERCENTAGE', value: Math.round((1 - apiSalePrice / basePrice) * 100) }
      : null);

  // Campaigns áp dụng cho sản phẩm này (lọc PERCENTAGE & FIXED_PRICE)
  const productCampaigns = campaigns.filter(
    (c) => c.campaign_type === 'PERCENTAGE' || c.campaign_type === 'FIXED_PRICE',
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Sản phẩm', href: '/products' },
          { label: product.product_name },
        ]}
        className="mb-6"
      />
      {/* Product Section */}
      <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Images */}
        <div className="relative">
          {/* Badge nổi bật trên gallery */}
          {badgeDiscount && (
            <div className="absolute left-2 top-2 z-20">
              <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                <Tag className="h-3.5 w-3.5" />
                {badgeDiscount.type === 'PERCENTAGE'
                  ? `-${badgeDiscount.value}%`
                  : `-${new Intl.NumberFormat('vi-VN').format(badgeDiscount.value)}đ`}
              </span>
            </div>
          )}
          <ProductImageGallery thumbnail={product.thumbnail} images={product.images} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <h1 className="text-text-primary mb-4 text-2xl font-medium md:text-3xl">
            {product.product_name}
          </h1>

          {/* Giá */}
          <div className="mb-6 flex flex-wrap items-baseline gap-3">
            <span className="text-text-primary text-3xl font-bold">
              {formatCurrency(displayPrice)}
            </span>
            {originalPrice && (
              <span className="text-text-muted text-xl font-light line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
            {badgeDiscount && (
              <span className="rounded-full bg-red-50 px-3 py-0.5 text-sm font-bold text-red-600">
                {badgeDiscount.type === 'PERCENTAGE'
                  ? `-${badgeDiscount.value}%`
                  : `-${new Intl.NumberFormat('vi-VN').format(badgeDiscount.value)}đ`}
              </span>
            )}
          </div>

          {/* Category Tag */}
          {product.category && (
            <div className="mb-4">
              <Link
                href={`/category/${product.category.category_slug || product.category.category_id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-primary hover:text-white transition-all duration-150 uppercase tracking-wider"
              >
                {product.category.category_name}
              </Link>
            </div>
          )}

          {/* Campaign tags */}
          {productCampaigns.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {productCampaigns.map((c) => (
                <a
                  key={c.campaign_id}
                  href={`/campaigns/${c.campaign_id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100"
                >
                  <Tag className="h-3 w-3" />
                  {c.name}
                </a>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-text-muted mb-8 leading-relaxed">{product.product_description}</p>

          <ProductActions product={product} />

          {/* Meta Info */}
          <div className="mt-6 grid grid-cols-3 gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <p className="text-text-muted text-xs">Chất liệu</p>
                <p className="text-text-primary text-sm font-medium">{product.material}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-text-muted text-xs">Giới tính</p>
                <p className="text-text-primary text-sm font-medium capitalize">{product.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-text-muted text-xs">Thương hiệu</p>
                <p className="text-text-primary text-sm font-medium">{product.brand.brand_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      <RelatedProductsSection productId={product.product_id} />
    </div>
  );
}
