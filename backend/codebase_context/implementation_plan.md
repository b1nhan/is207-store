# Implementation Plan — IS207 Clothing Store Backend

> Kế hoạch implement theo thứ tự ưu tiên (dependency-first).  
> Cập nhật lần cuối: 2026-05-04

---

## Tổng quan thứ tự

- [x] Phase 0: Bugfix & Constants         (prerequisite cho mọi thứ)
- [x] Phase 1: Upload / Cloudinary        (prerequisite cho Admin Products)
- [x] Phase 2: Admin Products CRUD        (prerequisite cho Admin CRUD)
- [x] Phase 3: Admin Category/Brand CRUD  (dùng chung upload)
- [x] Phase 4: Cart                       (prerequisite cho Checkout)
- [x] Phase 5: Vouchers                   (prerequisite cho Checkout)
- [x] Phase 6: Orders / Checkout          (depends on Cart + Vouchers)
- [x] Phase 7: Admin Orders               (depends on Orders)
- [x] Phase 8: Admin Dashboard            (depends on Orders)
- [x] Phase 9: Admin Vouchers             (dùng chung voucher logic)

---

## Phase 0 — Bugfix & Constants

### 0.1 Fix bug AppError args trong categoryService

**Mục đích:** Sửa lỗi trả sai HTTP status khi category không tồn tại  
**Độ phức tạp:** S

**File cần chỉnh sửa:**
- `src/services/categoryService.js` (line 40)

**Bước thực hiện:**
```js
// TRƯỚC (sai thứ tự args):
throw new AppError(ERROR_CODES.NOT_FOUND, 'Danh mục không tồn tại', 404);

// SAU (đúng: message, statusCode, errorCode):
throw new AppError('Danh mục không tồn tại', 404, ERROR_CODES.CATEGORY.NOT_FOUND);
```

---

### 0.2 Fix pagination count query trong productRepository

**Mục đích:** `totalItems` phải phản ánh đúng số kết quả sau khi filter  
**Độ phức tạp:** S

**File cần chỉnh sửa:**
- `src/repositories/productRepository.js`

**Bước thực hiện:**
- Build `countQuery` song song với main query, áp dụng cùng bộ WHERE conditions
- Tách params thành `filterParams` (cho WHERE) và append `limit/offset` riêng

---

### 0.3 Điền constants còn trống

**Mục đích:** Cung cấp constants dùng trong service layer  
**Độ phức tạp:** S

**File cần tạo/chỉnh sửa:**
- `src/constants/orderStatus.js`
- `src/constants/voucherType.js`

```js
// orderStatus.js
const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
});
export default ORDER_STATUS;

// voucherType.js
const VOUCHER_TYPE = Object.freeze({
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED',
  FREESHIP: 'FREESHIP',
});
export default VOUCHER_TYPE;
```

---

## Phase 1 — Upload / Cloudinary

### 1.1 Cloudinary Config & Upload Service

**Mục đích:** Cho phép admin upload ảnh sản phẩm lên Cloudinary  
**Độ phức tạp:** M  
**Dependency:** Biến môi trường CLOUDINARY_* phải có trong `.env`

**File cần tạo/chỉnh sửa:**
1. `src/config/cloudinary.js` — init SDK
2. `src/middlewares/uploadMiddleware.js` — Multer memoryStorage, filter image type, limit 5MB
3. `src/services/uploadService.js` — upload stream to Cloudinary, delete by publicId
4. `src/controllers/uploadController.js` — `uploadImage`, `deleteImage`
5. `src/routes/uploadRoutes.js` — mount 2 endpoints
6. `src/routes/index.js` — uncomment `/upload` route

**Bước thực hiện:**

```js
// 1. config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, ... });
export default cloudinary;

// 2. uploadMiddleware.js
import multer from 'multer';
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) {
      return cb(new AppError('Định dạng không hỗ trợ', 400, 'IMAGE_INVALID_FORMAT'));
    }
    cb(null, true);
  }
});
export default upload;

// 3. uploadService.js
// uploadImage(buffer, mimetype) → { url, publicId }
// deleteImage(publicId) → void

// 4. uploadController.js
// POST /upload/image: multer middleware → uploadService.uploadImage → sendSuccess
// DELETE /upload/image: body.publicId → uploadService.deleteImage → sendSuccess

// 5. uploadRoutes.js
// POST '/'  → verifyToken, requireAdmin, upload.single('image'), uploadController.uploadImage
// DELETE '/' → verifyToken, requireAdmin, uploadController.deleteImage
```

---

## Phase 2 — Admin Products CRUD

### 2.1 Admin Product Repository

**Mục đích:** Data access cho admin — không filter theo status, hỗ trợ CRUD  
**Độ phức tạp:** M  
**Dependency:** Phase 0.2 (pagination fix)

**File cần tạo:**
- `src/repositories/admin/adminProductRepository.js`
- `src/repositories/productVariantRepository.js`
- `src/repositories/productImageRepository.js`

**Các methods cần implement:**

```js
// adminProductRepository.js
findAll({ limit, offset, search, status, category, brand }) // kể cả INACTIVE
findById(id)         // kể cả INACTIVE
create(dto)          // INSERT products
update(id, dto)      // UPDATE products
updateStatus(id, status) // PATCH status

// productVariantRepository.js
findByProductId(productId)
create(productId, variantDto) // INSERT product_variants
update(variantId, dto)        // UPDATE
delete(variantId)             // DELETE

// productImageRepository.js
findByProductId(productId)
create(productId, imageDto)   // INSERT
delete(imageId)               // DELETE
setPrimary(imageId, productId) // UPDATE is_primary
```

---

### 2.2 Admin Product Validation

**Mục đích:** Validate body khi tạo/update sản phẩm  
**Độ phức tạp:** M

**File cần tạo:**
- `src/validations/productValidations.js`

```js
// Các schemas cần có:
export const createProductSchema = z.object({
  product_name: z.string().min(1).max(100),
  product_description: z.string().optional(),
  material: z.string().optional(),
  gender: z.enum(['men', 'women', 'unisex', 'kids']),
  base_price: z.number().positive(),
  brand_id: z.number().int().positive().optional(),
  category_id: z.number().int().positive().optional(),
  slug: z.string().min(1).max(255),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  size: z.string().min(1).max(20),
  color: z.string().min(1).max(30),
  stock_quantity: z.number().int().min(0),
  variant_price: z.number().positive().optional(),
  sku: z.string().max(50).optional(),
});

export const updateVariantSchema = createVariantSchema.partial();
```

---

### 2.3 Admin Product Service

**Mục đích:** Business logic CRUD sản phẩm cho admin  
**Độ phức tạp:** M

**File cần tạo:**
- `src/services/admin/adminProductService.js`

**Logic cần implement:**
- `getAllProducts(queryParams)` — trả cả INACTIVE, pagination đúng
- `getProductById(id)` — trả full detail kể cả INACTIVE
- `createProduct(dto)` — kiểm tra trùng slug, insert, trả full product
- `updateProduct(id, dto)` — kiểm tra tồn tại, update
- `updateStatus(id, status)` — toggle active/inactive
- `addVariant(productId, dto)` — insert variant
- `updateVariant(variantId, dto)` — kiểm tra tồn tại, update
- `deleteVariant(variantId)` — kiểm tra tồn tại, delete

---

### 2.4 Admin Product Controller & Routes

**Mục đích:** Expose admin product endpoints  
**Độ phức tạp:** M

**File cần tạo/chỉnh sửa:**
- `src/controllers/admin/adminProductController.js`
- `src/routes/adminRoutes.js`
- `src/routes/index.js` — uncomment `/admin` route

**Endpoints cần mount:**
```js
router.get('/products', verifyToken, requireAdmin, adminProductController.getAllProducts);
router.get('/products/:id', verifyToken, requireAdmin, adminProductController.getProductById);
router.post('/products', verifyToken, requireAdmin, validate(createProductSchema), adminProductController.createProduct);
router.put('/products/:id', verifyToken, requireAdmin, validate(updateProductSchema), adminProductController.updateProduct);
router.patch('/products/:id/status', verifyToken, requireAdmin, adminProductController.updateStatus);
router.post('/products/:id/variants', verifyToken, requireAdmin, validate(createVariantSchema), adminProductController.addVariant);
router.put('/products/variants/:variantId', verifyToken, requireAdmin, validate(updateVariantSchema), adminProductController.updateVariant);
router.delete('/products/variants/:variantId', verifyToken, requireAdmin, adminProductController.deleteVariant);
```

---

## Phase 3 — Admin Category & Brand CRUD

### 3.1 Admin Category CRUD

**Mục đích:** Cho admin tạo/sửa/xóa danh mục  
**Độ phức tạp:** S  
**Dependency:** Phase 2 (adminRoutes.js đã có)

**File cần chỉnh sửa:**
- `src/repositories/categoryRepository.js` — thêm `create`, `update`, `delete`, `findById`, `findByName`
- `src/services/categoryService.js` — thêm `createCategory`, `updateCategory`, `deleteCategory`
- `src/controllers/categoryController.js` — thêm `create`, `update`, `delete` methods
- `src/routes/categoryRoutes.js` — thêm POST/PUT/DELETE routes
- `src/validations/` — tạo `categoryValidations.js` với `createCategorySchema`, `updateCategorySchema`

**Logic đặc biệt:**
- `DELETE`: kiểm tra `product_count > 0` → throw `CATEGORY_HAS_PRODUCTS`
- `POST`/`PUT`: kiểm tra trùng tên và slug → throw `CATEGORY_NAME_ALREADY_EXISTS`

---

### 3.2 Admin Brand CRUD

**Mục đích:** Cho admin tạo/sửa/xóa thương hiệu  
**Độ phức tạp:** S

**File cần chỉnh sửa:**
- `src/repositories/brandRepository.js` — thêm `create`, `update`, `delete`, `findByName`
- `src/services/brandService.js` — thêm `createBrand`, `updateBrand`, `deleteBrand`
- `src/controllers/brandController.js` — thêm `create`, `update`, `delete` methods
- `src/routes/brandRoutes.js` — thêm POST/PUT/DELETE routes

**Logic đặc biệt:**
- `DELETE`: kiểm tra brand còn sản phẩm → throw `BRAND_HAS_PRODUCTS`
- `POST`/`PUT`: kiểm tra trùng tên → throw `BRAND_NAME_ALREADY_EXISTS`

---

## Phase 4 — Cart

### 4.1 Cart Repository

**Mục đích:** CRUD giỏ hàng với auto-create cart nếu user chưa có  
**Độ phức tạp:** M  
**Dependency:** Phase 0

**File cần tạo:**
- `src/repositories/cartRepository.js`

**Các methods cần implement:**
```js
findCartByUserId(userId)          // SELECT cart
createCart(userId)                // INSERT cart (auto khi user lần đầu)
findCartWithItems(userId)         // JOIN cart_items + variants + products
findCartItem(cartId, cartItemId)  // SELECT single item
addItem(cartId, variantId, qty)   // INSERT hoặc ON DUPLICATE KEY UPDATE quantity
updateItemQuantity(cartItemId, qty) // UPDATE
removeItem(cartItemId)            // DELETE single
clearCart(cartId)                 // DELETE all items
```

---

### 4.2 Cart Service

**Mục đích:** Validate business rules cho giỏ hàng  
**Độ phức tạp:** M

**File cần tạo:**
- `src/services/cartService.js`

**Logic cần implement:**
- `getCart(userId)` — lấy hoặc tạo cart, format response
- `addToCart(userId, { variant_id, quantity })`:
  - Kiểm tra variant tồn tại và còn active
  - Kiểm tra stock: `quantity <= stock_quantity` → INSUFFICIENT_STOCK
  - Kiểm tra product active → CART_ITEM_UNAVAILABLE
  - Upsert (nếu đã có item thì cộng dồn quantity)
- `updateCartItem(userId, itemId, { quantity })`:
  - Kiểm tra item thuộc cart của user → CART_ITEM_NOT_FOUND
  - Kiểm tra stock với quantity mới → INSUFFICIENT_STOCK
- `removeCartItem(userId, itemId)` — kiểm tra ownership
- `clearCart(userId)` — xóa toàn bộ items

---

### 4.3 Cart Validation, Controller & Routes

**Mục đích:** Expose cart endpoints  
**Độ phức tạp:** S

**File cần tạo/chỉnh sửa:**
- `src/validations/cartValidations.js` (rename từ `cardValidations.js`):
  ```js
  export const addCartItemSchema = z.object({
    variant_id: z.number().int().positive(),
    quantity: z.number().int().positive().max(99),
  });
  export const updateCartItemSchema = z.object({
    quantity: z.number().int().positive().max(99),
  });
  ```
- `src/controllers/cartController.js`
- `src/routes/cartRoutes.js`
- `src/routes/index.js` — uncomment `/cart` route

---

## Phase 5 — Vouchers

### 5.1 Voucher Repository

**Mục đích:** CRUD voucher + track usage  
**Độ phức tạp:** M  
**Dependency:** Phase 0 (voucherType.js constants)

**File cần tạo:**
- `src/repositories/voucherRepository.js`

**Các methods cần implement:**
```js
findByCode(code)              // SELECT voucher by code
findById(id)                  // SELECT by id
findAll({ limit, offset })    // Admin: tất cả vouchers
findActive(userId)            // User: vouchers hiệu lực + user chưa dùng hết
countUserUsage(voucherId, userId) // COUNT từ voucher_usages
create(dto)                   // INSERT
update(id, dto)               // UPDATE
delete(id)                    // DELETE (soft delete: set is_active=0)
```

---

### 5.2 Voucher Service

**Mục đích:** Validate voucher và tính discount  
**Độ phức tạp:** M

**File cần tạo:**
- `src/services/voucherService.js`

**Logic cần implement:**
- `applyVoucher(userId, { code, subtotal })` — **core business logic**:
  1. Tìm voucher → NOT_FOUND
  2. Kiểm tra `is_active` → VOUCHER_INACTIVE
  3. Kiểm tra `start_date <= now` → VOUCHER_NOT_STARTED
  4. Kiểm tra `expiry_date >= now` → VOUCHER_EXPIRED
  5. Kiểm tra `used_count < usage_limit` → VOUCHER_LIMIT_REACHED
  6. Kiểm tra user usage count → VOUCHER_USER_LIMIT_REACHED
  7. Kiểm tra `subtotal >= min_order_value` → VOUCHER_MIN_ORDER_NOT_MET
  8. Tính `discountAmount` theo type (PERCENTAGE/FIXED/FREESHIP)
  9. Áp dụng `max_discount_amount` cap nếu có
  10. Trả về `{ voucher_id, code, discount_amount, discount_type }`

- `getActiveVouchers(userId)` — lọc vouchers user có thể dùng
- Admin CRUD: `createVoucher`, `updateVoucher`, `deleteVoucher`, `getAll`, `getById`

---

### 5.3 Voucher Validation, Controller & Routes

**Độ phức tạp:** S

**File cần tạo/chỉnh sửa:**
- `src/validations/voucherValidations.js`
- `src/controllers/voucherController.js`
- `src/routes/voucherRoutes.js`
- `src/routes/index.js` — uncomment `/vouchers` route

---

## Phase 6 — Orders / Checkout

### 6.1 Order Repository

**Mục đích:** CRUD đơn hàng, checkout transaction  
**Độ phức tạp:** L  
**Dependency:** Phase 4 (Cart), Phase 5 (Vouchers)

**File cần tạo:**
- `src/repositories/orderRepository.js`
- `src/repositories/orderItemRepository.js`

**Các methods cần implement:**
```js
// orderRepository.js
findById(orderId)
findByIdAndUser(orderId, userId)
findAllByUser(userId, { limit, offset })
create(orderDto)          // INSERT orders
updateStatus(orderId, status, cancelledBy?)

// orderItemRepository.js
createMany(items)         // INSERT order_items (bulk)
findByOrderId(orderId)    // SELECT với snapshot fields
```

---

### 6.2 Order Service — Checkout

**Mục đích:** Xử lý checkout toàn bộ — validation, stock deduction, voucher usage  
**Độ phức tạp:** L

**File cần tạo:**
- `src/services/orderService.js`

**Logic checkout (`placeOrder`) — phải atomic:**
1. Lấy cart items của user → CART_EMPTY nếu rỗng
2. Validate từng item: variant active? product active? → CART_ITEM_UNAVAILABLE
3. Kiểm tra stock từng item → INSUFFICIENT_STOCK
4. Tính `subtotal` từ cart items (dùng `variant_price || base_price`)
5. Validate địa chỉ giao hàng (address_id thuộc user)
6. Apply voucher nếu có (gọi voucherService.applyVoucher)
7. Tính `total_amount = subtotal - discount + shipping_fee`
8. **Transaction:**
   - INSERT order
   - INSERT order_items (snapshot: product_name, size, color, unit_price)
   - INSERT order_shipping_address
   - UPDATE stock: `stock_quantity -= quantity` cho từng variant
   - Nếu voucher: INSERT voucher_usages, UPDATE vouchers.used_count
   - DELETE cart_items (clear cart)
9. Trả về order detail

**Logic user cancel:**
- Kiểm tra `status === 'pending'` → ORDER_CANNOT_CANCEL
- UPDATE status = 'cancelled', cancelled_by = 'USER'
- **Restore stock** (roll back stock_quantity)

---

### 6.3 Order Validation, Controller & Routes

**Độ phức tạp:** M

**File cần tạo/chỉnh sửa:**
- `src/validations/orderValidations.js`:
  ```js
  export const checkoutSchema = z.object({
    address_id: z.number().int().positive(),
    voucher_code: z.string().optional(),
    receiver_name: z.string().min(1).max(100),
    receiver_phone: z.string().regex(/^0\d{9}$/),
    full_address: z.string().min(1),
  });
  ```
- `src/controllers/orderController.js`
- `src/routes/orderRoutes.js`
- `src/routes/index.js` — uncomment `/orders` route

---

## Phase 7 — Admin Orders

### 7.1 Admin Order Repository & Service

**Mục đích:** Admin xem và cập nhật trạng thái bất kỳ đơn hàng  
**Độ phức tạp:** M  
**Dependency:** Phase 6 (Orders)

**File cần tạo:**
- `src/repositories/admin/adminOrderRepository.js`
- `src/services/admin/adminOrderService.js`
- `src/controllers/admin/adminOrderController.js`

**Endpoints:**
- `GET /admin/orders` — tất cả đơn, có filter theo status, user, date range; pagination
- `GET /admin/orders/:id` — full detail kể cả items, shipping, user info
- `PATCH /admin/orders/:id/status` — valid transitions:
  - `pending` → `confirmed`
  - `confirmed` → `shipping`
  - `shipping` → `delivered`
  - Bất kỳ → `cancelled` (admin) — restore stock + set `cancelled_by = 'ADMIN'`

**Status transition validation:**
```js
const VALID_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipping', 'cancelled'],
  shipping: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};
```

---

## Phase 8 — Admin Dashboard

### 8.1 Dashboard Analytics

**Mục đích:** Thống kê tổng quan cho admin  
**Độ phức tạp:** M  
**Dependency:** Phase 6 & 7 (Orders)

**File cần tạo:**
- `src/repositories/admin/adminDashboardRepository.js`
- `src/services/admin/adminDashboardService.js`
- `src/controllers/admin/adminDashboardController.js`

**Các queries cần implement:**

```js
// adminDashboardRepository.js

getSummary()
// SELECT:
//   COUNT(DISTINCT user_id) as total_users,
//   COUNT(*) as total_orders,
//   SUM(total_amount) WHERE status='delivered' as total_revenue,
//   COUNT(*) WHERE status='pending' as pending_orders
// FROM orders

getRevenue({ from, to, groupBy: 'day'|'month' })
// SELECT DATE_FORMAT(order_date, '%Y-%m-%d') as date,
//        SUM(total_amount) as revenue, COUNT(*) as orders
// FROM orders WHERE status='delivered' AND order_date BETWEEN ? AND ?
// GROUP BY date ORDER BY date

getTopProducts({ limit: 10, from, to })
// SELECT p.product_name, SUM(oi.quantity) as sold_quantity,
//        SUM(oi.line_total) as total_revenue
// FROM order_items oi JOIN product_variants pv ... JOIN products p ...
// JOIN orders o WHERE o.status='delivered'
// GROUP BY p.product_id ORDER BY sold_quantity DESC LIMIT ?
```

---

## Phase 9 — Admin Vouchers

### 9.1 Admin Voucher Controller & Routes

**Mục đích:** Admin CRUD vouchers  
**Độ phức tạp:** S  
**Dependency:** Phase 5 (Vouchers — service đã có CRUD logic)

**File cần tạo:**
- `src/controllers/admin/adminVoucherController.js`
- Tích hợp vào `src/routes/adminRoutes.js`
- `src/validations/voucherValidations.js` — thêm `createVoucherSchema`, `updateVoucherSchema`

```js
export const createVoucherSchema = z.object({
  code: z.string().min(1).max(20).toUpperCase(),
  discount_type: z.enum(['PERCENTAGE', 'FIXED', 'FREESHIP']),
  discount_value: z.number().positive(),
  max_discount_amount: z.number().positive().optional(),
  min_order_value: z.number().min(0).default(0),
  usage_limit: z.number().int().positive(),
  user_usage_limit: z.number().int().positive().default(1),
  start_date: z.string().datetime().optional(),
  expiry_date: z.string().datetime(),
  description: z.string().max(255).optional(),
});
```

---

## Dependency Graph

```
Phase 0 (Bugfix)
    │
    ├── Phase 1 (Upload)
    │       │
    │       └── Phase 2 (Admin Products) ──── Phase 3 (Admin CRUD)
    │
    ├── Phase 4 (Cart)
    │       │
    ├── Phase 5 (Vouchers)
    │       │
    │       └── Phase 6 (Orders/Checkout) ──── Phase 7 (Admin Orders) ──── Phase 8 (Dashboard)
    │                                      └── Phase 9 (Admin Vouchers)
```

---

## Ước tính tổng

| Phase | Tên | Độ phức tạp | File cần tạo/sửa |
|---|---|---|---|
| 0 | Bugfix & Constants | S | 4 files |
| 1 | Upload/Cloudinary | M | 5 files |
| 2 | Admin Products CRUD | L | 7 files |
| 3 | Admin Category/Brand CRUD | S | 6 files |
| 4 | Cart | M | 4 files |
| 5 | Vouchers | M | 5 files |
| 6 | Orders/Checkout | L | 5 files |
| 7 | Admin Orders | M | 3 files |
| 8 | Admin Dashboard | M | 3 files |
| 9 | Admin Vouchers | S | 2 files |
