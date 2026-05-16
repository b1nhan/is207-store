# Feature Status — IS207 Clothing Store Backend

> **Đối chiếu giữa API Spec và code thực tế**  
> Cập nhật lần cuối: 2026-05-16

---

## Legend
- ✅ **Hoàn thành** — implement đầy đủ, có thể dùng được
- ⚠️ **Dang dở** — có code nhưng thiếu logic, có bug, hoặc chưa mount route
- ❌ **Chưa làm** — file tồn tại nhưng rỗng, chưa có implementation

---

## 1. Auth — `/auth/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `POST` | `/auth/register` | ✅ | Validate Zod, check trùng email/username, hash password, trả user info |
| `POST` | `/auth/login` | ✅ | Xác thực credential, cấp accessToken + HttpOnly refreshToken cookie |
| `POST` | `/auth/logout` | ✅ | Clear refreshToken cookie |
| `GET` | `/auth/me` | ✅ | Lấy user info từ req.user.user_id (verifyToken middleware) |
| `POST` | `/auth/refresh` | ✅ | Verify refreshToken cookie, cấp accessToken mới |
| `POST` | `/auth/change-password` | ✅ | Xác thực mật khẩu cũ, hash mới, clear cookie |

> **Lưu ý nhỏ:** `authService.login()` không kiểm tra `user.is_active` / account disabled (schema users không có cột is_active). `ACCOUNT_DISABLED` error code được định nghĩa nhưng chưa dùng.

---

## 2. Categories — `/categories/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/categories` | ✅ | Trả tất cả category + product_count (chỉ ACTIVE products) |
| `GET` | `/categories/:slug` | ✅ | Hoạt động tốt, trả danh sách sản phẩm theo danh mục |
| `POST` | `/categories` | ✅ | Admin endpoint hoàn thành, validate đầy đủ |
| `PUT` | `/categories/:id` | ✅ | Admin endpoint hoàn thành |
| `DELETE` | `/categories/:id` | ✅ | Admin endpoint hoàn thành, chặn xoá khi có products |

---

## 3. Products — `/products/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/products` | ✅ | Filter (search, category, brand, gender, price) & pagination hoạt động đúng |
| `GET` | `/products/:id` | ✅ | Trả đủ: product info, images[], variants[], brand, category |
| `GET` | `/products/search` | ✅ | Autocomplete, giới hạn 10 kết quả, min 2 ký tự |

> **Lưu ý:** `sale_price` luôn trả về `null` — không query từ bảng `promotions`.

---

## 4. Brands — `/brands/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/brands` | ✅ | Trả danh sách brand + product_count |
| `POST` | `/brands` | ✅ | Admin endpoint hoàn thành |
| `PUT` | `/brands/:id` | ✅ | Admin endpoint hoàn thành |
| `DELETE` | `/brands/:id` | ✅ | Admin endpoint hoàn thành |

---

## 5. Upload — `/upload/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `POST` | `/upload/image` | ✅ | Tích hợp Cloudinary và Multer hoàn tất |
| `DELETE` | `/upload/image` | ✅ | Hoàn thành |

---

## 6. Cart — `/cart/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/cart` | ✅ | Trả giỏ hàng và danh sách items |
| `POST` | `/cart` | ✅ | Thêm item vào giỏ hàng, check stock |
| `PUT` | `/cart/:itemId` | ✅ | Cập nhật số lượng |
| `DELETE` | `/cart/:itemId` | ✅ | Xoá item khỏi giỏ hàng |
| `DELETE` | `/cart` | ✅ | Clear toàn bộ giỏ hàng |

---

## 7. Vouchers — `/vouchers/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `POST` | `/vouchers/apply` | ✅ | Core logic kiểm tra tính hợp lệ và apply voucher hoàn tất |
| `GET` | `/vouchers/active` | ✅ | Lấy voucher người dùng có thể dùng |
| `GET` | `/vouchers` | ✅ | Admin list vouchers |
| `GET` | `/vouchers/:id` | ✅ | Admin get voucher detail |
| `POST` | `/vouchers` | ✅ | Admin create voucher |
| `PUT` | `/vouchers/:id` | ✅ | Admin update voucher |
| `DELETE` | `/vouchers/:id` | ✅ | Admin delete voucher |

---

## 8. Orders — `/orders/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `POST` | `/orders/checkout` | ✅ | Xử lý atomic transaction cho checkout hoàn tất |
| `GET` | `/orders` | ✅ | Lấy danh sách đơn hàng |
| `GET` | `/orders/:id` | ✅ | Chi tiết đơn hàng |
| `POST` | `/orders/:id/cancel` | ✅ | Huỷ đơn hàng bởi user, khôi phục stock |

---

## 9. Admin — `/admin/*`

### Admin Products

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/admin/products` | ✅ | Hoàn thành |
| `GET` | `/admin/products/:id` | ✅ | Hoàn thành |
| `POST` | `/admin/products` | ✅ | Hoàn thành |
| `PUT` | `/admin/products/:id` | ✅ | Hoàn thành |
| `PATCH` | `/admin/products/:id/status` | ✅ | Hoàn thành |
| `POST` | `/admin/products/:id/variants` | ✅ | Hoàn thành |
| `PUT` | `/admin/products/variants/:variantId` | ✅ | Hoàn thành |
| `DELETE` | `/admin/products/variants/:variantId` | ✅ | Hoàn thành |

### Admin Orders

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/admin/orders` | ✅ | Hoàn thành |
| `GET` | `/admin/orders/:id` | ✅ | Hoàn thành |
| `PATCH` | `/admin/orders/:id/status` | ✅ | Cập nhật status order, quản lý logic transition |

### Admin Dashboard

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/admin/dashboard/summary` | ✅ | Thống kê tổng quan hoạt động |
| `GET` | `/admin/dashboard/revenue` | ✅ | Doanh thu hoạt động |
| `GET` | `/admin/dashboard/top-products` | ✅ | Sản phẩm bán chạy hoạt động |

---

## Tổng kết

| Trạng thái | Số endpoint | Tỷ lệ |
|---|---|---|
| ✅ Hoàn thành | 45 | 100% |
| ⚠️ Dang dở | 0 | 0% |
| ❌ Chưa làm | 0 | 0% |
| **Tổng** | **45** | 100% |

### Các module hoàn thành:
- ✅ **Auth** (6/6 endpoints) — fully functional
- ✅ **Categories** (5/5 endpoints) — fully functional
- ✅ **Products** (3/3 endpoints) — fully functional
- ✅ **Brands** (4/4 endpoints) — fully functional
- ✅ **Cart** (5/5 endpoints) — fully functional
- ✅ **Orders** (4/4 endpoints) — fully functional
- ✅ **Vouchers** (7/7 endpoints) — fully functional
- ✅ **Upload** (2/2 endpoints) — fully functional
- ✅ **Admin Products** (8/8 endpoints) — fully functional
- ✅ **Admin Orders** (3/3 endpoints) — fully functional
- ✅ **Admin Dashboard** (3/3 endpoints) — fully functional
