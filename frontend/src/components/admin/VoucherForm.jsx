'use client';

import { useState, useEffect } from 'react';
import adminVoucherService from '@/services/adminVoucherService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toDatetimeLocal, toISOString } from '@/utils/date';

export default function VoucherForm({ mode = 'create', initialData = null, onSuccess, onCancel }) {
  const isEdit = mode === 'edit';
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (initialData && isEdit) {
      return {
        code: initialData.code || '',
        discount_type: initialData.discount_type || 'PERCENTAGE',
        discount_value: initialData.discount_value || '',
        min_order_value: initialData.min_order_value || '',
        max_discount_amount: initialData.max_discount_amount || '',
        start_date: toDatetimeLocal(initialData.start_date) || '',
        expiry_date: toDatetimeLocal(initialData.expiry_date) || '',
        usage_limit: initialData.usage_limit || '',
        user_usage_limit: initialData.user_usage_limit || 1,
        description: initialData.description || '',
        is_active: initialData.is_active ?? 1,
      };
    }
    return {
      code: '',
      discount_type: 'PERCENTAGE',
      discount_value: '',
      min_order_value: '',
      max_discount_amount: '',
      start_date: '',
      expiry_date: '',
      usage_limit: '',
      user_usage_limit: 1,
      description: '',
      is_active: 1,
    };
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
        code: formData.code,
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_order_value: formData.min_order_value ? Number(formData.min_order_value) : 0,
        max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : undefined,
        usage_limit: Number(formData.usage_limit),
        user_usage_limit: Number(formData.user_usage_limit) || 1,
        start_date: formData.start_date ? toISOString(formData.start_date) : undefined,
        expiry_date: formData.expiry_date ? toISOString(formData.expiry_date) : undefined,
        description: formData.description || undefined,
        is_active: Number(formData.is_active),
      };

      if (isEdit) {
        await adminVoucherService.updateVoucher(initialData.voucher_id, payload);
        toast.success('Cập nhật voucher thành công');
      } else {
        await adminVoucherService.createVoucher(payload);
        toast.success('Tạo voucher thành công');
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(isEdit ? 'Failed to update voucher' : 'Failed to create voucher', error);
      toast.error(error.response?.data?.message || error.message || (isEdit ? 'Cập nhật voucher thất bại!' : 'Tạo voucher thất bại!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            name="is_active"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
            value={formData.is_active}
            onChange={handleInputChange}
            disabled={!isEdit} // Backend defaults to 1 on create
          >
            <option value={1}>ACTIVE</option>
            <option value={0}>INACTIVE</option>
          </select>
          {!isEdit && <p className="text-xs text-gray-500 mt-1">Mặc định là ACTIVE khi tạo mới.</p>}
        </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu (Tùy chọn)</label>
          <input
            type="datetime-local"
            name="start_date"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.start_date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn *</label>
          <input
            type="datetime-local"
            name="expiry_date"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.expiry_date}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng (Tổng) *</label>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn / Người dùng</label>
          <input
            type="number"
            name="user_usage_limit"
            min="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.user_usage_limit}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Tùy chọn)</label>
        <textarea
          name="description"
          maxLength={255}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật Voucher' : 'Thêm Voucher'}
        </Button>
      </div>
    </form>
  );
}
