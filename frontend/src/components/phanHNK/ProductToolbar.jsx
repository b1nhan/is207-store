import React from 'react';
import { ChevronDown } from 'lucide-react';

export const ProductToolbar = ({ totalProducts, onFilterChange }) => {
  return (
    <div className="mb-10 flex items-center justify-between border-b pb-6">
      {/* 1. Bên trái: Số lượng */}
      <div className="font-medium text-gray-500">
        Số lượng sản phẩm:{' '}
        <span className="ml-2 text-2xl font-bold text-slate-800">
          {totalProducts}
        </span>
      </div>
      {/* 3. Bên phải: Sắp xếp */}
      <div className="relative">
        <select
          onChange={(e) => onFilterChange(e.target.value)}
          className="appearance-none rounded-2xl border border-gray-100 bg-white px-6 py-3 pr-10 text-sm font-bold text-slate-700 shadow-sm outline-none hover:border-gray-200"
        >
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};
