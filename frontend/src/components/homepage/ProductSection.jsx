'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ProductGrid } from '../product/ProductGrid';
import { ProductCard } from '../product/ProductCard';
import { ChevronRight, Tag, Loader2, RefreshCw } from 'lucide-react';
import { productService } from '@/services/productService';

/**
 * ProductSection
 * Props:
 *   initialNewArrivals – array of product objects
 *   discountedItems    – array of { ... } từ API
 */
const ProductSection = ({ initialNewArrivals = [], discountedItems = [] }) => {
  const [activeTab, setActiveTab] = useState('new');

  const [tabData, setTabData] = useState({
    new: { data: initialNewArrivals, loading: false, error: null, loaded: true },
    hot: { data: [], loading: false, error: null, loaded: false },
    bestSellers: { data: [], loading: false, error: null, loaded: false },
  });

  const tabs = [
    { id: 'new', label: 'Hàng mới về' },
    { id: 'bestSellers', label: 'Bán chạy nhất' },
    { id: 'hot', label: 'Đang hot' },
  ];

  const fetchTabData = useCallback(async (tabId) => {
    if (tabData[tabId].loaded && !tabData[tabId].error) return;

    setTabData((prev) => ({
      ...prev,
      [tabId]: { ...prev[tabId], loading: true, error: null },
    }));

    try {
      let res;
      if (tabId === 'new') res = await productService.getNewArrivals(8);
      else if (tabId === 'bestSellers') res = await productService.getBestSellers(8);
      else if (tabId === 'hot') res = await productService.getHotProducts(8);

      setTabData((prev) => ({
        ...prev,
        [tabId]: { data: res.data || [], loading: false, error: null, loaded: true },
      }));
    } catch (error) {
      console.error(`Error fetching ${tabId} products:`, error);
      setTabData((prev) => ({
        ...prev,
        [tabId]: { ...prev[tabId], loading: false, error: 'Không thể tải dữ liệu.' },
      }));
    }
  }, [tabData]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const handleRetry = () => {
    fetchTabData(activeTab);
  };

  const renderContent = () => {
    const current = tabData[activeTab];

    if (current.loading) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500">Đang tải sản phẩm...</p>
        </div>
      );
    }

    if (current.error) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <p className="text-red-500">{current.error}</p>
          <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Thử lại
          </Button>
        </div>
      );
    }

    if (!current.data || current.data.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Không có sản phẩm nào</p>
        </div>
      );
    }

    return <ProductGrid products={current.data} />;
  };

  return (
    <div className="bg-gray-50/30 px-4 py-10">
      {/* Tab list */}
      <div className="mx-auto flex justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => setActiveTab(tab.id)}
            className={`text-lg font-semibold hover:bg-transparent hover:text-black ${activeTab === tab.id
              ? 'text-black underline decoration-2 underline-offset-8'
              : 'text-gray-500'
              }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Grid Sản phẩm theo Tab */}
      {renderContent()}

      <br />

      {/* Phần Giảm Giá */}
      {discountedItems.length > 0 && (
        <div className="mt-8">
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
