'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ProductCard } from '../product/ProductCard';
const ProductSection = ({ newProduct, hotProduct, noibatProduct, giamgia }) => {
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
    <div className="bg-gray-50/30 px-4 py-10">
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
      <div className="mx-auto grid max-w-5xl grid-cols-2 justify-center justify-items-center gap-8 md:grid-cols-4">
        {currentProduct.map((product) => (
          <div className="group relative flex w-full flex-col items-center justify-center space-y-1 rounded-xl border border-gray-50 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex w-full flex-col items-center">
              <img
                src={product.thumbnail}
                alt=""
                className="mb-3 aspect-square w-full rounded-lg object-cover"
              />
              <h3 className="line-clamp-2 flex h-12 items-center text-center text-base font-bold text-black">
                {product.product_name}
              </h3>
              <p className="mt-1 text-center font-bold text-blue-600">
                ${product.base_price}
              </p>
              <button class="relative mx-auto mt-4 flex h-[40px] w-full max-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#2b59ff] text-center text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95">
                Mua ngay
              </button>
            </div>
          </div>
        ))}
      </div>
      <br />
      <div>
        <p className="text-1xl text-center font-bold text-black">
          Đang Giảm Giá
        </p>
        <div className="mx-auto grid max-w-5xl grid-cols-2 justify-center justify-items-center gap-8 md:grid-cols-4">
          {(giamgia || []).map((product, index) => (
            <div
              key={index}
              className="group relative flex w-full flex-col items-center justify-center space-y-1 rounded-xl border border-gray-50 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex w-full flex-col items-center">
                <img
                  src={product.thumbnail}
                  alt=""
                  className="mb-3 aspect-square w-full rounded-lg object-cover"
                />
                <h3 className="line-clamp-2 flex h-12 items-center text-center text-base font-bold text-black">
                  {product.product_name}
                </h3>
                <p className="mt-1 text-center font-bold text-blue-600">
                  ${product.base_priceprice}
                </p>
                <button className="relative mx-auto mt-4 flex h-[40px] w-full max-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#2b59ff] text-center text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95">
                  Mua ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProductSection;
