'use client';

import React, { useState } from 'react';
import { productService } from '@/services/productService';
import useCartStore from '@/store/cartStore';
import { ChevronDown, X, Check, AlertCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

export function CartItemVariantSelector({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedColor, setSelectedColor] = useState(item.color);
  const [selectedSize, setSelectedSize] = useState(item.size);

  const { updateVariant } = useCartStore();

  const hasChanged =
    selectedColor !== item.color || selectedSize !== item.size;

  const toggleOpen = async () => {
    if (!isOpen && variants.length === 0) {
      setLoadingVariants(true);
      try {
        const res = await productService.getProduct(item.product_id);
        const data = res.data || res;
        setVariants(data.variants || []);
      } catch (error) {
        console.error(error);
        toast.error('Không thể tải thông tin biến thể');
      } finally {
        setLoadingVariants(false);
      }
    }
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset về giá trị ban đầu khi đóng mà chưa lưu
    setSelectedColor(item.color);
    setSelectedSize(item.size);
  };

  const selectedVariant = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const isSaveDisabled =
    !hasChanged ||
    !selectedVariant ||
    selectedVariant.stock_quantity < item.quantity;

  const getVariantForColorSize = (color, size) =>
    variants.find((v) => v.color === color && v.size === size);

  const isSizeDisabled = (size) => {
    const variant = getVariantForColorSize(selectedColor, size);
    return !variant || variant.stock_quantity < item.quantity;
  };

  const isColorDisabled = (color) => {
    // Color bị disable nếu tất cả size của color đó đều hết hàng
    const colorVariants = variants.filter((v) => v.color === color);
    return colorVariants.every((v) => v.stock_quantity < item.quantity);
  };

  const colors = [...new Set(variants.map((v) => v.color))];
  const sizes = [...new Set(variants.map((v) => v.size))];

  const handleConfirm = async () => {
    if (!selectedVariant) {
      toast.error('Vui lòng chọn phân loại hợp lệ');
      return;
    }
    if (selectedVariant.variant_id === item.variant_id) {
      setIsOpen(false);
      return;
    }
    if (selectedVariant.stock_quantity < item.quantity) {
      toast.error('Không đủ số lượng trong kho cho phân loại này');
      return;
    }

    setIsSaving(true);
    try {
      await updateVariant(item.cart_item_id, selectedVariant.variant_id, item.quantity);
      setIsOpen(false);
    } catch (e) {
      // Error handled in store
    } finally {
      setIsSaving(false);
    }
  };

  // Stock badge helper
  const getStockBadge = () => {
    if (!selectedVariant) return null;
    const stock = selectedVariant.stock_quantity;
    if (stock < item.quantity) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
          <AlertCircle size={11} />
          Hết hàng
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="text-xs text-amber-500 font-medium">
          Còn {stock} sản phẩm
        </span>
      );
    }
    return null;
  };

  const formatSize = (size) =>
    size.toLowerCase().includes('size') ? size : `Size ${size}`;

  return (
    <div className="relative inline-block mt-1">
      {/* Trigger */}
      <button
        onClick={toggleOpen}
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-all',
          'bg-secondary/60 border-border text-foreground/80',
          'hover:bg-secondary hover:border-foreground/20 hover:text-foreground',
          isOpen && 'bg-secondary border-foreground/20 text-foreground'
        )}
      >
        <span>{item.color}</span>
        <span className="text-foreground">·</span>
        <span>{formatSize(item.size)}</span>
        <ChevronDown
          size={12}
          className={cn('text-foreground/40 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={handleClose} />

          {/* Dropdown Panel */}
          <div
            className={cn(
              'absolute top-full left-0 mt-2 z-50',
              'w-[300px] bg-white border border-border/60 rounded-xl shadow-xl shadow-black/8',
              'animate-in fade-in-0 slide-in-from-top-1 duration-150'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <span className="text-sm font-semibold text-foreground">Chọn phân loại</span>
              <div className="flex items-center gap-1">
                {/* Save button */}
                <button
                  onClick={handleConfirm}
                  disabled={isSaveDisabled || isSaving || loadingVariants}
                  title="Lưu thay đổi"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-normal rounded-md transition-all',
                    isSaveDisabled || isSaving || loadingVariants
                      ? 'text-foreground/25 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20 active:scale-95'
                  )}
                >
                  {isSaving ? (
                    <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? 'Đang lưu...' : ''}
                </button>
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="p-1 px-2.5 py-2 rounded-md text-foreground/40 hover:text-foreground hover:bg-secondary transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {loadingVariants ? (
                <div className="flex items-center justify-center py-6 gap-2 text-sm text-foreground/50">
                  <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Đang tải...
                </div>
              ) : (
                <>
                  {/* Colors */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Màu sắc
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {colors.map((color) => {
                        const disabled = isColorDisabled(color);
                        const active = selectedColor === color;
                        return (
                          <button
                            key={color}
                            onClick={() => !disabled && setSelectedColor(color)}
                            disabled={disabled}
                            className={cn(
                              'px-3 py-1.5 text-sm rounded-lg border transition-all',
                              disabled
                                ? 'border-border/40 text-foreground/25 bg-secondary/30 cursor-not-allowed'
                                : active
                                  ? 'border-primary bg-primary text-white shadow-sm shadow-primary/25'
                                  : 'border-border bg-secondary/50 text-foreground/70 hover:border-foreground/25 hover:text-foreground hover:bg-secondary'
                            )}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                      Kích thước
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sizes.map((size) => {
                        const disabled = isSizeDisabled(size);
                        const active = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => !disabled && setSelectedSize(size)}
                            disabled={disabled}
                            title={disabled ? 'Không đủ số lượng' : undefined}
                            className={cn(
                              'px-3 py-1.5 text-sm rounded-lg border transition-all relative',
                              disabled
                                ? 'border-border/40 text-foreground/25 bg-secondary/30 cursor-not-allowed'
                                : active
                                  ? 'border-primary bg-primary text-white shadow-sm shadow-primary/25'
                                  : 'border-border bg-secondary/50 text-foreground/70 hover:border-foreground/25 hover:text-foreground hover:bg-secondary'
                            )}
                          >
                            {formatSize(size)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stock notice */}
                  {getStockBadge() && (
                    <div className="pt-0.5">
                      {getStockBadge()}
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}