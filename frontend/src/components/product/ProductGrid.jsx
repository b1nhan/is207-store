import React from 'react';
import { ProductCard } from './ProductCard';
import { Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const ProductGrid = ({ products, columns = 4, title, showAllLink = "Xem tất cả", icon, badge, highlightColor }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };
  //ko truyen mac dinh la 4
  const columnClass = gridCols[columns] || 'grid-cols-4';
  return (
    <>
      {title && (<div className="mb-6 flex items-center justify-between mx-103">
        <div className="flex items-center gap-2">
          {icon && React.createElement(icon, { className: cn("h-5 w-5", highlightColor ? `text-${highlightColor}-500` : "") })}
          <p className="text-xl font-bold text-black">{title}</p>
          {badge && <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", highlightColor ? `bg-${highlightColor}-100 text-${highlightColor}-600` : "")}>
            {badge}
          </span>}
        </div>
        <Link
          href="/campaigns"
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {showAllLink} <ChevronRight className="h-4 w-4" />
        </Link>
      </div>)}
      <div
        className={`mx-auto grid max-w-5xl grid-cols-2 justify-center justify-items-center gap-8 ${columnClass}`}
      >

        {(products || []).map((product, index) => (
          <ProductCard key={product.id || index} product={product} />
        ))}
      </div>
    </>

  );
};
