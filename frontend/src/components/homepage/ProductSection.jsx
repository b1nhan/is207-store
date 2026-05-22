'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ProductGrid } from '../product/ProductGrid';
import { ProductCard } from '../product/ProductCard';
import { ChevronRight, Tag } from 'lucide-react';

/**
 * ProductSection
 * Props:
 *   newProduct      – array of product objects
 *   hotProduct      – array of product objects
 *   noibatProduct   – array of product objects
 *   discountedItems – array of { product_id, product_name, base_price, thumbnail,
 *                                campaign_id, discount: { type, value }, end_date }
 *                     từ API /campaigns/discounted-products
 */
const ProductSection = ({ newProduct, hotProduct, noibatProduct, discountedItems = [] }) => {
  const [activeTab, setActiveTab] = useState('new');

  const tabs = [
    { id: 'new',    label: 'Sản phẩm mới' },
    { id: 'hot',    label: 'Bán chạy' },
    { id: 'noibat', label: 'Sản phẩm nổi bật' },
  ];

  const getActiveData = () => {
    if (activeTab === 'new')    return newProduct    || [];
    if (activeTab === 'hot')    return hotProduct    || [];
    if (activeTab === 'noibat') return noibatProduct || [];
    return [];
  };

  const currentProduct = getActiveData();

  return (
    <div className="bg-gray-50/30 px-4 py-10">
      {/* Tab list */}
      <div className="mx-auto flex justify-center gap-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-1xl ${activeTab === tab.id ? 'text-black underline decoration-2 underline-offset-4' : 'text-gray-600'}`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* (1) Phần Grid Sản phẩm theo Tab */}
      <ProductGrid products={currentProduct} />

      <br />

      {/* (2) Phần Giảm Giá – từ campaign thực tế */}
      {discountedItems.length > 0 && (
        <div className="mt-4">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-rose-500" />
              <p className="text-xl font-bold text-black">Đang Giảm Giá</p>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
                {discountedItems.length} sản phẩm
              </span>
            </div>
            <Link
              href="/campaigns"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Grid – dùng ProductCard trực tiếp để truyền discount */}
          <div className="mx-auto grid max-w-5xl grid-cols-2 justify-center justify-items-center gap-8 md:grid-cols-4">
            {discountedItems.map((item) => (
              <ProductCard
                key={item.product_id}
                product={item}
                discount={item.discount}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
