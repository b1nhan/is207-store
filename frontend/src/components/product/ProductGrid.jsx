"use client"
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ProductCard } from './ProductCard';
import { Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ── Stagger variants ───────────────────────────────────────────────────────────
const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
};

export const ProductGrid = ({ products, columns = 4, title, showAllLink = 'Xem tất cả', icon, badge, highlightColor, linkViewAll = '/products' }) => {
  const reduced = useReducedMotion();
  const container = reduced ? {} : gridContainer;
  const item = reduced ? {} : gridItem;

  const gridCols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
  const columnClass = gridCols[columns] || 'grid-cols-4';

  return (
    <div className="relative">
      {title && (
        <div className="mb-6 flex items-center justify-between mx-103">
          <div className="flex items-center gap-2">
            {icon && React.createElement(icon, {
              className: cn('h-5 w-5', highlightColor ? `text-${highlightColor}-500` : ''),
            })}
            <p
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </p>
            {badge && (
              <span
                className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', highlightColor ? `bg-${highlightColor}-100 text-${highlightColor}-600` : '')}
              >
                {badge}
              </span>
            )}
          </div>
          <Link
            href={linkViewAll}
            className="flex items-center gap-1 text-sm font-semibold hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            {showAllLink} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* <div className="bg-primary/10 absolute inset-0 rounded-full blur-3xl scale-80" /> */}
      <div className="absolute inset-0 rounded-full blur-3xl scale-80 opacity-15 bg-[radial-gradient(circle,var(--sa-600)_0%,var(--sa-50)_100%)]" />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className={`mx-auto grid max-w-5xl grid-cols-2 justify-center justify-items-center gap-8 ${columnClass}`}
      >

        {(products || []).map((product, index) => (
          <motion.div key={product.id || index} variants={item} className="w-full flex justify-center">
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
