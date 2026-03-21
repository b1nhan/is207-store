'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../constants/mockdata';

export default function ProductFilter() {
  const [openCategory, setOpenCategory] = useState(true);
  const [keyword, setKeyword] = useState('');

  const brands = [...new Set(MOCK_PRODUCTS.map((p) => p.brand.name))];

  const categories = MOCK_CATEGORIES.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <div className="bg-background w-[400px] rounded-xl p-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-text-primary text-lg font-medium">Danh mục</h3>

          <button onClick={() => setOpenCategory(!openCategory)}>
            {openCategory ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        <div className="bg-border mb-4 h-px" />

        {openCategory && (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3">
              <Search size={20} />
              <input
                placeholder="Tìm kiếm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <div className="space-y-3">
              {categories.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-text-primary">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-text-primary mb-4 text-lg font-medium">Brand</h3>

        <div className="space-y-3">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-text-primary">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
