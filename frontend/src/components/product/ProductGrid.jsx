import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products, columns = 4 }) => {
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
    <div
      className={`mx-auto grid max-w-5xl grid-cols-2 justify-center justify-items-center gap-8 ${columnClass}`}
    >
      {(products || []).map((product, index) => (
        <ProductCard key={product.id || index} product={product} />
      ))}
    </div>
  );
};
