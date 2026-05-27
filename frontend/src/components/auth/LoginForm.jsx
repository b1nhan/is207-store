'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/authStore';
import { STORAGE_KEYS } from '@/constants';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorDetail, setErrorDetail] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const validate = () => {
    const newErrors = {};
    // if (!email) {
    //   newErrors.email = 'Vui lòng nhập email.';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    //   newErrors.email = 'Email không đúng định dạng.';
    // }
    // if (!password) {
    //   newErrors.password = 'Vui lòng nhập mật khẩu.';
    // } else if (password.length < 8) {
    //   newErrors.password = 'Mật khẩu phải từ 8 ký tự trở lên.';
    // }
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
      const result = await authService.login(email, password);
      const payload = result.data || result;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.accessToken);
      if (payload.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refreshToken);
      }

      setUser(payload.user);
      toast.success('Welcome back!');
      router.push(callbackUrl);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      setErrorDetail(err.response?.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
        Đăng nhập
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

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-primary focus:border-primary ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
            placeholder="Nhập email của bạn"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-primary focus:border-primary ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
            placeholder="Nhập mật khẩu"
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>
          )}
        </div>

        <Button variant="primary" type="submit" className="w-full text-lg py-6 rounded-xl" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      <p className="mt-8 text-center text-gray-600">
        Chưa có tài khoản?{' '}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
