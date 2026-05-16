'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import adminProductService from '@/services/adminProductService';
import uploadService from '@/services/uploadService';
import { Button } from '@/components/ui/button';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    brand_id: '',
    sku: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await adminProductService.getProductById(id);
      const product = response.data?.product || response.data;

      setFormData({
        name: product.product_name || '',
        description: product.description || '',
        price: product.base_price || '',
        category_id: product.category?.category_id || '',
        brand_id: product.brand?.brand_id || '',
        sku: product.sku || '',
      });

      if (product.thumbnail) {
        setPreview(product.thumbnail);
      }
    } catch (error) {
      console.error('Failed to fetch product', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let image_url = undefined;
      let cloudinary_image_id = undefined;

      if (imageFile) {
        const uploadRes = await uploadService.uploadImage(imageFile);
        const uploadData = uploadRes.data || uploadRes;
        image_url = uploadData.imageUrl || uploadData.url;
        cloudinary_image_id = uploadData.publicId;
      }

      const productPayload = {
        product_name: formData.name,
        description: formData.description,
        base_price: Number(formData.price),
        category_id: Number(formData.category_id),
        brand_id: Number(formData.brand_id),
        sku: formData.sku,
      };

      if (image_url) {
        productPayload.image_url = image_url;
        productPayload.cloudinary_image_id = cloudinary_image_id;
      }

      await adminProductService.updateProduct(id, productPayload);
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to update product', error);
      alert('Cập nhật sản phẩm thất bại!');
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
      <h1 className="text-2xl font-bold mb-6">Sửa Sản phẩm #{id}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VND) *</label>
            <input
              type="number"
              name="price"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input
              type="text"
              name="sku"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.sku}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category ID *</label>
            <input
              type="number"
              name="category_id"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.category_id}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand ID *</label>
            <input
              type="number"
              name="brand_id"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.brand_id}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            name="description"
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            onChange={handleImageChange}
          />
          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
            </div>
          )}
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
