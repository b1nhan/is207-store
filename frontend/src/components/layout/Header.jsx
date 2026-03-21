import SearchBar from './SearchBar';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <a href="/">
              <span className="text-text-primary text-2xl font-bold tracking-tight">
                Shop<span className="text-primary">FS</span>
              </span>
            </a>
          </div>

          <SearchBar />

          {/* Navigation - Desktop */}
          <nav className="hidden space-x-8 md:flex">
            <a
              href="/"
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Trang chủ
            </a>
            <a
              href="/products"
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Sản phẩm
            </a>
          </nav>

          {/* Button Action */}
          <div className="flex items-center">
            <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95">
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
