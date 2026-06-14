# Screenshot Plan

## [feat_usr_homepage] — Trang chủ
- **Type**: page
- **Route**: /
- **Preconditions**: none
- **Wait for**: networkidle0
- **Filename**: feat_usr_homepage.png

## [feat_usr_auth_register_empty] — Đăng ký tài khoản (trống)
- **Type**: page
- **Route**: /register
- **Preconditions**: none
- **Wait for**: selector 'form'
- **Filename**: feat_usr_auth_register_empty.png

## [feat_usr_auth_register_filled] — Đăng ký tài khoản (đã điền)
- **Type**: form-state
- **Route**: /register
- **Preconditions**: none
- **Trigger**: type into inputs
- **Wait for**: inputs have values
- **Filename**: feat_usr_auth_register_filled.png

## [feat_usr_auth_login_empty] — Đăng nhập (trống)
- **Type**: page
- **Route**: /login
- **Preconditions**: none
- **Wait for**: selector 'form'
- **Filename**: feat_usr_auth_login_empty.png

## [feat_usr_auth_login_filled] — Đăng nhập (đã điền)
- **Type**: form-state
- **Route**: /login
- **Preconditions**: none
- **Trigger**: type into inputs
- **Wait for**: inputs have values
- **Filename**: feat_usr_auth_login_filled.png

## [feat_usr_profile_view] — Xem thông tin cá nhân
- **Type**: page
- **Route**: /profile
- **Preconditions**: user logged in
- **Wait for**: networkidle0
- **Filename**: feat_usr_profile_view.png

## [feat_usr_profile_update_modal] — Form chỉnh sửa thông tin đang mở
- **Type**: modal
- **Route**: /profile
- **Preconditions**: user logged in
- **Trigger**: click '#open-edit-profile-btn'
- **Wait for**: selector '#edit-profile-save-btn'
- **Filename**: feat_usr_profile_update_modal.png

## [feat_usr_change_password] — Modal đổi mật khẩu
- **Type**: modal
- **Route**: /profile
- **Preconditions**: user logged in
- **Trigger**: click '#open-change-password-btn'
- **Wait for**: selector 'input[name="current_password"]'
- **Filename**: feat_usr_change_password_modal.png

## [feat_usr_shipping_crud] — Form thêm/sửa địa chỉ giao hàng
- **Type**: modal
- **Route**: /profile
- **Preconditions**: user logged in
- **Trigger**: click button contains 'Thêm địa chỉ'
- **Wait for**: modal visibility
- **Filename**: feat_usr_shipping_modal.png

## [feat_usr_prod_list] — Danh sách sản phẩm
- **Type**: page
- **Route**: /products
- **Preconditions**: none
- **Wait for**: networkidle0
- **Filename**: feat_usr_prod_list.png

## [feat_usr_cat_list] — Danh sách danh mục
- **Type**: page
- **Route**: /category
- **Preconditions**: none
- **Wait for**: networkidle0
- **Filename**: feat_usr_cat_list.png

## [feat_usr_cart_manage] — Giỏ hàng
- **Type**: page
- **Route**: /cart
- **Preconditions**: user logged in, add item to cart
- **Wait for**: networkidle0
- **Filename**: feat_usr_cart_manage.png

## [feat_usr_ord_list] — Danh sách đơn hàng
- **Type**: page
- **Route**: /orders
- **Preconditions**: user logged in
- **Wait for**: networkidle0
- **Filename**: feat_usr_ord_list.png

## [feat_usr_prod_detail] — Chi tiết sản phẩm
- **Type**: page
- **Route**: /products/:slug
- **Preconditions**: none
- **Wait for**: networkidle0
- **Filename**: feat_usr_prod_detail.png

## [feat_usr_cat_prod] — Sản phẩm từ danh mục
- **Type**: page
- **Route**: /category/:slug
- **Preconditions**: none
- **Wait for**: networkidle0
- **Filename**: feat_usr_cat_prod.png

## [feat_usr_search] — Tìm kiếm sản phẩm
- **Type**: action
- **Route**: anywhere
- **Preconditions**: type "áo" in search
- **Wait for**: dropdown visibility
- **Filename**: feat_usr_search.png

## [feat_usr_cart_with_items] — Giỏ hàng có sản phẩm
- **Type**: page
- **Route**: /cart
- **Preconditions**: logged in, add product to cart
- **Wait for**: networkidle0
- **Filename**: feat_usr_cart_with_items.png

## [feat_usr_checkout] — Thanh toán
- **Type**: page
- **Route**: /checkout
- **Preconditions**: logged in, cart has items
- **Wait for**: networkidle0
- **Filename**: feat_usr_checkout.png

## [feat_usr_ord_detail] — Chi tiết đơn hàng
- **Type**: page
- **Route**: /orders/:id
- **Preconditions**: logged in
- **Wait for**: networkidle0
- **Filename**: feat_usr_ord_detail.png

## [feat_usr_camp_detail] — Chi tiết campaign
- **Type**: page
- **Route**: /campaigns/:id
- **Preconditions**: none
- **Wait for**: networkidle0
- **Filename**: feat_usr_camp_detail.png

## [feat_usr_homepage_hero] — Trang chủ (Hero)
- **Type**: page
- **Route**: /
- **Preconditions**: none
- **Wait for**: networkidle0
- **Filename**: feat_usr_homepage_hero.png

## [feat_usr_homepage_new_arrivals] — Trang chủ (Hàng mới)
- **Type**: page
- **Route**: /
- **Preconditions**: scroll
- **Wait for**: networkidle0
- **Filename**: feat_usr_homepage_new_arrivals.png

## [feat_usr_homepage_best_sellers] — Trang chủ (Bán chạy)
- **Type**: page
- **Route**: /
- **Preconditions**: scroll
- **Wait for**: networkidle0
- **Filename**: feat_usr_homepage_best_sellers.png

## [feat_adm_dash_view] — Admin Dashboard
- **Type**: page
- **Route**: /admin
- **Preconditions**: admin logged in
- **Wait for**: networkidle0
- **Filename**: feat_adm_dash_view.png

## [feat_adm_prod_crud] — Danh sách sản phẩm
- **Type**: page
- **Route**: /admin/products
- **Preconditions**: admin logged in
- **Wait for**: networkidle0
- **Filename**: feat_adm_prod_crud.png

## [feat_adm_prod_create_modal] — Form tạo/sửa sản phẩm
- **Type**: modal
- **Route**: /admin/products
- **Preconditions**: admin logged in
- **Trigger**: click button 'Thêm Sản phẩm'
- **Wait for**: modal visibility
- **Filename**: feat_adm_prod_create_modal.png

## [feat_adm_ord_manage] — Danh sách đơn hàng
- **Type**: page
- **Route**: /admin/orders
- **Preconditions**: admin logged in
- **Wait for**: networkidle0
- **Filename**: feat_adm_ord_manage.png

## [feat_adm_ord_detail_modal] — Modal chi tiết đơn hàng
- **Type**: modal
- **Route**: /admin/orders
- **Preconditions**: admin logged in
- **Trigger**: click button 'Xem' trên hàng đầu tiên
- **Wait for**: modal visibility
- **Filename**: feat_adm_ord_detail_modal.png

## [feat_adm_vouch_crud] — Danh sách voucher
- **Type**: page
- **Route**: /admin/vouchers
- **Preconditions**: admin logged in
- **Wait for**: networkidle0
- **Filename**: feat_adm_vouch_crud.png

## [feat_adm_vouch_create_modal] — Form tạo/sửa voucher
- **Type**: modal
- **Route**: /admin/vouchers
- **Preconditions**: admin logged in
- **Trigger**: click button 'Tạo Voucher'
- **Wait for**: modal visibility
- **Filename**: feat_adm_vouch_create_modal.png

## [feat_adm_camp_crud] — Danh sách campaign
- **Type**: page
- **Route**: /admin/campaigns
- **Preconditions**: admin logged in
- **Wait for**: networkidle0
- **Filename**: feat_adm_camp_crud.png

## [feat_adm_camp_create_modal] — Form tạo/sửa campaign
- **Type**: modal
- **Route**: /admin/campaigns
- **Preconditions**: admin logged in
- **Trigger**: click button 'Tạo Campaign'
- **Wait for**: modal visibility
- **Filename**: feat_adm_camp_create_modal.png

## [feat_adm_cat_crud] — Danh sách danh mục
- **Type**: page
- **Route**: /admin/categories
- **Preconditions**: admin logged in
- **Wait for**: networkidle0
- **Filename**: feat_adm_cat_crud.png

## [feat_adm_cat_create_modal] — Form tạo/sửa danh mục
- **Type**: modal
- **Route**: /admin/categories
- **Preconditions**: admin logged in
- **Trigger**: click button 'Tạo danh mục'
- **Wait for**: modal visibility
- **Filename**: feat_adm_cat_create_modal.png

## [feat_adm_brand_crud] — Danh sách thương hiệu
- **Type**: page
- **Route**: /admin/brands
- **Preconditions**: admin logged in
- **Wait for**: networkidle0
- **Filename**: feat_adm_brand_crud.png

## [feat_adm_brand_create_modal] — Form tạo/sửa thương hiệu
- **Type**: modal
- **Route**: /admin/brands
- **Preconditions**: admin logged in
- **Trigger**: click button 'Tạo Brand'
- **Wait for**: modal visibility
- **Filename**: feat_adm_brand_create_modal.png
