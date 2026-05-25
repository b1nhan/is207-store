'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/authStore';
import { STORAGE_KEYS } from '@/constants';

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(email, password);
      // Giả sử backend trả về dạng { data: { user, accessToken, refreshToken } } hoặc { user, accessToken, refreshToken }
      const payload = result.data || result;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.accessToken);
      if (payload.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refreshToken);
      }

      setUser(payload.user);
      router.push('/');
    } catch (err) {
      const detailedMessage =
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(detailedMessage);
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
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:ring-2"
            placeholder="Nhập email của bạn"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:ring-2"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-full rounded-xl py-6 text-lg"
          disabled={loading}
        >
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
