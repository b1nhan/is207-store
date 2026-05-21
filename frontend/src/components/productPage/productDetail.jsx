'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import React, { useState, useEffect } from 'react';
import { Box, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/currency';
import { ProductGrid } from '../product/ProductGrid';
import { QuantityInput } from '@/components/product/QuantityInput';
import { VariantSelector } from '@/components/product/VariantSelector';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductActions from '../product/ProductActions';

export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  console.log(product)
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleThumbnailClick = (index) => {
    if (!api) return;
    api.scrollTo(index);
  };

  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [quantity, setQuantity] = useState(1);

  const displayPrice = product.sale_price || product.base_price;
  const isSale = product.sale_price && product.sale_price < product.base_price;
  const originalPrice = isSale ? product.base_price : null;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Product Section */}
      <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Images */}
        <div>
          <ProductImageGallery
            thumbnail={product.thumbnail}
            images={product.images}
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <h1 className="text-text-primary mb-4 text-2xl font-medium md:text-3xl">
            {product.product_name}
          </h1>

          <div className="mb-8 flex items-center gap-4">
            <span className="text-text-primary text-3xl font-bold">
              {formatCurrency(displayPrice)}
            </span>
            {originalPrice && (
              <span className="text-text-muted text-xl font-light line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-text-muted mb-8 leading-relaxed">
            {product.product_description}
          </p>

          <ProductActions product={product} />


          {/* Meta Info */}
          <div className="mt-6 grid grid-cols-3 gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <p className="text-text-muted text-xs">Chất liệu</p>
                <p className="text-text-primary text-sm font-medium">
                  {product.material}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-text-muted text-xs">Giới tính</p>
                <p className="text-text-primary text-sm font-medium capitalize">
                  {product.gender}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-text-muted text-xs">Thương hiệu</p>
                <p className="text-text-primary text-sm font-medium">
                  {product.brand.brand_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="border-divider mt-20 border-t pt-10">
          <h2 className="text-text-primary mb-8 text-2xl font-medium">
            Sản phẩm tương tự
            <span className="text-text-muted m-2 text-sm font-normal italic">
              Cần sửa lại api lấy sản phẩm tương tự (hiện tại chưa có) - đang
              dùng tạm GetAllProduct
            </span>
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
