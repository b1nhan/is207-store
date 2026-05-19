'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import adminProductService from '@/services/adminProductService';
import { Button } from '@/components/ui/button';
import ProductFormModal from './_components/ProductFormModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminProductService.getAllProducts();
      const items = response.data.items || [];
      setProducts(items);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setEditProductId(null);
    setModalOpen(true);
  };

  const openEditModal = (productId) => {
    setIsEdit(true);
    setEditProductId(productId);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditProductId(null);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setEditProductId(null);
    fetchProducts();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await adminProductService.updateStatus(id, newStatus);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update status', error);
      alert(error.response?.data?.message || error.message || 'Cập nhật trạng thái thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products Management</h1>
          <Button className="flex items-center space-x-2" onClick={openCreateModal}>
            <Plus size={16} />
            <span>Add Product</span>
          </Button>
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
                  <tr key={product.product_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.product_name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded" />
                      )}
                    </td>
                    <td className="p-4 font-medium">{product.product_name}</td>
                    <td className="p-4">{Number(product.base_price).toLocaleString('vi-VN')}₫</td>
                    <td className="p-4">{product.category?.category_name || 'N/A'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(product.product_id, product.status)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.status === 1
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {product.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(product.product_id)}
                      >
                        <Edit size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {modalOpen && (
        <ProductFormModal
          isEdit={isEdit}
          productId={editProductId}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
}
