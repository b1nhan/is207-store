'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ProductGrid } from '../product/ProductGrid';

const ProductSection = ({ newProduct, hotProduct, noibatProduct, giamgia }) => {
  const [activeTab, setActiveTab] = useState('new');

  const tabs = [
    { id: 'new', label: 'Sản phẩm mới' },
    { id: 'hot', label: 'Bán chạy' },
    { id: 'noibat', label: 'Sản phẩm nổi bật' },
  ];

  const getActiveData = () => {
    if (activeTab == 'new') return newProduct || [];
    if (activeTab == 'hot') return hotProduct || [];
    if (activeTab == 'noibat') return noibatProduct || [];
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
            className={`text-1xl ${activeTab == tab.id ? 'text-black underline decoration-2 underline-offset-4' : 'text-gray-600'}`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* (1) Phần Grid Sản phẩm theo Tab */}
      <ProductGrid products={currentProduct} />

      <br />

      {/* (2) Phần Giảm Giá */}
      <div>
        <p className="text-1xl mb-8 text-center font-bold text-black">
          Đang Giảm Giá
        </p>
        <ProductGrid products={giamgia} />
      </div>
    </div>
  );
};

export default ProductSection;
