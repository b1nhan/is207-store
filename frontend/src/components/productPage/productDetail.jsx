'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Box, Users, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/currency';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid } from '../product/ProductGrid';

export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];

  const primaryImage =
    product.images.find((img) => img.is_primary)?.url || product.images[0]?.url;

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return;

    // Set index
    setCurrent(api.selectedScrollSnap());

    // Cập nhật current index
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // click vào thumbnail
  const handleThumbnailClick = (index) => {
    if (!api) return;
    api.scrollTo(index);
  };

  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');

  // Lấy giá trị hiển thị
  const displayPrice = product.sale_price || product.base_price;
  const originalPrice = product.sale_price ? product.base_price : 36000;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Product Section */}
      <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex w-full flex-col gap-6 overflow-hidden">
          {/* Main Image Carousel */}
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={image.image_id}>
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white p-8">
                    <img
                      src={image.url}
                      alt={`${product.product_name} - Hình ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* <div className="hidden sm:block">
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </div> */}
          </Carousel>

          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <Button
                key={image.image_id}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  'border-border rounded-ld flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden border-1 p-2 transition-all',
                  current === index
                    ? 'border-primary border-2 opacity-100'
                    : 'opacity-50 hover:opacity-75',
                )}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <h1 className="text-text-primary mb-4 text-2xl font-bold md:text-3xl">
            {product.product_name}
          </h1>

          <div className="mb-8 flex items-center gap-4">
            <span className="text-text-primary text-3xl font-medium">
              {formatCurrency(displayPrice)}
            </span>
            {originalPrice && (
              <span className="text-text-muted text-xl font-light line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <Button
                  variant={selectedColor === color ? 'primary' : 'secondary'}
                  size="lg"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'px-6 py-5 transition-colors',
                    selectedColor === color ? 'font-semibold' : 'font-medium',
                  )}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <Button
                  variant={selectedSize === size ? 'primary' : 'secondary'}
                  size="lg"
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'px-6 py-5 transition-colors',
                    selectedSize === size ? 'font-semibold' : 'font-medium',
                  )}
                >
                  Size {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-text-muted mb-8 leading-relaxed">
            {product.product_description}
          </p>

          {/* Actions */}
          <div className="mb-10 flex gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="h-12 flex-1 font-medium"
            >
              Thêm vào Wishlist
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="h-12 flex-1 font-medium"
            >
              Thêm vào giỏ hàng
            </Button>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-3 gap-4 py-3">
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
          <ProductGrid products={relatedProducts}></ProductGrid>
        </div>
      )}
    </div>
  );
}
