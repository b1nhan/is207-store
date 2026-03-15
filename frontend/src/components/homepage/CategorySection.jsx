'use client';
import './CategorySection.css';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { MOCK_CATEGORIES } from '../../constants/mockdata';

export function CategorySection() {
  const scrollRef = useRef(null);

  const SCROLL_AMOUNT = 300;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: SCROLL_AMOUNT,
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
              onClick={scrollLeft}
              className="text-text-primary hover:text-text-primary h-8 w-8 min-w-8 p-0 hover:bg-transparent"
            >
              <ChevronLeft size={34} strokeWidth={2.4} />
            </Button>

            <Button
              variant="ghost"
              onClick={scrollRight}
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
          {MOCK_CATEGORIES.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="bg-secondary hover:bg-cb-200 flex h-[128px] min-w-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[15px] px-6 py-6 text-center transition"
              >
                <Icon
                  size={32}
                  strokeWidth={1.8}
                  className="text-text-primary"
                />

                <p className="text-text-primary text-[16px] leading-6 font-medium">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
