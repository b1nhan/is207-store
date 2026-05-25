'use client';

import { useRouter } from 'next/navigation';
import adminVoucherService from '@/services/adminVoucherService';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import VoucherForm from '@/components/admin/VoucherForm';

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
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code || !formData.code.trim()) {
      newErrors.code = 'Mã voucher không được để trống.';
    }

    const discVal = Number(formData.discount_value);
    if (!formData.discount_value) {
      newErrors.discount_value = 'Giá trị giảm không được để trống.';
    } else if (isNaN(discVal) || discVal <= 0) {
      newErrors.discount_value = 'Giá trị giảm phải lớn hơn 0.';
    } else if (formData.discount_type === 'PERCENTAGE' && discVal > 100) {
      newErrors.discount_value = 'Phần trăm giảm tối đa là 100%.';
    }

    if (formData.min_order_value !== '' && Number(formData.min_order_value) < 0) {
      newErrors.min_order_value = 'Đơn tối thiểu không được âm.';
    }

    if (formData.max_discount_amount !== '' && Number(formData.max_discount_amount) < 0) {
      newErrors.max_discount_amount = 'Giảm tối đa không được âm.';
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = 'Ngày hết hạn không được để trống.';
    } else {
      const selectedDate = new Date(formData.expiry_date + 'T23:59:59');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.expiry_date = 'Ngày hết hạn không được ở quá khứ.';
      }
    }

    const usageLim = Number(formData.usage_limit);
    if (!formData.usage_limit) {
      newErrors.usage_limit = 'Giới hạn sử dụng không được để trống.';
    } else if (isNaN(usageLim) || usageLim < 1) {
      newErrors.usage_limit = 'Giới hạn sử dụng phải từ 1 trở lên.';
    }

    const userUsageLim = Number(formData.user_usage_limit);
    if (formData.user_usage_limit !== '' && (isNaN(userUsageLim) || userUsageLim < 1)) {
      newErrors.user_usage_limit = 'Giới hạn/người dùng phải từ 1 trở lên.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const expiryISO = formData.expiry_date
        ? new Date(formData.expiry_date + 'T23:59:59').toISOString()
        : undefined;

      const payload = {
        code: formData.code.toUpperCase(),
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
      router.push('/admin/vouchers');
    } catch (error) {
      console.error('Failed to create voucher', error);
      alert(error.response?.data?.message || error.message || 'Tạo voucher thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Breadcrumbs
        root={{ label: 'Admin', href: '/admin' }}
        items={[
          { label: 'Voucher', href: '/admin/vouchers' },
          { label: 'Thêm Voucher' },
        ]}
      />
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">Thêm Voucher Mới</h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã Voucher (Code) *</label>
            <input
              type="text"
              name="code"
              className={`w-full border rounded-lg px-4 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition ${errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
              value={formData.code}
              onChange={handleInputChange}
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá *</label>
              <select
                name="discount_type"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
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
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition ${errors.discount_value ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formData.discount_value}
                onChange={handleInputChange}
              />
              {errors.discount_value && <p className="text-red-500 text-xs mt-1">{errors.discount_value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu (VND)</label>
              <input
                type="number"
                name="min_order_value"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition ${errors.min_order_value ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formData.min_order_value}
                onChange={handleInputChange}
              />
              {errors.min_order_value && <p className="text-red-500 text-xs mt-1">{errors.min_order_value}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giảm tối đa (VND - Tùy chọn)</label>
              <input
                type="number"
                name="max_discount_amount"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition ${errors.max_discount_amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formData.max_discount_amount}
                onChange={handleInputChange}
              />
              {errors.max_discount_amount && <p className="text-red-500 text-xs mt-1">{errors.max_discount_amount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn *</label>
              <input
                type="date"
                name="expiry_date"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition ${errors.expiry_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formData.expiry_date}
                onChange={handleInputChange}
              />
              {errors.expiry_date && <p className="text-red-500 text-xs mt-1">{errors.expiry_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng *</label>
              <input
                type="number"
                name="usage_limit"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition ${errors.usage_limit ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formData.usage_limit}
                onChange={handleInputChange}
              />
              {errors.usage_limit && <p className="text-red-500 text-xs mt-1">{errors.usage_limit}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn / người dùng</label>
              <input
                type="number"
                name="user_usage_limit"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition ${errors.user_usage_limit ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formData.user_usage_limit}
                onChange={handleInputChange}
              />
              {errors.user_usage_limit && <p className="text-red-500 text-xs mt-1">{errors.user_usage_limit}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Tùy chọn)</label>
              <input
                type="text"
                name="description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
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
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">Thêm Voucher Mới</h1>
        <VoucherForm
          mode="create"
          onSuccess={() => router.push('/admin/vouchers')}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
