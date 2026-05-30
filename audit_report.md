# 🔍 Full-Stack Sync Audit Report — IS207 Store

**Stack:** Node.js/Express · Next.js (React) · MySQL  
**Schema:** 15 tables — `brands`, `campaign_config`, `campaign_products`, `campaign_tiers`, `campaigns`, `cart_items`, `carts`, `categories`, `order_items`, `order_shipping_address`, `orders`, `product_images`, `product_variants`, `products`, `roles`, `shipping_profiles`, `users`, `voucher_usages`, `vouchers`

---

## 🔴 CRITICAL
> Issues that will cause runtime errors, data loss, or broken features in production.

| # | Layer | Location | Issue | Detail |
|---|-------|----------|-------|--------|
| 1 | BE↔FE | `frontend/src/config/axios.js:80-83` | **Refresh token sent in JSON body but backend reads HttpOnly cookie** | The refresh interceptor calls `axios.post('/auth/refresh', { refreshToken })` where `refreshToken` is read from `localStorage`. However, `authController.refresh` reads `req.cookies?.refreshToken` (HttpOnly cookie set by `setRefreshTokenCookie`). The token in the JSON body is silently ignored. Every silent token refresh fails, causing all users to be forcibly logged out when their access token expires. |
| 2 | BE↔FE | `frontend/src/config/axios.js:100-101` | **Redirect loop on 401 — wrong login URL path** | On refresh failure the frontend redirects to `/auth/login`, but the Next.js login route is `/(auth)/login` which resolves to `/login`. Users are redirected to a 404 page instead of the login form. |
| 3 | BE↔FE | `frontend/src/constants/api.js:26` · `frontend/src/services/productService.js:14` | **`GET /products/slug/:slug` endpoint does not exist in backend** | `productService.getProductBySlug()` calls `API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)` → `/products/slug/${slug}`. The backend `productRoutes.js` has no `/slug/:slug` route; only `/:id`. Any page that calls `getProductBySlug` will receive a 404 from the backend. |
| 4 | BE↔FE | `frontend/src/constants/api.js:28` · `frontend/src/services/productService.js:21-22` | **`GET /products/featured` endpoint does not exist in backend** | `productService.getFeaturedProducts()` calls `PRODUCTS.FEATURED` → `/products/featured`. The `productRoutes.js` has no `/featured` route. This silently fails with a 404. |

---

## 🟡 WARNING
> Issues that indicate incomplete implementation or likely bugs under certain conditions.

| # | Layer | Location | Issue | Detail |
|---|-------|----------|-------|--------|
| 1 | BE↔FE | `backend/src/routes/adminRoutes.js:208-209` | **`PATCH /admin/orders/bulk-status` route shadowed by `/:id/status`** | Express registers `bulk-status` AFTER `/:id/status` at the same router level. When `PATCH /admin/orders/bulk-status` is requested, Express matches `/:id` first (treating `"bulk-status"` as an order ID), causing the request to fail or return unexpected errors. The bulk-status route must be registered BEFORE `/:id/status`. |
| 2 | BE↔FE | `frontend/src/services/orderService.js:25-27` | **`cancel_reason` field sent but backend ignores it** | `orderService.cancelOrder(id, reason)` POSTs `{ cancel_reason: reason }`. `orderController.cancelOrder` and `orderService.cancelOrder` ignore `req.body` entirely — the reason is never stored. The `orders` table also has no `cancel_reason` column. The field is silently discarded. |
| 3 | DB↔BE | `backend/src/repositories/productRepository.js:113` | **`sku` column omitted from variant query** | `findById` queries `product_variants` but doesn't SELECT `sku`. The `product_variants` table has a `sku` column. Admin and shop product detail pages that need SKU display will show `undefined`. |
| 4 | BE↔FE | `frontend/src/constants/api.js:64` | **`GET /vouchers/validate` endpoint does not exist in backend** | `API_ENDPOINTS.VOUCHERS.VALIDATE` is defined as `/vouchers/validate`, but `voucherRoutes.js` only has `/vouchers/active` (GET) and `/vouchers/apply` (POST). No code appears to call this endpoint currently, but its presence in the constants map is misleading and will cause a 404 if used. |
| 5 | BE↔FE | `frontend/src/constants/api.js:134` | **`PATCH /admin/orders/:id/payment-status` endpoint does not exist** | `ADMIN.ORDERS.UPDATE_PAYMENT` maps to `/admin/orders/${id}/payment-status`. No such route is registered in `adminRoutes.js`. Payment status is only updated indirectly via `updateStatus`. This endpoint will 404 if called. |
| 6 | BE↔FE | `frontend/src/app/(shop)/checkout/page.jsx:358` | **Double `data` unwrap for checkout response** | After `orderService.checkout()`, the frontend navigates to `response.data?.order_id ?? response.order_id`. The axios interceptor already unwraps to `response.data` (the full backend payload object). So `response` IS the backend data object. `response.data` here refers to `payload.data` (the nested `data` key), making the optional chain necessary but fragile. If `response.order_id` doesn't exist at the top level (backend wraps it under `data`), navigation may fail. Code should consistently use `response.data.order_id`. |

---

## 🔵 INFO
> Dead code, unused schema elements, or unlinked features — low urgency but worth tracking.

| # | Layer | Location | Issue | Detail |
|---|-------|----------|-------|--------|
| 1 | Unimplemented | `frontend/src/constants/api.js:77-83` | **`USER.*` endpoint group has no backend implementation** | `API_ENDPOINTS.USER` defines 7 endpoints (`/user/profile`, `/user/addresses`, `/user/wishlist`, etc.). None of these routes exist in the backend. Profile is handled by `/auth/me/profile`; addresses by `/auth/shipping-profiles`. These constants are dead code and will cause 404s if called. |
| 2 | Unimplemented | `frontend/src/constants/api.js:147-153` | **`ADMIN.USERS.*` endpoint group has no backend implementation** | Endpoints for `/admin/users`, `/admin/users/:id/role`, `/admin/users/:id/ban` are defined in constants but there is no matching backend route, controller, service, or repository. User management is entirely unimplemented. |
| 3 | Unimplemented | `frontend/src/services/productService.js:41-44` | **`getReviews` and `postReview` services have no backend route** | `productService` exposes `getReviews(id)` → `GET /products/:id/reviews` and `postReview(id, data)` → `POST /products/:id/reviews`. Neither route exists in `productRoutes.js`. There is also no reviews table in the database schema. Product reviews are a planned-but-not-implemented feature. |
| 4 | DB↔BE | `backend/src/validations/cardValidations.js` (0 bytes) | **Empty validation file** | `cardValidations.js` exists in the validations directory with 0 bytes. It appears to be a stale/accidental file (likely intended to be `cartValidations.js` which exists separately). Should be removed. |
| 5 | BE↔FE | `frontend/src/constants/api.js:48-51` | **`CART.*` endpoint constants are incorrect and unused** | `CART.ADD` = `/cart/items` (wrong — backend is `POST /cart`), `CART.UPDATE` = `/cart/items/:itemId` (wrong — backend is `PUT /cart/:itemId`), `CART.CLEAR` = `/cart/clear` (wrong — backend is `DELETE /cart`). The working `cartService.js` uses hardcoded correct paths directly (bypassing these constants entirely), making these constants dead and misleading. |
| 6 | Unimplemented | `frontend/src/constants/api.js:95` | **`ADMIN.DASHBOARD.STATS` points to wrong endpoint** | `ADMIN.DASHBOARD.STATS` = `/admin/dashboard/stats` but the backend route is `/admin/dashboard/summary`. This constant is unused (the `adminDashboardService.js` calls the correct hardcoded `/admin/dashboard/summary` path directly), but would 404 if ever used. |
| 7 | DB↔BE | `backend/src/controllers/admin/adminCampaignController.js:61` | **`generateDescription` validates `name` but not `campaign_type` or `discount_value` at controller level** | The endpoint skips Zod validation middleware and does manual field checking. `campaign_type` and `discount_value` are used in the response message but not validated for type/value — non-string types for `campaign_type` will not crash but produce garbled output. Low severity. |
| 8 | DB↔BE | `backend/src/repositories/orderRepository.js:116` | **`orders.order_date` column not in INSERT** | The `create` method inserts into `orders` without explicitly setting `order_date`. It relies on `DEFAULT CURRENT_TIMESTAMP`. This is correct by DB design, but `findAllByUser` SELECTs `order_date` and `getMyOrders` uses it for display. If a DB migration ever removes the DEFAULT, inserts would fail silently. Minor concern. |
| 9 | BE↔FE | `frontend/src/constants/api.js:108` | **`ADMIN.PRODUCTS.TOGGLE_STATUS` maps to wrong endpoint** | `TOGGLE_STATUS: (id) => /admin/products/${id}/toggle-status` but the backend route is `PATCH /admin/products/:id/status`. The `adminProductService.js` uses the correct `/admin/products/${id}/status` directly. The constant is dead but misleading. |

---

## 📊 Summary

| Metric | Count |
|--------|-------|
| **Total Critical** | 4 |
| **Total Warning** | 6 |
| **Total Info** | 9 |
| **Layers Most Affected** | BE↔FE |

### Recommended Fix Order

1. **[CRITICAL #1]** Fix the silent refresh token bug — change the axios refresh interceptor to NOT send `refreshToken` in the request body (the backend reads it from the HttpOnly cookie via `req.cookies.refreshToken`). Remove the `{ refreshToken }` body from the raw axios POST.

2. **[CRITICAL #2]** Fix redirect URL after failed refresh — change `/auth/login` to `/login` in `axios.js:100`.

3. **[WARNING #1]** Fix route ordering — move `PATCH /admin/orders/bulk-status` registration BEFORE `PATCH /admin/orders/:id/status` in `adminRoutes.js` to prevent route shadowing.

4. **[CRITICAL #3 & #4]** Add missing product routes to backend — add `GET /products/slug/:slug` and `GET /products/featured` to `productRoutes.js` (or update the frontend constants to point to the correct existing endpoints like `/:id` and `/new-arrivals`).

5. **[WARNING #6]** Fix double-unwrap of checkout redirect — standardize to `response.data.order_id`.

6. **[INFO #1 & #2]** Clean up dead `USER.*` and `ADMIN.USERS.*` endpoint constants, or implement the corresponding backend routes.

7. **[INFO #3]** Either implement the reviews system (DB table + BE route) or remove the dead `getReviews`/`postReview` service methods.

8. **[INFO #5]** Correct or delete the stale `CART.*` constants in `api.js` to prevent future developer confusion.

9. **[INFO #4]** Delete the empty `cardValidations.js` file.
