'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export function VariantSelector({
  variants,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}) {
  const colors = [...new Set(variants.map((v) => v.color))];
  const sizes = [...new Set(variants.map((v) => v.size))];

  return (
    <>
      {/* Colors */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <Button
              variant={selectedColor === color ? 'primary' : 'secondary'}
              size="lg"
              key={color}
              onClick={() => onColorChange(color)}
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
              onClick={() => onSizeChange(size)}
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
    </>
  );
}
