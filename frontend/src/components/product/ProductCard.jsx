import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currency';
import { Button } from '@/components/ui/button';

export const ProductCard = ({ product }) => {
  const productlink = `/products/${product.product_id || product.slug}`;
  const displayPrice = product.sale_price || product.base_price;

  return (
    <div className="group relative mx-auto flex w-full max-w-[280px] flex-col items-center justify-center space-y-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <Link href={productlink} className="flex w-full flex-col items-center">
        <img
          src={product.thumbnail || product.images?.[0]?.url}
          alt={product.product_name}
          className="mb-3 aspect-square w-full rounded-lg object-cover"
        />
        <h3 className="text-text-primary line-clamp-2 flex h-12 items-center text-center text-base font-bold">
          {product.product_name}
        </h3>
        <p className="text-primary mt-1 text-center font-bold">
          {formatCurrency(displayPrice)}
        </p>

        {/* Đổi Button thành div để tránh lỗi lồng thẻ button trong thẻ a */}
        {/* <div className="bg-primary hover:bg-hover relative mx-auto mt-4 flex h-[40px] w-full max-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg text-center text-sm font-semibold text-white transition-all active:scale-95">
          Mua ngay
        </div> */}
        <Button variant="primary" size="xl">
          Mua ngay
        </Button>
      </Link>
    </div>
  );
};
