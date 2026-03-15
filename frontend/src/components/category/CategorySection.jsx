// CategorySection.jsx
'use client';

import { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shirt,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '../ui/button';

const SCROLL_AMOUNT = 300;

const ICON_MAP = {
  // Quần: StretchHorizontal,
  Áo: Shirt,
  Váy: ShoppingBag,
};

const DEFAULT_ICON = Tag;

export function CategorySection({ categories }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-background py-10">
      <div className="mx-auto max-w-[1440px] px-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-text-primary text-2xl font-medium">
            Danh Mục Sản Phẩm
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => scroll('left')}
              className="text-text-primary hover:text-text-primary h-8 w-8 min-w-8 p-0 hover:bg-transparent"
            >
              <ChevronLeft size={34} strokeWidth={2.4} />
            </Button>
            <Button
              variant="ghost"
              onClick={() => scroll('right')}
              className="text-text-primary hover:text-text-primary h-8 w-8 min-w-8 p-0 hover:bg-transparent"
            >
              <ChevronRight size={34} strokeWidth={2.4} />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-8 overflow-x-auto scroll-smooth"
        >
          {categories.map((item) => {
            const Icon =
              Object.entries(ICON_MAP).find(([key]) =>
                item.category_name.toLowerCase().includes(key.toLowerCase()),
              )?.[1] ?? DEFAULT_ICON;
            return (
              <div
                key={item.category_id}
                className="bg-secondary hover:bg-cb-200 flex h-[128px] min-w-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[15px] px-6 py-6 text-center transition"
              >
                <Icon
                  size={32}
                  strokeWidth={1.8}
                  className="text-text-primary"
                />
                <p className="text-text-primary text-[16px] leading-6 font-medium">
                  {item.category_name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
