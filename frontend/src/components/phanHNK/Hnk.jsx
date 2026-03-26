'use client';
import React, { useState } from 'react';
import { ProductGrid } from '../product/ProductGrid';
import { ProductToolbar } from './ProductToolbar';
import { DividePage } from './DividePage';
const Hnk = () => {
  //max 9 sp 1 page nha ôn làn
  const ITEMS_PER_PAGE = 9;

  const mockProducts = Array.from({ length: 20 }).map((_, index) => {
    //random giá
    const price = 20000 + index * 5;

    return {
      product_id: `ao-${index + 1}`,
      product_name: `Áo thun mẫu số ${index + 1}`,
      base_price: price,
      sale_price: index % 3 === 0 ? price - 5 : null,
      thumbnail: `https://picsum.photos/seed/${index + 10}/300/300`,
      slug: `ao-mau-${index + 1}`,
    };
  });
  const [products, setProducts] = useState(mockProducts);
  const [currentPage, setCurrentPage] = useState(1);
  //logic
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (type) => {
    let sortedData = [...products];
    if (type === 'price-asc') {
      sortedData.sort((a, b) => a.base_price - b.base_price);
    } else if (type === 'price-desc') {
      sortedData.sort((a, b) => b.base_price - a.base_price);
    } else {
      sortedData = [...mockProducts];
    }
    setProducts(sortedData);
    setCurrentPage(1);
  };

  return (
    <div className="px-4 py-10">
      <div className="container mx-auto">
        <h1 className="mb-8 text-center text-2xl font-bold">
          Danh sách sản phẩm
        </h1>
        <ProductToolbar
          totalProducts={products.length}
          onFilterChange={handleSort}
        />
        <ProductGrid products={currentProducts} columns={3} />
        <DividePage
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </div>
  );
};
export default Hnk;
