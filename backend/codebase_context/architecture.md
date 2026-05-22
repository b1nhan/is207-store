# Architecture — IS207 Clothing Store Backend

> **Stack:** Node.js (ESM) · Express v5 · MySQL2 · Zod · JWT · Cloudinary · Multer  
> **Base URL:** `http://localhost:8080/api/v1`  
> **Entry point:** `src/server.js` → `src/app.js`

---

## 1. Tổng quan kiến trúc

```
src/
├── server.js              # Khởi động server, kết nối DB
├── app.js                 # Khởi tạo Express, register middleware & routes
├── config/                # Cấu hình môi trường và external services
│   ├── env.js             # Load & validate biến môi trường
│   ├── corsOptions.js     # CORS whitelist config
│   └── cloudinary.js      # Cloudinary SDK init ✅
├── constants/             # Hằng số toàn ứng dụng
│   ├── errorCode.js       # ERROR_CODES theo domain (AUTH, PRODUCT, CART…)
│   ├── userRole.js        # UserRole.ADMIN / UserRole.USER
│   ├── orderStatus.js     # Trạng thái đơn hàng ✅
│   └── voucherType.js     # Phân loại voucher ✅
├── middlewares/           # Express middlewares
│   ├── verifyToken.js     # Xác thực JWT Bearer token → req.user
│   ├── requireAdmin.js    # Kiểm tra role admin (dùng sau verifyToken)
│   ├── validate.js        # Zod schema factory → validate req.body
│   ├── errorHandler.js    # Global error handler (cuối pipeline)
│   ├── notFound.js        # 404 handler
│   └── uploadMiddleware.js# Multer config ✅
├── routes/                # Route definitions
│   ├── index.js           # Router gốc, mount tất cả sub-routers
│   ├── authRoutes.js      ✅
│   ├── productRoutes.js   ✅
│   ├── categoryRoutes.js  ✅
│   ├── brandRoutes.js     ✅
│   ├── cartRoutes.js      ✅
│   ├── orderRoutes.js     ✅
│   ├── voucherRoutes.js   ✅
│   ├── uploadRoutes.js    ✅
│   └── adminRoutes.js     ✅
├── controllers/           # Nhận HTTP request, gọi service, trả response
│   ├── authController.js  ✅
│   ├── productController.js ✅
│   ├── categoryController.js ✅
│   ├── brandController.js ✅
│   ├── cartController.js  ✅
│   ├── orderController.js ✅
│   ├── uploadController.js✅
│   ├── voucherController.js✅
│   └── admin/
│       ├── adminProductController.js   ✅
│       ├── adminOrderController.js     ✅
│       ├── adminVoucherController.js   ✅
│       └── adminDashboardController.js ✅
├── services/              # Business logic layer
│   ├── authService.js     ✅
│   ├── productService.js  ✅
│   ├── categoryService.js ✅
│   ├── brandService.js    ✅
│   ├── cartService.js     ✅
│   ├── orderService.js    ✅
│   ├── uploadService.js   ✅
│   ├── voucherService.js  ✅
│   └── admin/
│       ├── adminProductService.js    ✅
│       ├── adminOrderService.js      ✅
│       ├── adminVoucherService.js    ✅
│       └── adminDashboardService.js  ✅
├── repositories/          # Data access layer — raw SQL queries
│   ├── userRepository.js        ✅
│   ├── productRepository.js     ✅
│   ├── categoryRepository.js    ✅
│   ├── brandRepository.js       ✅
│   ├── cartRepository.js        ✅
│   ├── orderRepository.js       ✅
│   ├── orderItemRepository.js   ✅
│   ├── productImageRepository.js✅
│   ├── productVariantRepository.js✅
│   ├── voucherRepository.js     ✅
│   └── admin/
│       ├── adminProductRepository.js   ✅
│       ├── adminOrderRepository.js     ✅
│       └── adminDashboardRepository.js ✅
├── validations/           # Zod schemas
│   ├── authValdiation.js       ✅ (registerSchema, loginSchema, changePasswordSchema)
│   ├── cartValidations.js      ✅
│   ├── orderValidations.js     ✅
│   ├── productValidations.js   ✅
│   └── voucherValidations.js   ✅
├── utils/                 # Tiện ích dùng chung
│   ├── AppError.js        ✅ Custom Error class
│   ├── response.js        ✅ sendSuccess() / sendError()
│   ├── jwt.js             ✅ generateAccessToken/RefreshToken, verify, cookie helpers
│   ├── bcrypt.js          ✅ hashPassword / comparePassword
│   ├── pagination.js      ✅ getPagination / getPaginationData
│   └── logger.js          ✅ HTTP request logger + error logger
└── database/
    └── connection.js      ✅ MySQL2 pool connection, getDB()
```

---

## 2. Layered Architecture (Controller → Service → Repository)

```
HTTP Request
     │
     ▼
Middleware Pipeline:
  logger → cors → bodyParser → cookieParser
  → verifyToken (nếu cần auth)
  → requireAdmin (nếu cần admin)
  → validate(zodSchema) (nếu có body)
     │
     ▼
Controller  →  gọi service.method(), gọi sendSuccess() hoặc next(err)
     │
     ▼
Service     →  Business logic, validation nghiệp vụ, throw AppError
     │
     ▼
Repository  →  Raw SQL queries với mysql2, trả về plain objects
     │
     ▼
MySQL Database (is207_db)

--- On Error ---
AppError → errorHandler → sendError()
Unknown Error → 500 INTERNAL_ERROR
```

---

## 3. Conventions

### 3.1 Naming Conventions

| Layer | Pattern | Ví dụ |
|---|---|---|
| Controller | class + singleton export | `class ProductController` → `export default new ProductController()` |
| Service | class + singleton export | `class ProductService` → `export default new ProductService()` |
| Repository | class + singleton export | `class ProductRepository` → `export default new ProductRepository()` |
| Auth utils | Named function exports | `export const findById`, `export const register` |
| Routes | camelCase + Routes | `authRoutes.js`, `productRoutes.js` |
| Validations | camelCase + Schema | `registerSchema`, `loginSchema` |
| Error codes | SCREAMING_SNAKE_CASE, grouped | `ERROR_CODES.PRODUCT.NOT_FOUND` |

> **Inconsistency hiện tại:** Auth module dùng named exports (không class), các module khác dùng class pattern. Khi implement module mới nên theo class pattern.

### 3.2 Response Format

```js
// Thành công
sendSuccess(res, { data, message?, status?: 200 })
// → { success: true, message?, data }

// Thất bại — throw AppError trong service
throw new AppError(message, statusCode, errorCode, errors?)
// errorHandler bắt → sendError()
// → { success: false, message, errorCode, errors? }
```

### 3.3 Error Handling Flow

1. Service/Repository throw `new AppError(msg, status, ERROR_CODES.DOMAIN.KEY)`
2. Controller: `catch (err) { next(err) }`
3. `errorHandler` middleware format → `sendError(res, {...})`

### 3.4 Auth Flow

- **Access Token:** JWT Bearer trong `Authorization: Bearer <token>` header, TTL ngắn (~15 phút)
- **Refresh Token:** JWT trong HttpOnly cookie `refreshToken`, TTL dài (~7 ngày)
- Middleware chain: `verifyToken` → gắn `req.user = { user_id, role }`
- Admin guard: `requireAdmin` → kiểm tra `req.user.role === 'admin'`
- Route pattern: `router.verb(path, verifyToken, requireAdmin?, validate(schema)?, controller.method)`

### 3.5 Validation

- Dùng **Zod** v4 với `validate(schema)` middleware factory
- Chỉ validate `req.body` (chưa có validator cho query params / route params)
- Lỗi → `400 VALIDATION_ERROR` kèm `errors[]` từng field `{ field, message }`

### 3.6 Database Pattern

- **mysql2** promise pool, singleton qua `getDB()`
- Không dùng ORM — raw SQL với parameterized queries (tránh SQL injection)
- Sort: dùng whitelist mapping `sortBy` → column name (tránh injection)
- Pagination: `getPagination(page, limit)` → `{ limit, offset, currentPage }`

---

## 4. Database Schema — Các bảng chính

### 4.1 Danh sách bảng

| Bảng | Mô tả | Ghi chú |
|---|---|---|
| `roles` | Phân quyền | `role_name` UNIQUE |
| `users` | Tài khoản người dùng | FK → `roles`; `username`, `email` UNIQUE |
| `addresses` | Địa chỉ giao hàng của user | FK → `users` CASCADE DELETE |
| `brands` | Thương hiệu | `brand_name` UNIQUE |
| `categories` | Danh mục sản phẩm | `category_name` UNIQUE, `slug` UNIQUE |
| `products` | Sản phẩm | FK → `brands`, `categories`; `slug` UNIQUE; `status` 1=active/0=hidden; `gender` enum(men/women/unisex/kids) |
| `product_images` | Ảnh sản phẩm | FK → `products` CASCADE; `is_primary`, `sort_order` |
| `product_variants` | Biến thể sản phẩm | FK → `products` CASCADE; `sku` UNIQUE; `variant_price` override `base_price`; `status` 1=active |
| `promotions` | Khuyến mãi sản phẩm trực tiếp | `discount_type` enum(PERCENTAGE/FIXED); `status` 1=active |
| `promotion_items` | Sản phẩm trong promotion | FK → `promotions`, `products` CASCADE; `discount_type`+`discount_value` per sản phẩm |
| `campaigns` | Chiến dịch khuyến mãi theo đơn | `campaign_type` enum(PERCENTAGE/FIXED_PRICE/TIER_DISCOUNT/FREESHIP); `status` 1=active |
| `campaign_config` | Cấu hình giảm giá của campaign | FK → `campaigns` CASCADE; `discount_value`: % hoặc giá đồng giá |
| `campaign_products` | Sản phẩm áp dụng campaign | FK → `campaigns`, `products` CASCADE; PK(`campaign_id`, `product_id`) |
| `campaign_tiers` | Bậc giảm theo ngưỡng đơn hàng | FK → `campaigns` CASCADE; `min_order_value` + `discount_value` (%) |
| `vouchers` | Mã giảm giá | `discount_type` enum(PERCENTAGE/FIXED/FREESHIP); `code` UNIQUE; có `usage_limit`, `user_usage_limit`, `max_discount_amount`, `min_order_value` |
| `voucher_usages` | Lịch sử dùng voucher | FK → `vouchers`, `users`, `orders`; per user per order |
| `carts` | Giỏ hàng | FK → `users` CASCADE; UNIQUE(`user_id`) — 1 user 1 cart |
| `cart_items` | Item trong giỏ hàng | FK → `carts` CASCADE, `product_variants`; UNIQUE(`cart_id`, `variant_id`) |
| `orders` | Đơn hàng | FK → `users`, `addresses` SET NULL, `vouchers`, `campaigns`; `status`: pending/confirmed/shipping/delivered/cancelled |
| `order_items` | Chi tiết đơn — snapshot | FK → `orders` CASCADE, `product_variants` RESTRICT; lưu snapshot tên/size/color/giá |
| `order_shipping_address` | Địa chỉ giao hàng snapshot | FK → `orders` CASCADE; lưu tên, SĐT, địa chỉ tại thời điểm đặt |

### 4.2 Chi tiết các cột quan trọng

#### `orders`
| Cột | Kiểu | Mô tả |
|---|---|---|
| `status` | varchar(30) | `pending` / `confirmed` / `shipping` / `delivered` / `cancelled` |
| `payment_status` | varchar(20) | `pending` / `paid` / ... |
| `subtotal` | decimal(12,2) | Tổng trước giảm giá |
| `discount_total` | decimal(12,2) | Giảm từ voucher |
| `campaign_discount_total` | decimal(12,2) | Giảm từ campaign |
| `shipping_fee` | decimal(12,2) | Phí vận chuyển |
| `total_amount` | decimal(12,2) | Tổng sau tất cả giảm giá |
| `cancelled_by` | varchar(10) | `user` hoặc `admin` |

#### `campaigns` — 4 loại campaign_type
| Loại | Bảng con | Mô tả |
|---|---|---|
| `PERCENTAGE` | `campaign_config` | Giảm % cố định cho các sản phẩm trong `campaign_products` |
| `FIXED_PRICE` | `campaign_config` | Đồng giá cho các sản phẩm trong `campaign_products` |
| `TIER_DISCOUNT` | `campaign_tiers` | Giảm % theo ngưỡng tổng tiền sản phẩm campaign |
| `FREESHIP` | *(không cần config)* | Miễn phí ship khi đơn có sản phẩm trong `campaign_products` |

#### `promotions` vs `campaigns`
| | `promotions` / `promotion_items` | `campaigns` |
|---|---|---|
| Phạm vi giảm | Trực tiếp trên giá sản phẩm | Áp dụng trên đơn hàng |
| Hiển thị | `sale_price` trên trang sản phẩm | `campaign_discount_total` trong đơn |
| API hiện tại | ⚠️ Chưa tích hợp vào API | ⚠️ Chưa tích hợp vào API |

---

## 5. Config & Environment Variables

| Biến | Mục đích |
|---|---|
| `PORT` | Port server (default: 8080) |
| `DB_HOST/PORT/NAME/USER/PASS` | MySQL connection |
| `JWT_ACCESS_SECRET` | Ký access token |
| `JWT_REFRESH_SECRET` | Ký refresh token |
| `JWT_ACCESS_EXPIRES_IN` | TTL access token |
| `JWT_REFRESH_EXPIRES_IN` | TTL refresh token |
| `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` | Upload ảnh |
| `ALLOWED_ORIGINS` | CORS whitelist (comma-separated) |

---

## 6. Known Bugs & Technical Debt

| # | Vấn đề | Nơi | Mức độ |
|---|---|---|---|
| 1 | `sale_price` **hardcode `null`** — không query từ promotions | `productService.js:23` | 🟡 Minor |
| 2 | `brandService.findAll({})` **truyền object** nhưng repo không nhận param | `brandService.js:12` | 🟡 Minor |

> Các vấn đề critical (chưa implement phase 1-9) và bug AppError, lỗi pagination count, typos đã được xử lý trong các đợt cập nhật gần đây.
