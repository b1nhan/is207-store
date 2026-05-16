'use client';
import { brandService } from '@/services/brandService';
import authService from '@/services/authService';
import Link from 'next/link';

export default async function LoginPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');

    try {
      //   const { data } = await brandService.getBrand();
      //   console.log(data);
      const response = await authService.getMe({
        email,
        password,
      });
      //console.log(email, password);
      console.log('Login response:', response);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <main className="bg-background min-h-screen px-5 py-10 md:px-8 md:py-14">
      <div className="bg-background mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1440px] items-center justify-center">
        <section className="w-full max-w-[540px] rounded-2xl bg-white px-6 py-8 shadow-[var(--elevated-shadow)] sm:px-10 sm:py-10">
          <div className="mb-8 text-center">
            <h1 className="text-text-primary text-[32px] font-bold">
              Đăng nhập
            </h1>
            <p className="text-text-muted mt-2 text-sm">
              Khách hàng mới?{' '}
              <Link
                href="/register"
                className="text-link hover:text-link-hover font-semibold"
              >
                Tạo tài khoản
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-text-secondary mb-2 block text-sm">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Nhập email"
                className="border-border h-12 w-full rounded-md border px-4"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-text-secondary mb-2 block text-sm">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                className="border-border h-12 w-full rounded-md border px-4"
              />
            </div>

            {/* Checkbox (không cần state luôn) */}
            <label className="text-text-muted flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border accent-[var(--button-primary-bg)]"
              />
              <span>Lưu tài khoản</span>
            </label>

            {/* Button */}
            <button
              type="submit"
              className="h-12 w-full rounded-md bg-[var(--button-primary-bg)] font-semibold text-white"
            >
              Đăng nhập
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
