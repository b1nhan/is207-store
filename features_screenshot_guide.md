# 📸 Hướng Dẫn Screenshot Tính Năng - IS207 Clothing E-Commerce

> **Stack:** React/Next.js (Frontend) · Node.js/Express (Backend) · MySQL  
> **Tích hợp:** Groq AI · Cloudinary · Nodemailer SMTP

---

## 📋 DANH MỤC

1. [Nhóm: Xác thực & Tài khoản người dùng](#1-nhóm-xác-thực--tài-khoản-người-dùng)
2. [Nhóm: Sản phẩm & Danh mục (User)](#2-nhóm-sản-phẩm--danh-mục-user)
3. [Nhóm: Giỏ hàng & Thanh toán](#3-nhóm-giỏ-hàng--thanh-toán)
4. [Nhóm: Đơn hàng (User)](#4-nhóm-đơn-hàng-user)
5. [Nhóm: Trang chủ & Campaigns (User)](#5-nhóm-trang-chủ--campaigns-user)
6. [Nhóm: Admin - Dashboard](#6-nhóm-admin---dashboard)
7. [Nhóm: Admin - Quản lý sản phẩm](#7-nhóm-admin---quản-lý-sản-phẩm)
8. [Nhóm: Admin - Quản lý đơn hàng](#8-nhóm-admin---quản-lý-đơn-hàng)
9. [Nhóm: Admin - Voucher & Campaign](#9-nhóm-admin---voucher--campaign)
10. [Nhóm: Admin - Danh mục & Thương hiệu](#10-nhóm-admin---danh-mục--thương-hiệu)
11. [Nhóm: Tính năng hệ thống (ẩn/tự động)](#11-nhóm-tính-năng-hệ-thống-ẩntự-động)

---

## 1. Nhóm: Xác thực & Tài khoản người dùng

### 1.1 Đăng ký tài khoản (`feat_usr_auth_register`)
- **URL:** `/(auth)/register`
- **Mô tả:** Form đăng ký tài khoản mới với các trường username, email, mật khẩu.
- **Cần screenshot:**
  - [x] Trang đăng ký trống (hiển thị form đầy đủ)
  - [x] Form đã điền thông tin hợp lệ (trước khi submit)
  - [ ] Thông báo lỗi validation (nếu có)

---

### 1.2 Đăng nhập (`feat_usr_auth_login`)
- **URL:** `/(auth)/login`
- **Mô tả:** Form đăng nhập bằng email/username và mật khẩu. Hệ thống trả về JWT access token + refresh token.
- **Cần screenshot:**
  - [x] Trang đăng nhập (form trống)
  - [x] Form đã điền thông tin

---

### 1.3 Trang hồ sơ cá nhân (`feat_usr_profile_view` + `feat_usr_profile_update`)
- **URL:** `/(shop)/profile`
- **Mô tả:** Xem và chỉnh sửa thông tin cá nhân (tên, email, số điện thoại, avatar,...).
- **Cần screenshot:**
  - [x] Tab thông tin cá nhân (chế độ xem)
  - [ ] Form chỉnh sửa thông tin đang mở

---

### 1.4 Đổi mật khẩu (`feat_usr_change_password`)
- **URL:** `/(shop)/profile` (tab đổi mật khẩu)
- **Mô tả:** Form cho phép người dùng đổi mật khẩu hiện tại sang mật khẩu mới.
- **Cần screenshot:**
  - [ ] Tab / section đổi mật khẩu với các trường nhập

---

### 1.5 Quản lý địa chỉ giao hàng (`feat_usr_shipping_crud` + `feat_usr_shipping_default`)
- **URL:** `/(shop)/profile` (tab địa chỉ)
- **Mô tả:** Thêm, sửa, xóa địa chỉ giao hàng. Đặt một địa chỉ làm mặc định (sẽ tự điền khi checkout).
- **Cần screenshot:**
  - [ ] Danh sách địa chỉ giao hàng đã lưu (có badge "Mặc định")
  - [ ] Form thêm/sửa địa chỉ đang mở
  - [ ] Nút "Đặt làm mặc định"

---

## 2. Nhóm: Sản phẩm & Danh mục (User)

### 2.1 Danh sách sản phẩm với lọc & phân trang (`feat_usr_prod_list` + `feat_usr_prod_filter`)
- **URL:** `/(shop)/products`
- **Mô tả:** Hiển thị danh sách sản phẩm active với:
  - Lọc theo: danh mục, thương hiệu, giới tính, khoảng giá
  - Sắp xếp theo: giá, mới nhất, bán chạy
  - Phân trang phía server
- **Cần screenshot:**
  - [x] Trang danh sách sản phẩm (lưới sản phẩm, sidebar lọc)
  - [ ] Đã chọn bộ lọc (ví dụ: lọc theo danh mục + sắp xếp)
  - [ ] Phân trang ở dưới cùng

---

### 2.2 Tìm kiếm sản phẩm (`feat_usr_prod_search`)
- **URL:** Thanh search trên navbar (autocomplete)
- **Mô tả:** Tìm kiếm realtime với gợi ý autocomplete khi người dùng gõ tên sản phẩm.
- **Cần screenshot:**
  - [ ] Thanh search với từ khóa đang nhập và dropdown gợi ý hiện ra

---

### 2.3 Chi tiết sản phẩm (`feat_usr_prod_detail`)
- **URL:** `/(shop)/products/[slug]`
- **Mô tả:** Trang chi tiết hiển thị: ảnh sản phẩm (gallery), mô tả, giá, các biến thể (size/màu), nút thêm giỏ hàng, nút Mua ngay.
- **Cần screenshot:**
  - [ ] Toàn bộ trang chi tiết sản phẩm (ảnh + thông tin)
  - [ ] Section chọn biến thể (size, màu sắc)
  - [ ] Nút "Thêm vào giỏ" và "Mua ngay"

---

### 2.4 Sản phẩm liên quan (`feat_usr_prod_related`)
- **URL:** `/(shop)/products/[slug]` (phía dưới trang)
- **Mô tả:** Hiển thị các sản phẩm cùng danh mục để cross-sell.
- **Cần screenshot:**
  - [ ] Section "Sản phẩm liên quan" cuối trang chi tiết sản phẩm

---

### 2.5 Danh sách sản phẩm đặc biệt (`feat_usr_prod_special`)
- **URL:** Homepage hoặc trang riêng
- **Mô tả:** 3 danh sách đặc biệt: **New Arrivals** (mới nhất), **Best Sellers** (bán chạy), **Hot Products** (nổi bật).
- **Cần screenshot:**
  - [ ] Section "Hàng mới về" trên homepage
  - [ ] Section "Bán chạy nhất" trên homepage

---

### 2.6 Danh sách danh mục (`feat_usr_cat_list`)
- **URL:** `/(shop)/category`
- **Mô tả:** Hiển thị tất cả danh mục sản phẩm đang có.
- **Cần screenshot:**
  - [x] Trang danh mục (lưới các danh mục)

---

## 3. Nhóm: Giỏ hàng & Thanh toán

### 3.1 Quản lý giỏ hàng (`feat_usr_cart_manage`)
- **URL:** `/(shop)/cart`
- **Mô tả:** Xem giỏ hàng, cập nhật số lượng, thay đổi variant, xóa sản phẩm, xóa toàn bộ giỏ.
- **Cần screenshot:**
  - [x] Trang giỏ hàng có sản phẩm (hiển thị tên, ảnh, giá, số lượng)
  - [ ] Nút tăng/giảm số lượng
  - [ ] Tổng tiền cuối trang

---

### 3.2 Áp dụng voucher (`feat_usr_vouch_apply`)
- **URL:** `/(shop)/cart` hoặc `/(shop)/checkout`
- **Mô tả:** Nhập mã voucher để được giảm giá. Hệ thống validate và hiển thị số tiền giảm.
- **Cần screenshot:**
  - [ ] Ô nhập mã voucher
  - [ ] Sau khi áp dụng thành công (hiển thị tên voucher + số tiền giảm)

---

### 3.3 Xem voucher hiện có (`feat_usr_vouch_active`)
- **Mô tả:** Danh sách voucher đang active mà người dùng có thể dùng.
- **Cần screenshot:**
  - [ ] Popup/danh sách voucher khả dụng (nếu có UI)

---

### 3.4 Preview thanh toán (`feat_usr_ord_preview`)
- **URL:** `/(shop)/checkout`
- **Mô tả:** Trang checkout hiển thị: địa chỉ giao hàng, danh sách sản phẩm, chiết khấu campaign tự động, voucher, phí ship, tổng tiền cuối.
- **Cần screenshot:**
  - [ ] Toàn bộ trang checkout (địa chỉ + sản phẩm + bảng tổng tiền)
  - [ ] Section hiển thị discount từ campaign
  - [ ] Section hiển thị discount từ voucher
  - [ ] Thông báo "Giá đã thay đổi" (nếu có price change detection)

---

### 3.5 Đặt hàng (`feat_usr_ord_place`)
- **URL:** `/(shop)/checkout`
- **Mô tả:** Submit đơn hàng. Hệ thống trừ kho, lưu snapshot giá, gửi email thông báo.
- **Cần screenshot:**
  - [ ] Nút "Đặt hàng" / "Xác nhận đặt hàng"
  - [ ] Trang/thông báo xác nhận đặt hàng thành công

---

### 3.6 Mua ngay (Direct Checkout) (`feat_usr_buy_now`)
- **URL:** `/(shop)/products/[slug]` → `/(shop)/checkout`
- **Mô tả:** Mua trực tiếp 1 sản phẩm không qua giỏ hàng. Chọn variant → bấm "Mua ngay" → vào trang checkout với sản phẩm đó.
- **Cần screenshot:**
  - [ ] Nút "Mua ngay" trên trang chi tiết sản phẩm
  - [ ] Trang checkout với sản phẩm từ "Mua ngay"

---

## 4. Nhóm: Đơn hàng (User)

### 4.1 Lịch sử đơn hàng (`feat_usr_ord_list`)
- **URL:** `/(shop)/orders`
- **Mô tả:** Danh sách tất cả đơn hàng của người dùng hiện tại, có trạng thái (pending, confirmed, shipping, delivered, cancelled).
- **Cần screenshot:**
  - [x] Trang danh sách đơn hàng (nhiều đơn, các trạng thái khác nhau)

---

### 4.2 Chi tiết đơn hàng (`feat_usr_ord_detail`)
- **URL:** `/(shop)/orders/[id]`
- **Mô tả:** Chi tiết 1 đơn hàng: sản phẩm (snapshot tên/giá/size/màu), địa chỉ giao hàng (snapshot), tổng tiền, trạng thái.
- **Cần screenshot:**
  - [ ] Trang chi tiết đơn hàng đầy đủ

---

### 4.3 Hủy đơn hàng (`feat_usr_ord_cancel`)
- **URL:** `/(shop)/orders` hoặc `/(shop)/orders/[id]`
- **Mô tả:** Người dùng có thể hủy đơn khi đơn còn ở trạng thái **pending**. Hủy thành công → kho được hoàn lại, email thông báo được gửi.
- **Cần screenshot:**
  - [ ] Nút "Hủy đơn" trên đơn pending
  - [ ] Dialog/confirm xác nhận hủy
  - [ ] Đơn sau khi hủy (trạng thái = cancelled)

---

## 5. Nhóm: Trang chủ & Campaigns (User)

### 5.1 Trang chủ (`feat_usr_homepage`)
- **URL:** `/(shop)/`
- **Mô tả:** SSR homepage gồm: Hero Banner, lưới danh mục, banner campaign đang active, section hàng mới, section hàng giảm giá.
- **Cần screenshot:**
  - [x] Hero section (banner đầu trang)
  - [ ] Lưới danh mục (category grid)
  - [ ] Banner campaign đang active
  - [ ] Section sản phẩm mới / sản phẩm giảm giá

---

### 5.2 Trang campaign & sản phẩm giảm giá (`feat_usr_camp_view`)
- **URL:** `/(shop)/campaigns`
- **Mô tả:** Hiển thị các campaign đang active và danh sách sản phẩm được giảm giá trong campaign đó.
- **Cần screenshot:**
  - [x] Trang campaigns (danh sách campaign)
  - [ ] Sản phẩm trong campaign (giá gốc vs giá sau giảm)

---

## 6. Nhóm: Admin - Dashboard

### 6.1 Admin Dashboard (`feat_adm_dash_view`)
- **URL:** `/(admin)/admin/`
- **Mô tả:** Trang tổng quan cho admin gồm: thống kê doanh thu, số đơn hàng theo trạng thái, top sản phẩm bán chạy, biểu đồ.
- **Cần screenshot:**
  - [x] Toàn bộ Dashboard (cards thống kê + biểu đồ)
  - [ ] Bảng top sản phẩm bán chạy
  - [ ] Thống kê doanh thu (theo tuần/tháng nếu có)

---

## 7. Nhóm: Admin - Quản lý sản phẩm

### 7.1 Danh sách & quản lý sản phẩm (`feat_adm_prod_crud`)
- **URL:** `/(admin)/admin/products`
- **Mô tả:** Bảng danh sách sản phẩm. Admin có thể tạo mới, sửa, bật/tắt trạng thái active.
- **Cần screenshot:**
  - [x] Bảng danh sách sản phẩm (tên, danh mục, trạng thái, giá)
  - [ ] Form tạo/sửa sản phẩm (các trường thông tin)
  - [ ] Nút toggle trạng thái active/inactive

---

### 7.2 Upload ảnh sản phẩm (`feat_adm_prod_img`)
- **URL:** `/(admin)/admin/products` (trong form sản phẩm)
- **Mô tả:** Admin upload ảnh sản phẩm. Ảnh được lưu trên Cloudinary. Có thể xóa ảnh.
- **Cần screenshot:**
  - [ ] Khu vực upload ảnh (drag & drop hoặc nút chọn file)
  - [ ] Ảnh đã upload (thumbnail preview + nút xóa)

---

### 7.3 Quản lý biến thể sản phẩm (`feat_adm_prod_var_crud`)
- **URL:** `/(admin)/admin/products` (section variants)
- **Mô tả:** Thêm, sửa, xóa biến thể (size, màu sắc, số lượng kho, giá). Hệ thống tự tạo SKU nếu không nhập.
- **Cần screenshot:**
  - [ ] Bảng/danh sách biến thể (size, màu, SKU, tồn kho, giá)
  - [ ] Form thêm/sửa biến thể

---

### 7.4 AI tạo mô tả sản phẩm (`feat_sys_ai_desc` - trong product)
- **URL:** `/(admin)/admin/products` (form tạo sản phẩm)
- **Mô tả:** Admin nhập từ khóa → bấm nút "Tạo mô tả bằng AI" → Groq API sinh ra mô tả tự động điền vào form.
- **Cần screenshot:**
  - [ ] Nút "Tạo mô tả AI" trong form sản phẩm
  - [ ] Kết quả sau khi AI tạo mô tả (text đã điền vào textarea)

---

## 8. Nhóm: Admin - Quản lý đơn hàng

### 8.1 Danh sách đơn hàng & lọc (`feat_adm_ord_manage` + `feat_adm_ord_filter`)
- **URL:** `/(admin)/admin/orders`
- **Mô tả:** Bảng tất cả đơn hàng. Lọc theo trạng thái, user_id, khoảng ngày (from_date → to_date).
- **Cần screenshot:**
  - [x] Bảng đơn hàng (đầy đủ các cột)
  - [ ] Bộ lọc đang được áp dụng (lọc theo status / ngày)

---

### 8.2 Chi tiết đơn hàng (Admin) (`feat_adm_ord_manage`)
- **URL:** `/(admin)/admin/orders/[id]` hoặc modal
- **Mô tả:** Admin xem chi tiết đơn: sản phẩm, địa chỉ, tổng tiền, lịch sử trạng thái.
- **Cần screenshot:**
  - [ ] Trang/modal chi tiết đơn hàng phía admin

---

### 8.3 Cập nhật trạng thái đơn hàng (`feat_adm_ord_manage`)
- **URL:** `/(admin)/admin/orders`
- **Mô tả:** Admin cập nhật trạng thái theo quy trình: `pending → confirmed → shipping → delivered`. Không thể nhảy sai bước (state machine).
- **Cần screenshot:**
  - [ ] Dropdown/nút chọn trạng thái mới
  - [ ] Trạng thái sau khi cập nhật

---

### 8.4 Cập nhật trạng thái hàng loạt (`feat_adm_ord_bulk`)
- **URL:** `/(admin)/admin/orders`
- **Mô tả:** Admin chọn nhiều đơn hàng → cập nhật trạng thái đồng loạt.
- **Cần screenshot:**
  - [ ] Checkbox chọn nhiều đơn hàng
  - [ ] Nút "Cập nhật hàng loạt" + dropdown trạng thái

---

## 9. Nhóm: Admin - Voucher & Campaign

### 9.1 Quản lý voucher (`feat_adm_vouch_crud`)
- **URL:** `/(admin)/admin/vouchers`
- **Mô tả:** Tạo, sửa, xóa mềm voucher. Các loại: PERCENTAGE (%), FIXED (số tiền cố định), FREESHIP. Cấu hình: ngày hiệu lực, giới hạn lượt dùng, giá trị đơn tối thiểu.
- **Cần screenshot:**
  - [x] Bảng danh sách voucher (code, loại, giá trị, hạn dùng, trạng thái)
  - [ ] Form tạo/sửa voucher

---

### 9.2 AI tạo mô tả voucher (`feat_sys_ai_desc` - trong voucher)
- **URL:** `/(admin)/admin/vouchers` (form tạo voucher)
- **Mô tả:** Nút AI generate mô tả cho voucher.
- **Cần screenshot:**
  - [ ] Nút AI trong form voucher + kết quả sau khi tạo

---

### 9.3 Quản lý campaign (`feat_adm_camp_crud`)
- **URL:** `/(admin)/admin/campaigns`
- **Mô tả:** Tạo, sửa, xóa campaign. Các loại: PERCENTAGE, FIXED_PRICE, TIER_DISCOUNT (giảm theo bậc), FREESHIP. Gắn sản phẩm vào campaign.
- **Cần screenshot:**
  - [x] Bảng danh sách campaign (tên, loại, ngày, trạng thái)
  - [ ] Form tạo/sửa campaign (đầy đủ các trường, danh sách sản phẩm được gắn)
  - [ ] Cấu hình TIER_DISCOUNT (bảng các bậc giảm giá)

---

### 9.4 Bật/Tắt campaign (`feat_adm_camp_status`)
- **URL:** `/(admin)/admin/campaigns`
- **Mô tả:** Toggle riêng để bật/tắt campaign độc lập với việc sửa. Campaign đang active thì không cho sửa.
- **Cần screenshot:**
  - [ ] Nút toggle active/inactive trong bảng campaign
  - [ ] Thông báo không thể sửa campaign đang active

---

### 9.5 AI tạo mô tả campaign (`feat_sys_ai_desc` - trong campaign)
- **URL:** `/(admin)/admin/campaigns` (form tạo campaign)
- **Mô tả:** AI tự sinh mô tả cho campaign.
- **Cần screenshot:**
  - [ ] Nút AI trong form campaign + kết quả

---

## 10. Nhóm: Admin - Danh mục & Thương hiệu

### 10.1 Quản lý danh mục (`feat_adm_cat_crud`)
- **URL:** `/(admin)/admin/categories`
- **Mô tả:** CRUD danh mục sản phẩm.
- **Cần screenshot:**
  - [x] Bảng/danh sách danh mục
  - [ ] Form thêm/sửa danh mục

---

### 10.2 Quản lý thương hiệu (`feat_adm_brand_crud`)
- **URL:** `/(admin)/admin/brands`
- **Mô tả:** CRUD thương hiệu (brand).
- **Cần screenshot:**
  - [x] Bảng/danh sách thương hiệu
  - [ ] Form thêm/sửa thương hiệu

---

## 11. Nhóm: Tính năng hệ thống (ẩn/tự động)

> Các tính năng dưới đây chạy nền, nhưng **có thể thấy kết quả** trên UI.

### 11.1 Email thông báo đơn hàng (`feat_sys_email_notif`)
- **Mô tả:** Hệ thống tự gửi email qua SMTP khi: đặt hàng thành công, hủy đơn hàng.
- **Cần screenshot:**
  - [ ] Email nhận được khi đặt hàng (screenshot từ hộp thư)
  - [ ] Email nhận được khi hủy đơn

---

### 11.2 Phát hiện thay đổi giá (`feat_sys_price_change_detect`)
- **Mô tả:** Khi vào trang checkout, nếu giá sản phẩm trong giỏ khác giá hiện tại → hệ thống cảnh báo người dùng.
- **Cần screenshot:**
  - [ ] Banner/thông báo "Giá một số sản phẩm đã thay đổi" trên trang checkout

---

### 11.3 Tự động tạo SKU (`feat_sys_sku_autogen`)
- **Mô tả:** Khi tạo biến thể không nhập SKU → hệ thống tự tạo SKU từ brand + tên sản phẩm + màu + size + hex ngẫu nhiên.
- **Cần screenshot:**
  - [ ] SKU được tạo tự động hiển thị trong bảng biến thể

---

### 11.4 Snapshot đơn hàng (`feat_sys_order_snapshot`)
- **Mô tả:** Tên sản phẩm, size, màu, giá, địa chỉ tại thời điểm đặt hàng được lưu cứng → dù master data thay đổi sau này, lịch sử đơn hàng vẫn chính xác.
- **Cần screenshot:**
  - [ ] Chi tiết đơn hàng cũ vẫn hiển thị đúng tên/giá gốc dù sản phẩm đã được sửa

---

### 11.5 JWT Auto Refresh (`feat_sys_jwt_refresh`)
- **Mô tả:** Axios interceptor tự động làm mới access token khi hết hạn, không cần người dùng đăng nhập lại.
- **Cần screenshot:** *(Tính năng ẩn - không cần screenshot trực tiếp, có thể bỏ qua hoặc dùng DevTools)*

---

## 📊 TỔNG KẾT

| Nhóm                     | Số tính năng | Số màn hình cần chụp |
| ------------------------ | ------------ | -------------------- |
| Xác thực & Tài khoản     | 5            | ~12                  |
| Sản phẩm & Danh mục      | 6            | ~14                  |
| Giỏ hàng & Thanh toán    | 6            | ~14                  |
| Đơn hàng (User)          | 3            | ~7                   |
| Trang chủ & Campaign     | 2            | ~6                   |
| Admin Dashboard          | 1            | ~3                   |
| Admin Sản phẩm           | 4            | ~10                  |
| Admin Đơn hàng           | 4            | ~8                   |
| Admin Voucher & Campaign | 5            | ~10                  |
| Admin Danh mục & Brand   | 2            | ~4                   |
| Hệ thống (ẩn)            | 5            | ~5                   |
| **TỔNG**                 | **43**       | **~93**              |

---

> 💡 **Gợi ý thứ tự screenshot cho PowerPoint:**
> 1. Bắt đầu từ Homepage → Đăng ký → Đăng nhập
> 2. Browse sản phẩm → Chi tiết → Giỏ hàng → Checkout → Đặt hàng
> 3. Quản lý đơn hàng (user) → Hủy đơn
> 4. Admin Dashboard → Sản phẩm → Đơn hàng → Voucher → Campaign
