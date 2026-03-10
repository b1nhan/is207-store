const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-12 pb-8 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Về chúng tôi</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Chúng tôi cung cấp các giải pháp kỹ thuật số giúp tối ưu hóa quy
              trình làm việc và nâng cao hiệu quả kinh doanh cho các đối tác.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Hỗ trợ khách hàng
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Thông tin liên hệ
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Email: contact@demosite.com</p>
              <p>Hotline: 0123 456 789</p>
              <p>Địa chỉ: 123 Đường ABC, Quận 1, TP. HCM</p>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="border-t border-gray-800 pt-8 text-center text-xs tracking-widest text-gray-500 uppercase">
          © {new Date().getFullYear()} Demo Site. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
