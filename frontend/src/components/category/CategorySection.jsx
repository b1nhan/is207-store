// CategorySection.jsx
'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Shirt, Tag, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';

const SCROLL_AMOUNT = 300;

const ICON_MAP = {
  Áo: Shirt,
  Váy: ShoppingBag,
};

const DEFAULT_ICON = Tag;

// ── Stagger variants ───────────────────────────────────────────────────────────
const chipContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const chipItem = {
  hidden: { opacity: 0, y: 14, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
};

// ── Category chip with spring hover ───────────────────────────────────────────
function CategoryChip({ item, isGrid }) {
  const reduced = useReducedMotion();
  const Icon =
    Object.entries(ICON_MAP).find(([key]) =>
      item.category_name?.toLowerCase().includes(key.toLowerCase()),
    )?.[1] ?? DEFAULT_ICON;
  const slug = item.slug || item.category_id;

  return (
    <motion.div
      variants={chipItem}
      transition={{ type: 'spring', stiffness: 340, damping: 22 }}
    >
      <Link
        href={`/category/${slug}`}
        className={`flex h-[128px] ${!isGrid ? 'min-w-[160px]' : ''} cursor-pointer flex-col items-center justify-center gap-2 rounded-[15px] px-6 py-6 text-center transition-colors duration-200`}
        style={{
          background: 'var(--secondary)',
          border: '1.5px solid var(--sa-200)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, var(--sa-100), var(--sa-200))';
          e.currentTarget.style.borderColor = 'var(--sa-400)';
        }}
        onMouseLeave={(e) => {
          // e.currentTarget.style.background = 'var(--secondary)';
          e.currentTarget.style.borderColor = 'var(--sa-200)';
        }}
      >
        <Icon size={32} strokeWidth={1.8} style={{ color: 'var(--sa-700)' }} />
        <p
          className="text-[16px] leading-6 font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {item.category_name}
        </p>
      </Link>
    </motion.div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function CategorySection({ categories, isGrid = false, hideHeader = false }) {
  const scrollRef = useRef(null);
  const reduced = useReducedMotion();

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  const sectionHeader = !hideHeader && (
    <div className="mb-8 flex items-center justify-between">
      <h2 className="text-2xl font-medium" style={{ color: 'var(--text-primary)' }}>
        Danh Mục Sản Phẩm
      </h2>
      {!isGrid && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => scroll('left')}
            className="h-8 w-8 min-w-8 p-0"
            style={{ color: 'var(--text-primary)' }}
          >
            <ChevronLeft size={34} strokeWidth={2.4} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => scroll('right')}
            className="h-8 w-8 min-w-8 p-0"
            style={{ color: 'var(--text-primary)' }}
          >
            <ChevronRight size={34} strokeWidth={2.4} />
          </Button>
        </div>
      )}
    </div>
  );

  if (!categories || categories.length === 0) {
    return (
      <section className={isGrid ? 'py-4' : 'py-10'}>
        <div className={isGrid ? 'w-full' : 'px-12'}>
          {sectionHeader}
          <div className="flex h-32 items-center justify-center">
            <p style={{ color: 'var(--text-muted)' }}>Chưa có danh mục nào</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={isGrid ? 'py-4' : 'py-10'}>
      <div className={isGrid ? 'w-full' : 'px-12'}>
        {sectionHeader}

        <motion.div
          ref={!isGrid ? scrollRef : null}
          variants={reduced ? {} : chipContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className={
            isGrid
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'
              : 'no-scrollbar flex gap-8 overflow-x-auto scroll-smooth'
          }
        >
          {categories.map((item) => (
            <CategoryChip key={item.category_id} item={item} isGrid={isGrid} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
