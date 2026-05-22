'use client';

import { useState } from 'react';
import { XIcon, MapPinIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import shippingProfileService from '@/services/shippingProfileService';

const PHONE_REGEX = /^0\d{9}$/;

const initialForm = {
  receiver_name: '',
  receiver_phone: '',
  full_address: '',
  label: '',
};

/**
 * Modal để tạo shipping profile mới.
 *
 * @param {{ isOpen: boolean, onClose: () => void, onSuccess: (newProfile: object) => void }} props
 */
export default function AddShippingProfileModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear lỗi của field khi user bắt đầu nhập lại
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.receiver_name.trim()) newErrors.receiver_name = 'Vui lòng nhập họ và tên người nhận.';
    if (!form.receiver_phone.trim()) {
      newErrors.receiver_phone = 'Vui lòng nhập số điện thoại.';
    } else if (!PHONE_REGEX.test(form.receiver_phone.trim())) {
      newErrors.receiver_phone = 'Số điện thoại không hợp lệ (bắt đầu bằng 0, đủ 10 chữ số).';
    }
    if (!form.full_address.trim()) newErrors.full_address = 'Vui lòng nhập địa chỉ giao hàng.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        receiver_name: form.receiver_name.trim(),
        receiver_phone: form.receiver_phone.trim(),
        full_address: form.full_address.trim(),
        ...(form.label.trim() && { label: form.label.trim() }),
      };
      const response = await shippingProfileService.createProfile(payload);
      // axiosInstance interceptor thường unwrap response.data, nên check cả hai dạng
      const newProfile = response?.data ?? response;
      onSuccess(newProfile);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      setServerError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    setServerError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-lg bg-surface rounded-2xl shadow-elevated border border-card-border animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <MapPinIcon size={20} className="text-primary" />
            Thêm địa chỉ mới
          </h2>
          <button
            onClick={handleClose}
            className="text-text-secondary hover:text-text-primary transition-colors rounded-md p-1 hover:bg-surface-hover"
            aria-label="Đóng"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="bg-error-bg text-error border border-error-border p-3 rounded-md text-sm">
              {serverError}
            </div>
          )}

          {/* Nhãn (tuỳ chọn) */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Nhãn địa chỉ <span className="text-text-secondary font-normal">(tuỳ chọn)</span>
            </label>
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="VD: Nhà riêng, Văn phòng..."
              className="w-full px-4 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-text-primary placeholder:text-text-secondary"
            />
          </div>

          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Họ và tên người nhận <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="receiver_name"
              value={form.receiver_name}
              onChange={handleChange}
              placeholder="Nhập họ và tên đầy đủ"
              className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-text-primary placeholder:text-text-secondary ${
                errors.receiver_name ? 'border-error' : 'border-border'
              }`}
            />
            {errors.receiver_name && (
              <p className="text-error text-xs mt-1">{errors.receiver_name}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Số điện thoại <span className="text-error">*</span>
            </label>
            <input
              type="tel"
              name="receiver_phone"
              value={form.receiver_phone}
              onChange={handleChange}
              placeholder="VD: 0912345678"
              className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-text-primary placeholder:text-text-secondary ${
                errors.receiver_phone ? 'border-error' : 'border-border'
              }`}
            />
            {errors.receiver_phone && (
              <p className="text-error text-xs mt-1">{errors.receiver_phone}</p>
            )}
          </div>

          {/* Địa chỉ giao hàng */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Địa chỉ giao hàng <span className="text-error">*</span>
            </label>
            <textarea
              name="full_address"
              value={form.full_address}
              onChange={handleChange}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              rows={3}
              className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-text-primary placeholder:text-text-secondary ${
                errors.full_address ? 'border-error' : 'border-border'
              }`}
            />
            {errors.full_address && (
              <p className="text-error text-xs mt-1">{errors.full_address}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon size={16} className="animate-spin" />
                  Đang lưu...
                </span>
              ) : (
                'Lưu địa chỉ'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
