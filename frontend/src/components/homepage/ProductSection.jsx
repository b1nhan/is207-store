'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ProductGrid } from '../product/ProductGrid';
import { ProductCard } from '../product/ProductCard';
import { ChevronRight, Tag, Loader2, RefreshCw } from 'lucide-react';
import { productService } from '@/services/productService';
import Image from 'next/image';

// ── Variants ───────────────────────────────────────────────────────────────────
const sectionFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * ProductSection
 * Props:
 *   initialNewArrivals – array of product objects
 *   discountedItems    – array of { ... } từ API
 */
const ProductSection = ({ initialNewArrivals = [], discountedItems = [] }) => {
  const reduced = useReducedMotion();
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

  const handleRetry = () => fetchTabData(activeTab);

  const renderContent = () => {
    const current = tabData[activeTab];

    if (current.loading) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--primary)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Đang tải sản phẩm...</p>
        </div>
      );
    }

    if (current.error) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <p style={{ color: 'var(--error)' }}>{current.error}</p>
          <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Thử lại
          </Button>
        </div>
      );
    }

    if (!current.data || current.data.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p style={{ color: 'var(--text-muted)' }}>Không có sản phẩm nào</p>
        </div>
      );
    }

    return <ProductGrid products={current.data} title="Sản phẩm nổi bật" />;
  };

  return (
    <motion.div
      variants={reduced ? {} : sectionFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="px-4 py-10"
    >

      {/* Tab list */}
      <div className="mx-auto flex justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative text-lg font-semibold transition-colors pb-1"
            style={{
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {tab.label}
            {/* Gradient underline for active tab */}
            {activeTab === tab.id && (
              <motion.span
                layoutId="tab-underline"
                className="absolute -bottom-0.5 left-0 h-[2.5px] w-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--sa-500), var(--sa-700))' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid Sản phẩm theo Tab */}
      {renderContent()}

      <br />

      {/* Phần Giảm Giá */}
      {discountedItems.length > 0 && (
        <div className="mt-8">

          <ProductGrid
            products={discountedItems}
            title="Đang Giảm Giá"
            icon={Tag}
            badge={discountedItems.length + ' sản phẩm'}
            highlightColor="red"
            linkViewAll='/campaigns'
          />
        </div>
      )}
    </motion.div>
  );
};

export default ProductSection;
