'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminVoucherService from '@/services/adminVoucherService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function NewVoucherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'PERCENTAGE',   // Backend enum: PERCENTAGE | FIXED | FREESHIP
    discount_value: '',
    min_order_value: '',
    max_discount_amount: '',
    expiry_date: '',               // Backend field: expiry_date (ISO datetime)
    usage_limit: '',               // Required by backend
    user_usage_limit: 1,
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend createVoucherSchema expects:
      // - expiry_date: ISO 8601 datetime string (e.g. "2025-12-31T23:59:59.000Z")
      // - discount_type: 'PERCENTAGE' | 'FIXED' | 'FREESHIP'
      // - usage_limit: required positive integer
      const expiryISO = formData.expiry_date
        ? new Date(formData.expiry_date + 'T23:59:59').toISOString()
        : undefined;

      const payload = {
        code: formData.code,
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_order_value: formData.min_order_value ? Number(formData.min_order_value) : 0,
        max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : undefined,
        usage_limit: Number(formData.usage_limit),
        user_usage_limit: Number(formData.user_usage_limit) || 1,
        expiry_date: expiryISO,
        description: formData.description || undefined,
      };

      await adminVoucherService.createVoucher(payload);
      toast.success('Voucher created');
      router.push('/admin/vouchers');
    } catch (error) {
      console.error('Failed to create voucher', error);
      toast.error(error.response?.data?.message || error.message || 'Tạo voucher thất bại!');
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
              <option value="PERCENTAGE">Phần trăm (%)</option>
              <option value="FIXED">Số tiền cố định</option>
              <option value="FREESHIP">Freeship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm *</label>
            <input
              type="number"
              name="discount_value"
              required
              min="0.01"
              step="any"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.discount_value}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu (VND)</label>
            <input
              type="number"
              name="min_order_value"
              min="0"
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
              min="0"
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
              name="expiry_date"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.expiry_date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng *</label>
            <input
              type="number"
              name="usage_limit"
              required
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.usage_limit}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn / người dùng</label>
            <input
              type="number"
              name="user_usage_limit"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.user_usage_limit}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Tùy chọn)</label>
            <input
              type="text"
              name="description"
              maxLength={255}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={formData.description}
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
