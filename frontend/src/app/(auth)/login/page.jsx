import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="bg-background min-h-screen px-5 py-10 md:px-8 md:py-14">
      <div className="bg-background mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1440px] items-center justify-center rounded-none md:rounded-2xl">
        <section className="w-full max-w-[540px] rounded-2xl bg-white px-6 py-8 shadow-[var(--elevated-shadow)] sm:px-10 sm:py-10">
          <div className="mb-8 text-center">
            <h1 className="text-text-primary text-[32px] leading-tight font-bold">
              Đăng nhập
            </h1>
            <p className="text-text-muted mt-2 text-sm font-medium">
              Khách hàng mới?{' '}
              <Link
                href="/register"
                className="text-link hover:text-link-hover font-semibold transition"
              >
                Tạo tài khoản
              </Link>
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="login-identifier"
                className="text-text-secondary mb-2 block text-sm font-medium"
              >
                Email/Username
              </label>
              <input
                id="login-identifier"
                name="identifier"
                type="text"
                placeholder="Nhập email hoặc tên đăng nhập"
                className="border-border bg-surface text-text-primary placeholder:text-placeholder focus:border-primary h-12 w-full rounded-md border px-4 text-sm transition outline-none focus:ring-2 focus:ring-[var(--cb-200)]"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="text-text-secondary mb-2 block text-sm font-medium"
              >
                Mật khẩu
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                className="border-border bg-surface text-text-primary placeholder:text-placeholder focus:border-primary h-12 w-full rounded-md border px-4 text-sm transition outline-none focus:ring-2 focus:ring-[var(--cb-200)]"
              />
            </div>

            <label className="text-text-muted flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="border-border text-primary h-4 w-4 rounded border accent-[var(--button-primary-bg)]"
              />
              <span>Lưu tài khoản cho lần đăng nhập tiếp theo</span>
            </label>

            <button
              type="submit"
              className="h-12 w-full rounded-md bg-[var(--button-primary-bg)] px-4 text-base font-semibold text-white transition hover:bg-[var(--button-primary-hover)] active:bg-[var(--button-primary-active)]"
            >
              Đăng nhập
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
