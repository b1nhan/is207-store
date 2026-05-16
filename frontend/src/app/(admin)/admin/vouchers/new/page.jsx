'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminVoucherService from '@/services/adminVoucherService';
import { Button } from '@/components/ui/button';

export default function NewVoucherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'PERCENT',
    discount_value: '',
    min_order_value: '',
    max_discount_amount: '',
    expiration_date: '',
    usage_limit: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        discount_value: Number(formData.discount_value),
        min_order_value: Number(formData.min_order_value) || 0,
        max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : undefined,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : undefined,
      };

      await adminVoucherService.createVoucher(payload);
      router.push('/admin/vouchers');
    } catch (error) {
      console.error('Failed to create voucher', error);
      alert(error.response?.data?.message || 'Tạo voucher thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6">Thêm Voucher Mới</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã Voucher (Code) *</label>
          <input
            type="text"
            name="code"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 uppercase"
            value={formData.code}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá *</label>
            <select
              name="discount_type"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              value={formData.discount_type}
              onChange={handleInputChange}
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED_AMOUNT">Số tiền cố định</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm *</label>
            <input
              type="number"
              name="discount_value"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.discount_value}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu (VND) *</label>
            <input
              type="number"
              name="min_order_value"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.min_order_value}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giảm tối đa (VND - Tùy chọn)</label>
            <input
              type="number"
              name="max_discount_amount"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.max_discount_amount}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn *</label>
            <input
              type="date"
              name="expiration_date"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.expiration_date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng (Tùy chọn)</label>
            <input
              type="number"
              name="usage_limit"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.usage_limit}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Thêm Voucher'}
          </Button>
        </div>
      </form>
    </div>
  );
}
