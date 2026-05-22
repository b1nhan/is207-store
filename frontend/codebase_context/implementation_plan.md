# Implementation Plan Frontend

Kế hoạch triển khai được chia thành các Phase theo thứ tự ưu tiên: User-facing trước, Core Features trước, Admin Panel và tính năng bổ trợ làm sau.

---

## Phase 1: Hoàn thiện Auth & Global State (Ưu tiên Cao)
**Mục tiêu:** Quản lý state người dùng toàn cục để các tính năng khác (Cart, Orders, Profile) có thể nhận biết user đã đăng nhập.

| Tính năng | API Endpoints | File/Component cần sửa/tạo | Các bước Implement | Độ phức tạp |
| --- | --- | --- | --- | --- |
| **Cài đặt Zustand** | - | `package.json`, `src/store/authStore.js` | Cài đặt zustand: `npm install zustand`. Tạo store lưu trữ `user`, `isAuthenticated`. | S |
| **Hoàn thiện Login/Register** | `POST /auth/login`<br>`POST /auth/register` | `src/app/(auth)/login/page.jsx`<br>`src/app/(auth)/register/page.jsx` | Lấy token -> Lưu vào localStorage -> Cập nhật `authStore` -> Redirect về `/` hoặc trang trước đó. | M |
| **Bảo vệ Route (Auth Guard)** | `GET /auth/me` | `src/components/auth/AuthGuard.jsx` (mới)<br>`src/components/layout/Header.jsx` | Fetch user info khi app load nếu có token. Thay đổi UI Header (hiển thị Avatar thay vì nút Đăng nhập). | M |

---

## Phase 2: Product Discovery & Shopping (Ưu tiên Cao)
**Mục tiêu:** Hoàn thiện flow tìm kiếm, xem chi tiết để chọn sản phẩm đưa vào giỏ hàng.

| Tính năng | API Endpoints | File/Component cần sửa/tạo | Các bước Implement | Độ phức tạp |
| --- | --- | --- | --- | --- |
| **Trang danh sách Sản phẩm (Shop)** | `GET /products` | `src/app/(shop)/products/page.jsx` | Fetch sản phẩm. Kết nối thanh SearchBar. Lọc theo Category, Giá. Phân trang (Pagination). | L |
| **Trang chi tiết Sản phẩm** | `GET /products/:id` | `src/app/(shop)/products/[id]/page.jsx` (mới) | Hiển thị thông tin sp, giá, ảnh (Carousel), cho phép chọn Variant (Size, Color), chọn số lượng, nút "Thêm vào giỏ". | L |

---

## Phase 3: Cart System (Ưu tiên Cao)
**Mục tiêu:** Cho phép User thêm sản phẩm và quản lý giỏ hàng.

| Tính năng | API Endpoints | File/Component cần sửa/tạo | Các bước Implement | Độ phức tạp |
| --- | --- | --- | --- | --- |
| **Global Cart Store** | - | `src/store/cartStore.js` | Tạo Zustand store quản lý số lượng items trên Header (Cart icon badge). | S |
| **Cart Service & UI** | `GET /cart`<br>`POST /cart`<br>`PUT /cart/:id`<br>`DELETE /cart/:id` | `src/services/cartService.js`<br>`src/app/(shop)/cart/page.jsx` | Viết các hàm call API Cart. Tạo giao diện trang Giỏ hàng: list item, tăng giảm số lượng, tính tổng tiền. | L |

---

## Phase 4: Checkout & Order (Ưu tiên Vừa)
**Mục tiêu:** Hoàn tất quy trình mua hàng.

| Tính năng | API Endpoints | File/Component cần sửa/tạo | Các bước Implement | Độ phức tạp |
| --- | --- | --- | --- | --- |
| **Áp dụng Voucher** | `POST /vouchers/apply`<br>`GET /vouchers/active` | `src/services/voucherService.js`<br>`src/app/(shop)/checkout/page.jsx` | Giao diện hiển thị danh sách voucher hợp lệ. Fetch API apply voucher và hiển thị lại tổng tiền sau giảm. | M |
| **Checkout Đơn hàng** | `POST /orders/checkout` | `src/services/orderService.js`<br>`src/app/(shop)/checkout/page.jsx` | Form điền thông tin địa chỉ giao hàng. Submit gọi API checkout, hiển thị thông báo thành công và chuyển sang trang đơn hàng. | L |
| **Lịch sử Đơn hàng** | `GET /orders`<br>`GET /orders/:id`<br>`POST /orders/:id/cancel` | `src/app/(shop)/orders/page.jsx`<br>`src/app/(shop)/orders/[id]/page.jsx` | Hiển thị danh sách các đơn đã đặt và trạng thái. Cho phép User nhấn hủy đơn nếu đang PENDING. | M |

---

## Phase 5: Admin Panel (Ưu tiên Vừa/Thấp)
**Mục tiêu:** Quản trị toàn bộ ứng dụng (chỉ dành cho user role ADMIN).

| Tính năng | API Endpoints | File/Component cần sửa/tạo | Các bước Implement | Độ phức tạp |
| --- | --- | --- | --- | --- |
| **Admin Layout & Guard** | - | `src/app/(admin)/layout.jsx` | Dựng Sidebar Admin. Chặn user thường truy cập. | M |
| **Dashboard** | `GET /admin/dashboard/*` | `src/services/adminDashboardService.js`<br>`src/app/(admin)/admin/page.jsx` | Gọi API tổng quan và vẽ biểu đồ doanh thu, số lượng đơn, top sản phẩm. | M |
| **Quản lý Products & Image Upload** | Các API trong `/admin/products` & `/upload/image` | `src/services/adminProductService.js`<br>`src/services/uploadService.js`<br>`src/app/(admin)/admin/products/page.jsx` | Bảng danh sách sản phẩm. Form Thêm/Sửa sản phẩm có tính năng upload ảnh lên Cloudinary qua API. Thêm Variants. | L |
| **Quản lý Đơn hàng & Category/Voucher** | Các API `/admin/orders`, `/admin/vouchers`, `/categories` (POST/PUT) | Các file Service Admin tương ứng và các Page trong thư mục `(admin)` | CRUD Vouchers, Categories. Update trạng thái các đơn hàng. | L |
