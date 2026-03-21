'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export function QuantityInput({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  className,
}) {
  // inputValue là string riêng để cho phép gõ tự do (vd: xoá hết trước khi gõ số mới)
  const [inputValue, setInputValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  const handleDecrement = () => {
    const next = Math.max(min, value - 1);
    onChange(next);
    setInputValue(String(next));
  };

  const handleIncrement = () => {
    const next = Math.min(max, value + 1);
    onChange(next);
    setInputValue(String(next));
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    // Chỉ cho phép gõ chữ số
    if (!/^\d*$/.test(raw)) return;
    setInputValue(raw);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseInt(inputValue, 10);

    if (isNaN(parsed) || parsed < min) {
      // Giá trị không hợp lệ → reset về min
      onChange(min);
      setInputValue(String(min));
    } else if (parsed > max) {
      // Vượt max → clamp về max
      onChange(max);
      setInputValue(String(max));
    } else {
      onChange(parsed);
      setInputValue(String(parsed));
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    e.target.select(); // Bôi đen toàn bộ khi focus để gõ đè luôn
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  // Khi không focus, luôn hiển thị value thực từ prop
  const displayValue = isFocused ? inputValue : String(value);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="secondary"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-10 w-10 flex-shrink-0 rounded-lg"
        aria-label="Giảm số lượng"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label="Số lượng"
        className={cn(
          'text-text-primary w-12 rounded-lg border px-1 py-2 text-center text-base font-medium tabular-nums transition-colors outline-none',
          'border-border bg-transparent',
          'focus:border-primary focus:ring-primary/20 focus:ring-2',
        )}
      />

      <Button
        variant="secondary"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-10 w-10 flex-shrink-0 rounded-lg"
        aria-label="Tăng số lượng"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
