'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ProductCard } from '../product/ProductCard';
const ProductSection = ({ newProduct, hotProduct, noibatProduct }) => {
  const [activeTab, setActiveTab] = useState('new');

  {
    /*Tab list nha ae: vd: moi/hot/ban chay*/
  }
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
    <div className="px-4">
      <div className="mx-auto flex justify-center gap-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-1xl ${activeTab == tab.id ? 'text-black underline decoration-2 underline-offset-4' : 'text-gray-600'}`}
          >
            {tab.label}
            {activeTab == tab.id}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-4">
        {currentProduct.map((product) => (
          <div>
            <img src={product.image} alt="" className="" />
            <h3 className="text-2xl">{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductSection;
