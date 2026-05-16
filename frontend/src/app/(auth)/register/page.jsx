'use client';

import authService from '@/services/authService';
import Link from 'next/link';

export default function RegisterPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');
    const full_name = formData.get('full_name');
    const phone = formData.get('phone');

    try {
      const response = await authService.register({
        email,
        password,
        username,
        full_name,
        phone,
      });

      console.log('Register response:', response);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <main className="bg-background min-h-screen px-5 py-10 md:px-8 md:py-14">
      <div className="bg-background mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1440px] items-center justify-center">
        <section className="w-full max-w-[540px] rounded-2xl bg-white px-6 py-8 shadow-[var(--elevated-shadow)] sm:px-10 sm:py-10">
          <div className="mb-8 text-center">
            <h1 className="text-text-primary text-[32px] font-bold">
              Tạo tài khoản
            </h1>
            <p className="text-text-muted mt-2 text-sm">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="text-link hover:text-link-hover font-semibold"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border-border h-12 w-full rounded-md border px-4"
            />

            {/* Username */}
            <input
              name="username"
              type="text"
              placeholder="Tên đăng nhập"
              className="border-border h-12 w-full rounded-md border px-4"
            />

            {/* Password */}
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              className="border-border h-12 w-full rounded-md border px-4"
            />

            {/* Full name */}
            <input
              name="full_name"
              type="text"
              placeholder="Tên hiển thị"
              className="border-border h-12 w-full rounded-md border px-4"
            />

            {/* Phone */}
            <input
              name="phone"
              type="text"
              placeholder="Số điện thoại"
              className="border-border h-12 w-full rounded-md border px-4"
            />

            {/* Button */}
            <button
              type="submit"
              className="h-12 w-full rounded-md bg-[var(--button-primary-bg)] font-semibold text-white"
            >
              Tạo tài khoản
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
