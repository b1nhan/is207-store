'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import adminProductService from '@/services/adminProductService';
import { Button } from '@/components/ui/button';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminProductService.getAllProducts();
      const items = response.data.items || [];
      console.log(response, items)
      setProducts(items);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminProductService.updateStatus(id, newStatus);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Link href="/admin/products/new">
          <Button className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">Image</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.product_id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={product.product_name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{product.product_name}</td>
                  <td className="p-4">{Number(product.base_price).toLocaleString('vi-VN')}₫</td>
                  <td className="p-4">{product.category?.category_name || 'N/A'}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(product.product_id, product.status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 1
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {product.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/products/${product.product_id}`}>
                      <Button variant="outline" size="icon">
                        <Edit size={16} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
