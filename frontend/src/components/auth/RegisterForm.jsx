'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/authStore';
import { STORAGE_KEYS } from '@/constants';
import { toast } from 'sonner';

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [errorDetail, setErrorDetail] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!username || !username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập.';
    } else if (username.trim().length < 3 || username.trim().length > 50) {
      newErrors.username = 'Tên đăng nhập phải từ 3 đến 50 ký tự.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới.';
    }

    if (!email) {
      newErrors.email = 'Vui lòng nhập email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không đúng định dạng.';
    }

    if (fullName && fullName.trim().length > 100) {
      newErrors.fullName = 'Họ và tên tối đa 100 ký tự.';
    }

    if (phone && !/^0\d{9}$/.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (phải bắt đầu bằng 0, có 10 chữ số).';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải từ 8 ký tự trở lên.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
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
    setError('');
    setLoading(true);

    try {
      await authService.register({
        email,
        password,
        username,
        full_name: fullName,
        phone,
      });

      // Tự động đăng nhập sau khi đăng ký thành công
      const loginResult = await authService.login(email, password);
      const payload = loginResult.data || loginResult;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.accessToken);
      if (payload.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refreshToken);
      }

      setUser(payload.user);
      toast.success('Tạo tài khoản thành công');
      router.push('/');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      setErrorDetail(err.response?.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
        Đăng ký
      </h2>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}

          {errorDetail &&
            <ul className="list-inside list-disc space-y-1 mt-1">
              {errorDetail.map((errItem, index) => (
                <li key={index}>
                  {errItem.message}
                </li>
              ))}
            </ul>
          }
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Username — bắt buộc */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
            }}
            className={`w-full rounded-xl border px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
            placeholder="Chỉ gồm chữ cái, số và dấu _"
          />
          {errors.username && (
            <span className="text-red-500 text-xs mt-1 block">{errors.username}</span>
          )}
        </div>

        {/* Email — bắt buộc */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            className={`w-full rounded-xl border px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
            placeholder="Nhập email của bạn"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
          )}
        </div>

        {/* Họ và tên — optional */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Họ và tên
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
            }}
            className={`w-full rounded-xl border px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Nhập họ và tên (tuỳ chọn)"
          />
          {errors.fullName && (
            <span className="text-red-500 text-xs mt-1 block">{errors.fullName}</span>
          )}
        </div>

        {/* Số điện thoại — optional */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            className={`w-full rounded-xl border px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="0xxxxxxxxx (tuỳ chọn)"
          />
          {errors.phone && (
            <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>
          )}
        </div>

        {/* Mật khẩu — bắt buộc */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            className={`w-full rounded-xl border px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
            placeholder="Nhập mật khẩu"
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>
          )}
        </div>

        {/* Xác nhận mật khẩu — bắt buộc */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            className={`w-full rounded-xl border px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
            placeholder="Nhập lại mật khẩu"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>
          )}
        </div>

        <Button
          variant="primary"
          type="submit"
          className="mt-4 w-full rounded-xl py-6 text-lg"
          disabled={loading}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>
      </form>

      <p className="mt-8 text-center text-gray-600">
        Đã có tài khoản?{' '}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
