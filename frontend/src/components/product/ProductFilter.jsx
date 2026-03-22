'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';

export default function ProductFilter() {
  const [openCategory, setOpenCategory] = useState(true);
  const [openBrand, setOpenBrand] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [brandkeyword, setBrandKeyword] = useState('');
  const [categoriesData, setCategoriesData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.getCategories();
        console.log('API response:', data);
        setCategoriesData(data.items || []);
      } catch (error) {
        console.error('Lỗi call API categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await brandService.getBrand();
        console.log('API response:', data);
        setBrandsData(data.items || []);
      } catch (error) {
        console.error('Lỗi call API brands:', error);
      }
    };

    fetchBrands();
  }, []);

  const filteredCategories = categoriesData.filter((item) =>
    item.category_name?.toLowerCase().includes(keyword.trim().toLowerCase()),
  );

  const filteredBrands = brandsData.filter((item) =>
    item.brand_name?.toLowerCase().includes(brandkeyword.trim().toLowerCase()),
  );

  const handleToggleCategory = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const handleToggleBrand = (name) => {
    setSelectedBrands((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  return (
    <div className="bg-background w-[400px] rounded-xl p-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-text-primary text-lg font-medium">Danh mục</h3>

          <button
            onClick={() => setOpenCategory(!openCategory)}
            className="text-text-primary"
          >
            {openCategory ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        <div className="bg-border mb-4 h-px" />

        {openCategory && (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3">
              <Search size={20} className="text-primary" />
              <input
                placeholder="Tìm kiếm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="text-text-primary placeholder:text-text-muted w-full outline-none"
              />
            </div>

            <div className="space-y-3">
              {filteredCategories.map((item) => {
                const checked = selectedCategories.includes(item.category_name);

                return (
                  <button
                    key={item.category_name}
                    type="button"
                    onClick={() => handleToggleCategory(item.category_name)}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-[6px] border ${
                        checked
                          ? 'border-text-primary bg-text-primary text-white'
                          : 'border-text-primary bg-transparent text-transparent'
                      }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </span>

                    <span className="text-text-primary">
                      {item.category_name}
                    </span>

                    <span className="text-text-muted">
                      {item.product_count ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="mt-8" />

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-text-primary text-lg font-medium">Brand</h3>

        <button
          onClick={() => setOpenBrand(!openBrand)}
          className="text-text-primary"
        >
          {openBrand ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      <div className="bg-border mb-4 h-px" />

      {openBrand && (
        <>
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3">
            <Search size={20} className="text-primary" />
            <input
              placeholder="Tìm kiếm"
              value={brandkeyword}
              onChange={(e) => setBrandKeyword(e.target.value)}
              className="text-text-primary placeholder:text-text-muted w-full outline-none"
            />
          </div>

          <div className="space-y-3">
            {filteredBrands.map((item) => {
              const checked = selectedBrands.includes(item.brand_name);

              return (
                <button
                  key={item.brand_name}
                  type="button"
                  onClick={() => handleToggleBrand(item.brand_name)}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-[6px] border ${
                      checked
                        ? 'border-text-primary bg-text-primary text-white'
                        : 'border-text-primary bg-transparent text-transparent'
                    }`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>

                  <span className="text-text-primary">{item.brand_name}</span>

                  <span className="text-text-muted">
                    {item.product_count ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
