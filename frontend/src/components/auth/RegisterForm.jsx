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
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Đăng ký</h2>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username — bắt buộc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Chỉ gồm chữ cái, số và dấu _"
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        {/* Email — bắt buộc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Nhập email của bạn"
            required
          />
        </div>

        {/* Họ và tên — optional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Nhập họ và tên (tuỳ chọn)"
            maxLength={100}
          />
        </div>

        {/* Số điện thoại — optional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="0xxxxxxxxx (tuỳ chọn)"
          />
        </div>

        {/* Mật khẩu — bắt buộc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Nhập mật khẩu"
            required
            minLength={6}
          />
        </div>

        {/* Xác nhận mật khẩu — bắt buộc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Nhập lại mật khẩu"
            required
            minLength={6}
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-full text-lg py-6 rounded-xl mt-4"
          disabled={loading}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>
      </form>

      <p className="mt-8 text-center text-gray-600">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}