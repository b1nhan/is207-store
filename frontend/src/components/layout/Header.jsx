const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <span className="text-2xl font-bold tracking-tight text-blue-600">
              HEADER<span className="text-gray-800">TẠM</span>
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden space-x-8 md:flex">
            <a
              href="#"
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Trang chủ
            </a>
            <a
              href="#"
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Sản phẩm
            </a>
            <a
              href="#"
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Dịch vụ
            </a>
            <a
              href="#"
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Liên hệ
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
