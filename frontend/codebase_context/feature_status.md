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
- **Các chức năng Giỏ hàng (Get, Add, Update, Remove)**: ❌ **Chưa làm**
  - Thư mục `src/app/(shop)/cart/page.jsx` đang là file trống 0 bytes.
  - File `cartService.js` và `cartStore.js` cũng đang trống.

### 5. Orders & Checkout (Đơn hàng & Thanh toán)
- **Checkout & Quản lý đơn hàng**: ❌ **Chưa làm**
  - Các thư mục `/checkout`, `/orders` tồn tại nhưng chưa có nội dung. File `orderService.js` trống.

### 6. Vouchers (Mã giảm giá)
- **Áp dụng Voucher & Lấy danh sách Voucher**: ❌ **Chưa làm**
  - File `voucherService.js` trống. Chưa có UI giỏ hàng để áp dụng voucher.

### 7. Admin (Quản trị viên) & Image Upload
- **Upload Ảnh (`/upload/image`)**: ❌ **Chưa làm**
- **Admin Dashboard, Products, Orders, Vouchers**: ❌ **Chưa làm**
  - Các file `adminProductService.js`, `adminOrderService.js`, `adminVoucherService.js`, `adminDashboardService.js` hoàn toàn trống 0 bytes.
  - Trang `/admin` trống.

---

### Tổng kết chung:
- Frontend chủ yếu mới chỉ hoàn thiện bộ khung, trang chủ (Homepage) và cấu hình Axios Interceptors xuất sắc.
- **Các tính năng cốt lõi của một trang E-commerce** như Giỏ hàng (Cart), Chi tiết sản phẩm (Product Detail), Thanh toán (Checkout) và Quản lý Đơn hàng **vẫn chưa được triển khai**.
