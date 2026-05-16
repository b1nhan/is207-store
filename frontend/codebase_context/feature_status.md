# Đối chiếu Backend vs. Frontend hiện tại

Dựa trên API Spec và trạng thái codebase Frontend hiện tại (`src/app` và `src/services`), đây là bảng tổng hợp các tính năng:

### 1. Auth & Users
- **Login / Register / Auth Me**: ⚠️ **Dang dở** 
  - Đã có `authService.js` (kết nối API đầy đủ).
  - Đã có UI trang `/login`, `/register`.
  - **Thiếu:** Logic lưu token vào Global Store, chuyển hướng sau khi đăng nhập thành công.
- **Refresh Token**: ✅ **Hoàn thành** 
  - Đã được implement ngầm trong `axios.js` interceptor.
- **Đăng xuất / Đổi mật khẩu**: ❌ **Chưa làm** 
  - Thiếu trang UI/Form cho đổi mật khẩu và nút chức năng đăng xuất trên giao diện.

### 2. Categories (Danh mục) & Brands
- **Get Categories/Brands**: ⚠️ **Dang dở**
  - Đã có `categoryService.js`, `brandService.js`.
  - Đã hiển thị ở `CategorySectionWrapper` tại trang chủ.
  - **Thiếu:** Trang danh sách sản phẩm theo Category (VD: `/categories/[slug]`).
- **Admin CRUD Categories/Brands**: ❌ **Chưa làm**
  - File Service trống, không có UI Admin.

### 3. Products (Sản phẩm)
- **Get Danh sách Sản phẩm (Trang chủ)**: ✅ **Hoàn thành** (Phần UI)
  - Trang chủ (`/`) đã gọi API lấy New Arrivals, Best Sellers, Featured, Discount qua `productService.js`.
- **Tìm kiếm / Lọc Sản phẩm**: ⚠️ **Dang dở**
  - Đã khai báo hàm gọi API, có trang `/products` (chỉ có giao diện khung). Thiếu logic gọi API và hiển thị kết quả.
- **Chi tiết Sản phẩm (`/products/[id]`)**: ❌ **Chưa làm**
  - Có hàm trong Service nhưng hoàn toàn chưa có trang UI chi tiết sản phẩm.

### 4. Cart (Giỏ hàng)
- **Các chức năng Giỏ hàng (Get, Add, Update, Remove)**: ✅ **Hoàn thành**
  - Đã có state `cartStore.js` kết nối `cartService.js`.
  - UI Giỏ hàng tại `src/app/(shop)/cart/page.jsx` đã đầy đủ tính năng.

### 5. Orders & Checkout (Đơn hàng & Thanh toán)
- **Checkout & Quản lý đơn hàng**: ✅ **Hoàn thành**
  - Đã triển khai `orderService.js`.
  - Trang `/checkout` hiển thị form điền thông tin và áp dụng voucher.
  - Trang `/orders` (Lịch sử) và `/orders/[id]` (Chi tiết) đã hiển thị đầy đủ thông tin trạng thái đơn và cho phép hủy.

### 6. Vouchers (Mã giảm giá)
- **Áp dụng Voucher & Lấy danh sách Voucher**: ✅ **Hoàn thành**
  - Đã triển khai `voucherService.js` và UI áp dụng voucher vào `checkout/page.jsx`.

### 7. Admin (Quản trị viên) & Image Upload
- **Upload Ảnh (`/upload/image`)**: ✅ **Hoàn thành**
  - Đã có `uploadService.js`.
- **Admin Dashboard, Products, Orders, Vouchers**: ✅ **Hoàn thành**
  - Đã thiết lập `AdminGuard` và `AdminSidebar` bảo vệ route `/admin`.
  - Đã tạo các file Service: `adminDashboardService.js`, `adminProductService.js`, `adminOrderService.js`, `adminVoucherService.js`.
  - Đã có các trang quản trị Dashboard, Products (bao gồm thêm/sửa, upload ảnh), Orders (cập nhật trạng thái), Vouchers (thêm, xóa).

---

### Tổng kết chung:
- Frontend chủ yếu mới chỉ hoàn thiện bộ khung, trang chủ (Homepage) và cấu hình Axios Interceptors xuất sắc.
- **Các tính năng cốt lõi của một trang E-commerce** như Giỏ hàng (Cart), Chi tiết sản phẩm (Product Detail), Thanh toán (Checkout) và Quản lý Đơn hàng **vẫn chưa được triển khai**.
