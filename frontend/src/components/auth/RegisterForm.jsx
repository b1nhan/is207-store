'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/authStore';
import { STORAGE_KEYS } from '@/constants';

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

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
      router.push('/');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username — bắt buộc */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:ring-2"
            placeholder="Chỉ gồm chữ cái, số và dấu _"
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        {/* Email — bắt buộc */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
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

        {/* Họ và tên — optional */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Họ và tên
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:ring-2"
            placeholder="Nhập họ và tên (tuỳ chọn)"
            maxLength={100}
          />
        </div>

        {/* Số điện thoại — optional */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:ring-2"
            placeholder="0xxxxxxxxx (tuỳ chọn)"
          />
        </div>

        {/* Mật khẩu — bắt buộc */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:ring-2"
            placeholder="Nhập mật khẩu"
            required
            minLength={8}
          />
        </div>

        {/* Xác nhận mật khẩu — bắt buộc */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:ring-2"
            placeholder="Nhập lại mật khẩu"
            required
            minLength={8}
          />
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
