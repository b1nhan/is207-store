'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

export default function ProductFilter({ categories, has_categories = true, has_price = true, has_sort = true }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Mobile filter toggle
  const [isOpen, setIsOpen] = useState(false);

  // States for filters
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const currentCategory = searchParams.get('category') || '';
    const currentMinPrice = searchParams.get('minPrice') || '';
    const currentMaxPrice = searchParams.get('maxPrice') || '';
    const currentSort = searchParams.get('sort') || 'newest';

    // ✅ Chỉ push nếu thực sự có thay đổi
    const hasChanged =
      currentCategory !== selectedCategory ||
      currentMinPrice !== debouncedMinPrice ||
      currentMaxPrice !== debouncedMaxPrice ||
      currentSort !== sort;

    if (!hasChanged) return; // ← Chặn loop ở đây

    if (params.get('page')) params.set('page', '1');

    if (selectedCategory) params.set('category', selectedCategory);
    else params.delete('category');

    if (debouncedMinPrice) params.set('minPrice', debouncedMinPrice);
    else params.delete('minPrice');

    if (debouncedMaxPrice) params.set('maxPrice', debouncedMaxPrice);
    else params.delete('maxPrice');

    if (sort) params.set('sort', sort);
    else params.delete('sort');

    router.push(`${pathname}?${params.toString()}`);
  }, [selectedCategory, debouncedMinPrice, debouncedMaxPrice, sort, router, searchParams, pathname]);
  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  return (
    <>
      {/* Mobile Toggle */}
      {(has_categories || has_price || has_sort) && (
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Filter size={18} />
            {isOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </Button>
        </div>)}

      {/* Filter Sidebar */}
      {has_categories || has_price || has_sort ? (
        <div className={`space-y-8 ${isOpen ? 'block' : 'hidden'} md:block`}>
          {/* Sort */}
          {has_sort && (<div>
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Sắp xếp</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
            </select>
          </div>)}

          {/* Categories */}
          {has_categories && (<div>
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Danh mục</h3>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-text-secondary hover:text-primary">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="h-4 w-4 accent-primary"
                />
                <span>Tất cả</span>
              </label>
              {(categories || []).map((cat) => (
                <label
                  key={cat.category_id || cat.slug}
                  className="flex cursor-pointer items-center gap-2 text-text-secondary hover:text-primary"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.slug || cat.category_id}
                    checked={selectedCategory === (cat.slug || cat.category_id?.toString())}
                    onChange={() => setSelectedCategory(cat.slug || cat.category_id?.toString())}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{cat.category_name || cat.name}</span>
                </label>
              ))}
            </div>
          </div>)}

          {/* Price Range */}
          {has_price && (<div>
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Khoảng giá</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>)}

          {/* Clear Filters */}
          {has_categories || has_price ? (<Button
            variant="outline"
            className="w-full text-text-muted hover:text-error"
            onClick={clearFilters}
          >
            <X size={16} className="mr-2" />
            Xóa bộ lọc
          </Button>) : null}
        </div>
      ) : null}
    </>
  );
}
