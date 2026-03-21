import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products }) => {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-2 justify-center justify-items-center gap-8 md:grid-cols-4">
      {(products || []).map((product, index) => (
        <ProductCard key={product.id || index} product={product} />
      ))}
    </div>
  );
};
