'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { productService } from '@/services/productService';
import { VariantSelector } from '@/components/product/VariantSelector';
import useCartStore from '@/store/cartStore';
import { ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';

export function CartItemVariantSelector({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState(item.color);
  const [selectedSize, setSelectedSize] = useState(item.size);

  const { updateVariant } = useCartStore();

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
    setIsOpen(!isOpen);
  };

  const handleConfirm = async () => {
    const variant = variants.find(v => v.color === selectedColor && v.size === selectedSize);
    if (!variant) {
      toast.error('Vui lòng chọn phân loại hợp lệ');
      return;
    }
    
    if (variant.variant_id === item.variant_id) {
      setIsOpen(false);
      return; // No change
    }

    if (variant.stock_quantity < item.quantity) {
      toast.error('Không đủ số lượng trong kho cho phân loại này');
      return;
    }

    try {
      await updateVariant(item.cart_item_id, variant.variant_id, item.quantity);
      setIsOpen(false);
    } catch (e) {
      // Error handled in store
    }
  };

  return (
    <div className="relative inline-block mt-1">
      <button 
        onClick={toggleOpen}
        className="flex items-center gap-1 text-sm bg-secondary px-2 py-1 rounded hover:bg-secondary/80 transition"
      >
        <span>Phân loại: <span className="font-medium">{item.color}</span> - <span className="font-medium">{item.size}</span></span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 p-4 bg-white shadow-lg border border-border rounded-xl z-50 w-[320px] max-h-[400px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">Đổi phân loại</h4>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            
            {loadingVariants ? (
              <div className="py-4 text-center text-sm text-gray-500">Đang tải...</div>
            ) : (
              <>
                <div className="scale-[0.85] origin-top-left w-[117%]">
                  <VariantSelector
                    variants={variants}
                    selectedColor={selectedColor}
                    selectedSize={selectedSize}
                    onColorChange={setSelectedColor}
                    onSizeChange={setSelectedSize}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Hủy</Button>
                  <Button size="sm" onClick={handleConfirm}>Xác nhận</Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
