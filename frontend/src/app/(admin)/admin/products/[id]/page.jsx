'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import adminProductService from '@/services/adminProductService';
import { Button } from '@/components/ui/button';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Backend updateProductSchema (partial of createProductSchema):
  // product_name, product_description, material, gender, base_price, brand_id, category_id, slug
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    material: '',
    gender: 'unisex',
    base_price: '',
    slug: '',
    category_id: '',
    brand_id: '',
  });
  const [originalProduct, setOriginalProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await adminProductService.getProductById(id);
      // Axios interceptor: response = JSON body { success, data }
      // data = formatted product object
      const product = response.data;
      setOriginalProduct(product);

      setFormData({
        product_name: product.product_name || '',
        product_description: product.product_description || '',
        material: product.material || '',
        gender: product.gender || 'unisex',
        base_price: product.base_price || '',
        slug: product.slug || '',
        category_id: product.category?.category_id || '',
        brand_id: product.brand?.brand_id || '',
      });
    } catch (error) {
      console.error('Failed to fetch product', error);
      alert('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        product_name: formData.product_name,
        product_description: formData.product_description || undefined,
        material: formData.material || undefined,
        gender: formData.gender,
        base_price: Number(formData.base_price),
        slug: formData.slug,
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
        brand_id: formData.brand_id ? Number(formData.brand_id) : undefined,
      };

      await adminProductService.updateProduct(id, payload);
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to update product', error);
      alert(error.response?.data?.message || error.message || 'Cập nhật sản phẩm thất bại!');
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6">
        Sửa Sản phẩm #{id}
        {originalProduct && (
          <span className="ml-2 text-sm font-normal text-gray-400">— {originalProduct.product_name}</span>
        )}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
          <input
            type="text"
            name="product_name"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.product_name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            type="text"
            name="slug"
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            title="Slug chỉ chứa chữ thường, số và dấu gạch nối"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"
            value={formData.slug}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá cơ bản (VND) *</label>
            <input
              type="number"
              name="base_price"
              required
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.base_price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
            <select
              name="gender"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="unisex">Unisex</option>
              <option value="men">Nam</option>
              <option value="women">Nữ</option>
              <option value="kids">Trẻ em</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
            <input
              type="number"
              name="category_id"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.category_id}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand ID</label>
            <input
              type="number"
              name="brand_id"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.brand_id}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chất liệu</label>
          <input
            type="text"
            name="material"
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.material}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            name="product_description"
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.product_description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </div>
  );
}
