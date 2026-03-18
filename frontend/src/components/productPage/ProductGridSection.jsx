'use client';

import { useEffect, useState } from 'react';

function ProductGridSection() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // FIX: Trỏ về Port 8080 của Backend
    fetch('http://localhost:8080/api/v1/brands')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then((json) => {
        // FIX: Data của ông nằm trong json.data.items (theo cấu trúc sendSuccess)
        setBrands(json.data.items || []);
      })
      .catch((error) => console.error('Lỗi fetch brand:', error));
  }, []);

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold">Brands List</h1>
      <ul className="mt-4">
        {brands.map((brand) => (
          <li key={brand.brand_id} className="border-b py-1">
            {brand.brand_name}
            <span className="ml-2 text-gray-500">({brand.product_count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductGridSection;
