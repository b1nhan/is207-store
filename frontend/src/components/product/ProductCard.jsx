import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
export const ProductCard = ({ product }) => {
  const productlink = `/products/${product.id || product.slug}`;
  return (
    <div className="group relative flex w-full flex-col items-center justify-center space-y-1 rounded-xl border border-gray-50 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link href={productlink} className="flex w-full flex-col items-center">
        <img
          src={product.thumbnail}
          alt=""
          className="mb-3 aspect-square w-full rounded-lg object-cover"
        />
        <h3 className="text-text-primary line-clamp-2 flex h-12 items-center text-center text-base font-bold">
          {product.product_name}
        </h3>
        <p className="mt-1 text-center font-bold text-blue-600">
          ${product.base_price || product.base_price}
        </p>
        <Button className="relative mx-auto mt-4 flex h-[40px] w-full max-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#2b59ff] text-center text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95">
          Mua ngay
        </Button>
      </Link>
    </div>
  );
};
