'use client';

import React, { useState } from 'react';
import { VariantSelector } from './VariantSelector';
import { QuantityInput } from './QuantityInput';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductActions({ product }) {
  const { variants = [] } = product;
  const [selectedColor, setSelectedColor] = useState(variants[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState(variants[0]?.size || '');
  const [quantity, setQuantity] = useState(1);

  const { addToCart, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Lọc variant hiện tại dựa trên color và size được chọn
  const selectedVariant = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const stock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity || 0;
  const isOutOfStock = stock < 1;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng!');
      router.push('/login');
      return;
    }

    if (isOutOfStock) return;
    if (variants.length > 0 && !selectedVariant) {
      toast.error('Vui lòng chọn phân loại hàng!');
      return;
    }

    if (selectedVariant) {
      const success = await addToCart(selectedVariant.variant_id, quantity);
      if (success) {
        toast.success('Đã thêm vào giỏ hàng');
      } else {
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!');
      }
    } else {
      // In case product has no variants but is added, though backend requires variant_id.
      // Assuming all products have variants based on schema.
      toast.error('Sản phẩm không hợp lệ!');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng!');
      router.push('/login');
      return;
    }

    if (isOutOfStock) return;
    if (variants.length > 0 && !selectedVariant) {
      toast.error('Vui lòng chọn phân loại hàng!');
      return;
    }

    if (selectedVariant) {
      const params = new URLSearchParams({
        type: 'direct',
        productId: product.product_id,
        variantId: selectedVariant.variant_id,
        quantity: quantity
      });
      router.push(`/checkout?${params.toString()}`);
    } else {
      toast.error('Sản phẩm không hợp lệ!');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Variants */}
      {variants.length > 0 && (
        <VariantSelector
          variants={variants}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
        />
      )}

      {/* Quantity & Stock */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-text-primary">Số lượng</span>
        <div className="flex items-center gap-4">
          <QuantityInput
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={stock > 0 ? stock : 1}
          />
          <span className="text-sm text-text-muted">
            {stock > 0 ? `${stock} sản phẩm có sẵn` : 'Hết hàng'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row mt-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 border-primary text-primary hover:bg-primary/5 h-14 text-lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isLoading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
        </Button>
        <Button
          variant="default"
          size="lg"
          className="flex-1 bg-primary hover:bg-primary/90 text-white h-14 text-lg font-bold"
          onClick={handleBuyNow}
          disabled={isOutOfStock || isLoading}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
