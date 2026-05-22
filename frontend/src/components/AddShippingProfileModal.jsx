'use client';

import { useEffect, useState } from 'react';
import { XIcon, MapPinIcon, PencilIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import shippingProfileService from '@/services/shippingProfileService';

const PHONE_REGEX = /^0\d{9}$/;

const emptyForm = {
  receiver_name: '',
  receiver_phone: '',
  full_address: '',
  label: '',
  is_default: false,
};

/**
 * Modal để tạo hoặc chỉnh sửa shipping profile.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onSuccess: (profile: object) => void,
 *   initialData?: object   // nếu có → edit mode
 * }} props
 */
export default function AddShippingProfileModal({ isOpen, onClose, onSuccess, initialData }) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form khi initialData hoặc isOpen thay đổi
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          receiver_name: initialData.receiver_name || '',
          receiver_phone: initialData.receiver_phone || '',
          full_address: initialData.full_address || '',
          label: initialData.label || '',
          is_default: !!initialData.is_default,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
      setServerError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        label: form.label.trim() || null,
        is_default: form.is_default,
      };

      let profile;
      if (isEditMode) {
        const response = await shippingProfileService.updateProfile(initialData.profile_id, payload);
        profile = response?.data ?? response;
      } else {
        const response = await shippingProfileService.createProfile(payload);
        profile = response?.data ?? response;
      }

      onSuccess(profile);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    setErrors({});
    setServerError('');
    onClose();
  };

  const TitleIcon = isEditMode ? PencilIcon : MapPinIcon;
  const titleText = isEditMode ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới';
  const submitText = isEditMode ? 'Lưu thay đổi' : 'Lưu địa chỉ';

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
            <TitleIcon size={20} className="text-primary" />
            {titleText}
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
              Ghi chú địa chỉ
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
              className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-text-primary placeholder:text-text-secondary ${errors.receiver_name ? 'border-error' : 'border-border'
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
              className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-text-primary placeholder:text-text-secondary ${errors.receiver_phone ? 'border-error' : 'border-border'
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
              className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-text-primary placeholder:text-text-secondary ${errors.full_address ? 'border-error' : 'border-border'
                }`}
            />
            {errors.full_address && (
              <p className="text-error text-xs mt-1">{errors.full_address}</p>
            )}
          </div>

          {/* Đặt làm địa chỉ mặc định */}
          <label className={`flex items-center gap-2.5 pt-1 ${isEditMode && initialData?.is_default ? 'cursor-not-allowed opacity-60' : 'cursor-pointer group'
            }`}>
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={(e) => setForm((prev) => ({ ...prev, is_default: e.target.checked }))}
              disabled={isEditMode && !!initialData?.is_default}
              className="accent-primary w-4 h-4 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-text-primary group-hover:text-primary transition-colors">
              Đặt làm địa chỉ mặc định
              {isEditMode && initialData?.is_default && (
                <span className="ml-1.5 text-xs text-text-secondary font-normal">(đang là mặc định)</span>
              )}
            </span>
          </label>

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
                submitText
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
