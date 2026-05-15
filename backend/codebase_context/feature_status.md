# Feature Status — IS207 Clothing Store Backend

> **Đối chiếu giữa API Spec và code thực tế**  
> Cập nhật lần cuối: 2026-05-04

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
| `GET` | `/categories/:slug` | ⚠️ | Logic đúng nhưng **bug AppError args** (`new AppError(ERROR_CODES, message, status)` — sai thứ tự), category không tồn tại sẽ trả lỗi sai |
| `POST` | `/categories` | ❌ | Chưa implement (admin endpoint) |
| `PUT` | `/categories/:id` | ❌ | Chưa implement (admin endpoint) |
| `DELETE` | `/categories/:id` | ❌ | Chưa implement (admin endpoint) |

---

## 3. Products — `/products/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/products` | ⚠️ | Filter (search, category, brand, gender, price) hoạt động, nhưng **count query cho pagination không áp dụng filters** → totalItems sai khi filter |
| `GET` | `/products/:id` | ✅ | Trả đủ: product info, images[], variants[], brand, category |
| `GET` | `/products/search` | ✅ | Autocomplete, giới hạn 10 kết quả, min 2 ký tự |

> **Lưu ý:** `sale_price` luôn trả về `null` — không query từ bảng `promotions`.

---

## 4. Brands — `/brands/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/brands` | ✅ | Trả danh sách brand + product_count |
| `POST` | `/brands` | ❌ | Chưa implement |
| `PUT` | `/brands/:id` | ❌ | Chưa implement |
| `DELETE` | `/brands/:id` | ❌ | Chưa implement |

> **Lưu ý:** `brandService.getAllBrands()` gọi `BrandRepository.findAll({})` nhưng `findAll()` không nhận param (không gây lỗi nhưng là code smell).

---

## 5. Upload — `/upload/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `POST` | `/upload/image` | ❌ | `uploadController.js`, `uploadService.js`, `uploadMiddleware.js`, `config/cloudinary.js` đều rỗng |
| `DELETE` | `/upload/image` | ❌ | Chưa implement |

---

## 6. Cart — `/cart/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/cart` | ❌ | `cartController.js`, `cartService.js`, `cartRepository.js` đều rỗng |
| `POST` | `/cart` | ❌ | Chưa implement |
| `PUT` | `/cart/:itemId` | ❌ | Chưa implement |
| `DELETE` | `/cart/:itemId` | ❌ | Chưa implement |
| `DELETE` | `/cart` | ❌ | Chưa implement |

> Route `cartRoutes.js` rỗng và chưa được mount trong `routes/index.js`.

---

## 7. Vouchers — `/vouchers/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `POST` | `/vouchers/apply` | ❌ | `voucherController.js`, `voucherService.js`, `voucherRepository.js` đều rỗng |
| `GET` | `/vouchers/active` | ❌ | Chưa implement |
| `GET` | `/vouchers` | ❌ | Chưa implement (admin) |
| `GET` | `/vouchers/:id` | ❌ | Chưa implement (admin) |
| `POST` | `/vouchers` | ❌ | Chưa implement (admin) |
| `PUT` | `/vouchers/:id` | ❌ | Chưa implement (admin) |
| `DELETE` | `/vouchers/:id` | ❌ | Chưa implement (admin) |

> Route `voucherRoutes.js` rỗng và chưa được mount trong `routes/index.js`.

---

## 8. Orders — `/orders/*`

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `POST` | `/orders/checkout` | ❌ | `orderController.js`, `orderService.js`, `orderRepository.js`, `orderItemRepository.js` đều rỗng |
| `GET` | `/orders` | ❌ | Chưa implement |
| `GET` | `/orders/:id` | ❌ | Chưa implement |
| `POST` | `/orders/:id/cancel` | ❌ | Chưa implement |

> Route `orderRoutes.js` rỗng và chưa được mount. DB có stored procedure `sp_place_order` nhưng chưa được gọi.

---

## 9. Admin — `/admin/*`

### Admin Products

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/admin/products` | ❌ | `adminProductController.js`, `adminProductService.js`, `adminProductRepository.js` đều rỗng |
| `GET` | `/admin/products/:id` | ❌ | Chưa implement |
| `POST` | `/admin/products` | ❌ | Chưa implement |
| `PUT` | `/admin/products/:id` | ❌ | Chưa implement |
| `PATCH` | `/admin/products/:id/status` | ❌ | Chưa implement |
| `POST` | `/admin/products/:id/variants` | ❌ | Chưa implement |
| `PUT` | `/admin/products/variants/:variantId` | ❌ | Chưa implement |
| `DELETE` | `/admin/products/variants/:variantId` | ❌ | Chưa implement |

### Admin Orders

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/admin/orders` | ❌ | `adminOrderController.js`, `adminOrderService.js`, `adminOrderRepository.js` đều rỗng |
| `GET` | `/admin/orders/:id` | ❌ | Chưa implement |
| `PATCH` | `/admin/orders/:id/status` | ❌ | Chưa implement |

### Admin Dashboard

| Method | Endpoint | Status | Ghi chú |
|---|---|---|---|
| `GET` | `/admin/dashboard/summary` | ❌ | `adminDashboardController.js`, `adminDashboardService.js`, `adminDashboardRepository.js` đều rỗng |
| `GET` | `/admin/dashboard/revenue` | ❌ | Chưa implement |
| `GET` | `/admin/dashboard/top-products` | ❌ | Chưa implement |

> `adminRoutes.js` rỗng và chưa được mount trong `routes/index.js`.

---

## Tổng kết

| Trạng thái | Số endpoint | Tỷ lệ |
|---|---|---|
| ✅ Hoàn thành | 10 | ~22% |
| ⚠️ Dang dở | 4 | ~9% |
| ❌ Chưa làm | 31 | ~69% |
| **Tổng** | **45** | 100% |

### Các module hoàn thành:
- ✅ **Auth** (6/6 endpoints) — fully functional
- ✅ **Categories GET** (2/5 endpoints) — read-only working
- ✅ **Products GET** (3/3 endpoints) — read-only working (có bug pagination count)
- ✅ **Brands GET** (1/4 endpoints) — read-only working

### Các module chưa implement:
- ❌ **Cart** (0/5)
- ❌ **Orders** (0/4)
- ❌ **Vouchers** (0/7)
- ❌ **Upload** (0/2)
- ❌ **Admin Products** (0/8)
- ❌ **Admin Orders** (0/3)
- ❌ **Admin Dashboard** (0/3)
- ❌ **Admin CRUD** cho Category/Brand (0/6)
