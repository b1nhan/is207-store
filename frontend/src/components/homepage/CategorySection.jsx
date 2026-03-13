'use client';
import './CategorySection.css';
import { useRef } from 'react';
import {
  Smartphone,
  Watch,
  Camera,
  Headphones,
  Monitor,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';

export function CategorySection() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const categories = [
    { name: 'Áo thun', icon: Smartphone },
    { name: 'Áo sơ mi', icon: Watch },
    { name: 'Quần đùi', icon: Camera },
    { name: 'Quần dài', icon: Headphones },
    { name: 'Đồ ngủ', icon: Monitor },
    { name: 'Đồ thể thao', icon: Gamepad2 },
    { name: 'Áo khoác', icon: Smartphone },
    { name: 'Quần jean', icon: Watch },
    { name: 'Áo hoodie', icon: Camera },
    { name: 'Áo polo', icon: Headphones },
    { name: 'Quần short', icon: Monitor },
    { name: 'Áo len', icon: Gamepad2 },
  ];

  return (
    <div className="bg-gray-50 px-16 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-text-secondary text-2xl font-semibold">
          Danh Mục Sản Phẩm
        </h2>

        <div className="flex items-center gap-0">
          <Button
            variant="primary"
            size="lg"
            onClick={scrollLeft}
            className="text-text-secondary p-1 transition hover:opacity-70"
          >
            <ChevronLeft size={38} strokeWidth={1.5} />
          </Button>

          <Button
            variant="ghost"
            size="icon-lg"
            onClick={scrollRight}
            className="text-text-secondary p-1 transition hover:opacity-70"
          >
            <ChevronRight size={38} strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth"
      >
        {categories.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex h-[130px] min-w-[180px] flex-col items-center justify-center rounded-2xl bg-[#dbe5f4] text-slate-700 transition hover:bg-[#cdd9ee]"
            >
              <Icon size={36} strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium text-black">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
