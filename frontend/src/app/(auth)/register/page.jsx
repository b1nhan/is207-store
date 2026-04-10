import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="bg-background min-h-screen px-5 py-10 md:px-8 md:py-14">
      <div className="bg-background mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1440px] items-center justify-center rounded-none md:rounded-2xl">
        <section className="w-full max-w-[540px] rounded-2xl bg-white px-6 py-8 shadow-[var(--elevated-shadow)] sm:px-10 sm:py-10">
          <div className="mb-8 text-center">
            <h1 className="text-text-primary text-[32px] leading-tight font-bold">
              Tạo Tài Khoản Mới
            </h1>
            <p className="text-text-muted mt-2 text-sm font-medium">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="text-link hover:text-link-hover font-semibold transition"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="register-email"
                className="text-text-secondary mb-2 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                className="border-border bg-surface text-text-primary placeholder:text-placeholder focus:border-primary h-12 w-full rounded-md border px-4 text-sm transition outline-none focus:ring-2 focus:ring-[var(--cb-200)]"
              />
            </div>

            <div>
              <label
                htmlFor="register-username"
                className="text-text-secondary mb-2 block text-sm font-medium"
              >
                Tên đăng nhập
              </label>
              <input
                id="register-username"
                name="username"
                type="text"
                placeholder="Nhập tên đăng nhập (username)"
                className="border-border bg-surface text-text-primary placeholder:text-placeholder focus:border-primary h-12 w-full rounded-md border px-4 text-sm transition outline-none focus:ring-2 focus:ring-[var(--cb-200)]"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="text-text-secondary mb-2 block text-sm font-medium"
              >
                Mật khẩu
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                className="border-border bg-surface text-text-primary placeholder:text-placeholder focus:border-primary h-12 w-full rounded-md border px-4 text-sm transition outline-none focus:ring-2 focus:ring-[var(--cb-200)]"
              />
            </div>

            <div>
              <label
                htmlFor="register-confirm-password"
                className="text-text-secondary mb-2 block text-sm font-medium"
              >
                Xác nhận mật khẩu
              </label>
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Xác nhận mật khẩu"
                className="border-border bg-surface text-text-primary placeholder:text-placeholder focus:border-primary h-12 w-full rounded-md border px-4 text-sm transition outline-none focus:ring-2 focus:ring-[var(--cb-200)]"
              />
            </div>

            <div>
              <label
                htmlFor="register-display-name"
                className="text-text-secondary mb-2 block text-sm font-medium"
              >
                Tên hiển thị
              </label>
              <input
                id="register-display-name"
                name="displayName"
                type="text"
                placeholder="Nhập tên hiển thị"
                className="border-border bg-surface text-text-primary placeholder:text-placeholder focus:border-primary h-12 w-full rounded-md border px-4 text-sm transition outline-none focus:ring-2 focus:ring-[var(--cb-200)]"
              />
            </div>

            <div>
              <label
                htmlFor="register-phone"
                className="text-text-secondary mb-2 block text-sm font-medium"
              >
                Số điện thoại
              </label>
              <input
                id="register-phone"
                name="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                className="border-border bg-surface text-text-primary placeholder:text-placeholder focus:border-primary h-12 w-full rounded-md border px-4 text-sm transition outline-none focus:ring-2 focus:ring-[var(--cb-200)]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-md bg-[var(--button-primary-bg)] px-4 text-base font-semibold text-white transition hover:bg-[var(--button-primary-hover)] active:bg-[var(--button-primary-active)]"
            >
              Tạo tài khoản
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
