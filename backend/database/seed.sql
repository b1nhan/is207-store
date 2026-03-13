products-- =============================================================================
-- SEED DATA — is207_db
-- =============================================================================

USE is207_db;

SET FOREIGN_KEY_CHECKS = 0;

SET SQL_SAFE_UPDATES = 0;

-- Xóa dữ liệu cũ (thứ tự ngược FK)
DELETE FROM voucher_usages;
DELETE FROM promotion_items;
DELETE FROM promotions;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM order_shipping_address;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM vouchers;
DELETE FROM product_variants;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM brands;
DELETE FROM addresses;
DELETE FROM users;
DELETE FROM roles;

-- Reset AUTO_INCREMENT
ALTER TABLE roles              AUTO_INCREMENT = 1;
ALTER TABLE users              AUTO_INCREMENT = 1;
ALTER TABLE addresses          AUTO_INCREMENT = 1;
ALTER TABLE brands             AUTO_INCREMENT = 1;
ALTER TABLE categories         AUTO_INCREMENT = 1;
ALTER TABLE products           AUTO_INCREMENT = 1;
ALTER TABLE product_images     AUTO_INCREMENT = 1;
ALTER TABLE product_variants   AUTO_INCREMENT = 1;
ALTER TABLE vouchers           AUTO_INCREMENT = 1;
ALTER TABLE orders             AUTO_INCREMENT = 1;
ALTER TABLE order_items        AUTO_INCREMENT = 1;
ALTER TABLE carts              AUTO_INCREMENT = 1;
ALTER TABLE cart_items         AUTO_INCREMENT = 1;
ALTER TABLE promotions         AUTO_INCREMENT = 1;
ALTER TABLE voucher_usages     AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 1. ROLES
-- =============================================================================
INSERT INTO roles (role_id, role_name) VALUES
(1, 'admin'),
(2, 'user');

-- =============================================================================
-- 2. USERS
-- password_hash = bcrypt của "Password123!" (cost 10)
-- Tài khoản test:
--   admin@is207.dev / Password123!  (admin)
--   user1@gmail.com / Password123!  (user)
-- =============================================================================
INSERT INTO users (user_id, role_id, username, email, password_hash, full_name, phone, date_of_birth) VALUES
(1,  1, 'admin',       'admin@is207.dev',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Admin System',    '0900000001', '1990-01-01'),
(2,  2, 'nguyen_an',   'nguyenan@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Nguyễn Văn An',   '0901234567', '1998-05-12'),
(3,  2, 'tran_bich',   'tranbich@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Trần Thị Bích',   '0912345678', '2000-08-20'),
(4,  2, 'le_cuong',    'lecuong@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Lê Minh Cường',   '0923456789', '1995-03-15'),
(5,  2, 'pham_dung',   'phamdung@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Phạm Thị Dung',   '0934567890', '2001-11-30'),
(6,  2, 'hoang_em',    'hoangemail@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Hoàng Văn Em',    '0945678901', '1999-07-07'),
(7,  2, 'vo_phuong',   'vophuong@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Võ Thị Phương',   '0956789012', '1997-02-14'),
(8,  2, 'do_giang',    'dogiang@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Đỗ Quang Giang',  '0967890123', '1993-09-09'),
(9,  2, 'bui_huong',   'buihuong@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Bùi Thị Hương',   '0978901234', '2002-04-22'),
(10, 2, 'nguyen_long', 'nguyenlong@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Nguyễn Hoàng Long','0989012345','1996-12-03');

-- =============================================================================
-- 3. ADDRESSES
-- =============================================================================
INSERT INTO addresses (address_id, user_id, full_address, is_default) VALUES
(1,  2, '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', 1),
(2,  2, '34 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',    0),
(3,  3, '56 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, TP.HCM', 1),
(4,  4, '78 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP.HCM', 1),
(5,  5, '90 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',        1),
(6,  6, '101 Cách Mạng Tháng 8, Phường 4, Quận 3, TP.HCM',1),
(7,  7, '22 Hoàng Diệu, Phường 10, Quận Phú Nhuận, TP.HCM',1),
(8,  8, '45 Phan Đình Phùng, Phường 1, Quận Phú Nhuận, TP.HCM', 1),
(9,  9, '67 Lý Thường Kiệt, Phường 8, Quận 10, TP.HCM',   1),
(10, 10,'88 Âu Cơ, Phường 9, Quận Tân Bình, TP.HCM',      1);

-- =============================================================================
-- 4. BRANDS
-- =============================================================================
INSERT INTO brands (brand_id, brand_name) VALUES
(1, 'Nike'),
(2, 'Adidas'),
(3, 'Uniqlo'),
(4, 'Zara'),
(5, 'H&M'),
(6, 'Local Brand VN');

-- =============================================================================
-- 5. CATEGORIES
-- =============================================================================
INSERT INTO categories (category_id, category_name, slug) VALUES
(1, 'Áo thun',    'ao-thun'),
(2, 'Áo khoác',   'ao-khoac'),
(3, 'Quần jeans', 'quan-jeans'),
(4, 'Quần short', 'quan-short'),
(5, 'Váy & Đầm',  'vay-dam'),
(6, 'Phụ kiện',   'phu-kien');

-- =============================================================================
-- 6. PRODUCTS (20 sản phẩm)
-- =============================================================================
INSERT INTO products (product_id, product_name, slug, product_description, material, gender, base_price, brand_id, category_id, status) VALUES
-- Áo thun
(1,  'Áo Thun Basic Nike Swoosh',        'ao-thun-basic-nike-swoosh',       'Áo thun cotton cao cấp, logo Swoosh thêu nổi, phù hợp mặc hàng ngày.',         'Cotton 100%',            'unisex', 350000,  1, 1, 1),
(2,  'Áo Thun Adidas 3-Stripes',         'ao-thun-adidas-3-stripes',        'Áo thun thể thao với 3 sọc đặc trưng của Adidas, chất liệu thoáng mát.',        'Cotton 95% Spandex 5%',  'men',    420000,  2, 1, 1),
(3,  'Áo Thun Uniqlo SupimaⓇ',          'ao-thun-uniqlo-supima',           'Chất liệu Supima cotton mềm mịn, form regular fit, nhiều màu.',                 'Supima Cotton 100%',     'unisex', 299000,  3, 1, 1),
(4,  'Áo Thun Local Brand Oversize',     'ao-thun-local-brand-oversize',    'Form oversize trend, in hoạ tiết street art độc quyền.',                        'Cotton 100%',            'unisex', 280000,  6, 1, 1),
(5,  'Áo Thun H&M Basic Tee',            'ao-thun-hm-basic-tee',            'Áo thun basic giá tốt, nhiều màu sắc đa dạng.',                                 'Cotton 100%',            'women',  199000,  5, 1, 1),
-- Áo khoác
(6,  'Áo Khoác Gió Nike Running',        'ao-khoac-gio-nike-running',       'Áo khoác gió nhẹ, chống nước nhẹ, lý tưởng cho chạy bộ và hoạt động ngoài trời.','Polyester 100%',         'men',    890000,  1, 2, 1),
(7,  'Áo Khoác Denim Zara',              'ao-khoac-denim-zara',             'Áo khoác denim classic, form regular, wash nhạt thời thượng.',                  'Denim Cotton 100%',      'unisex', 750000,  4, 2, 1),
(8,  'Áo Khoác Hoodie Adidas',           'ao-khoac-hoodie-adidas',          'Hoodie nỉ bông dày dặn, có túi kangaroo, logo thêu ngực.',                      'Cotton 80% Polyester 20%','unisex', 650000,  2, 2, 1),
(9,  'Áo Khoác Bomber Local Brand',      'ao-khoac-bomber-local-brand',     'Bomber jacket phong cách Y2K, lót satin, nhiều chi tiết độc đáo.',               'Polyester 100%',         'unisex', 580000,  6, 2, 1),
-- Quần jeans
(10, 'Quần Jeans Slim Fit Zara',         'quan-jeans-slim-fit-zara',        'Quần jeans slim fit co giãn nhẹ, wash medium, basic dễ phối.',                   'Cotton 98% Elastane 2%', 'men',    620000,  4, 3, 1),
(11, 'Quần Jeans Ống Rộng H&M',          'quan-jeans-ong-rong-hm',          'Quần jeans ống rộng wide-leg, lưng cao, phong cách retro.',                      'Cotton 100%',            'women',  550000,  5, 3, 1),
(12, 'Quần Jeans Skinny Uniqlo',         'quan-jeans-skinny-uniqlo',        'Quần jeans skinny co giãn 4 chiều, thoải mái cả ngày.',                          'Cotton 92% Elastane 8%', 'unisex', 490000,  3, 3, 1),
-- Quần short
(13, 'Quần Short Thể Thao Nike Dri-FIT', 'quan-short-nike-dri-fit',         'Quần short thể thao công nghệ Dri-FIT thấm hút mồ hôi nhanh.',                  'Polyester 100%',         'men',    380000,  1, 4, 1),
(14, 'Quần Short Kaki Zara',             'quan-short-kaki-zara',            'Quần short kaki basic, túi hộp, phù hợp đi chơi và đi học.',                    'Cotton 100%',            'men',    320000,  4, 4, 1),
(15, 'Quần Short Jeans Rách H&M',        'quan-short-jeans-rach-hm',        'Quần short jeans distressed, hem raw, phong cách cá tính.',                     'Cotton 100%',            'women',  280000,  5, 4, 1),
-- Váy & Đầm
(16, 'Đầm Midi Floral Zara',             'dam-midi-floral-zara',            'Đầm midi họa tiết hoa, cổ V, tay bồng, thanh lịch dịu dàng.',                   'Viscose 100%',           'women',  720000,  4, 5, 1),
(17, 'Váy Mini Denim H&M',               'vay-mini-denim-hm',               'Váy mini denim, lưng thun co giãn, dễ phối với áo thun.',                        'Cotton 100%',            'women',  380000,  5, 5, 1),
(18, 'Đầm Maxi Boho Local Brand',        'dam-maxi-boho-local-brand',       'Đầm maxi boho chiffon nhẹ bay, phù hợp đi biển và du lịch.',                    'Chiffon Polyester 100%', 'women',  450000,  6, 5, 1),
-- Phụ kiện
(19, 'Mũ Bucket Nike',                   'mu-bucket-nike',                  'Mũ bucket vành tròn, logo thêu, chống nắng tốt.',                               'Cotton 100%',            'unisex', 250000,  1, 6, 1),
(20, 'Túi Tote Canvas Local Brand',      'tui-tote-canvas-local-brand',     'Túi tote canvas dày dặn, in slogan, dung tích lớn.',                            'Canvas Cotton 100%',     'unisex', 180000,  6, 6, 0); -- status=0: ẩn, test admin

-- =============================================================================
-- 7. PRODUCT IMAGES (ảnh placeholder, thay bằng URL Cloudinary thực tế sau)
-- =============================================================================
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(1,  'https://placehold.co/600x800/111/fff?text=Nike+Tee+1',      1, 0),
(1,  'https://placehold.co/600x800/222/fff?text=Nike+Tee+2',      0, 1),
(2,  'https://placehold.co/600x800/333/fff?text=Adidas+Tee+1',    1, 0),
(3,  'https://placehold.co/600x800/444/fff?text=Uniqlo+Tee+1',    1, 0),
(3,  'https://placehold.co/600x800/555/fff?text=Uniqlo+Tee+2',    0, 1),
(4,  'https://placehold.co/600x800/666/fff?text=Local+Oversize+1',1, 0),
(5,  'https://placehold.co/600x800/777/fff?text=HM+Basic+1',      1, 0),
(6,  'https://placehold.co/600x800/888/fff?text=Nike+Jacket+1',   1, 0),
(6,  'https://placehold.co/600x800/999/fff?text=Nike+Jacket+2',   0, 1),
(7,  'https://placehold.co/600x800/aaa/fff?text=Zara+Denim+1',    1, 0),
(8,  'https://placehold.co/600x800/bbb/fff?text=Adidas+Hoodie+1', 1, 0),
(9,  'https://placehold.co/600x800/ccc/fff?text=Local+Bomber+1',  1, 0),
(10, 'https://placehold.co/600x800/ddd/fff?text=Zara+Jeans+1',    1, 0),
(11, 'https://placehold.co/600x800/eee/333?text=HM+Wideleg+1',    1, 0),
(12, 'https://placehold.co/600x800/123/fff?text=Uniqlo+Skinny+1', 1, 0),
(13, 'https://placehold.co/600x800/456/fff?text=Nike+Short+1',    1, 0),
(14, 'https://placehold.co/600x800/789/fff?text=Zara+Short+1',    1, 0),
(15, 'https://placehold.co/600x800/abc/fff?text=HM+Jeans+Short+1',1, 0),
(16, 'https://placehold.co/600x800/def/fff?text=Zara+Dress+1',    1, 0),
(16, 'https://placehold.co/600x800/012/fff?text=Zara+Dress+2',    0, 1),
(17, 'https://placehold.co/600x800/345/fff?text=HM+Skirt+1',      1, 0),
(18, 'https://placehold.co/600x800/678/fff?text=Local+Maxi+1',    1, 0),
(19, 'https://placehold.co/600x800/901/fff?text=Nike+Bucket+1',   1, 0),
(20, 'https://placehold.co/600x800/234/fff?text=Local+Tote+1',    1, 0);

-- =============================================================================
-- 8. PRODUCT VARIANTS
-- Áo thun: S / M / L / XL — nhiều màu
-- Quần: 28 / 30 / 32 / 34
-- Phụ kiện: Free Size
-- =============================================================================
INSERT INTO product_variants (product_id, size, color, variant_price, stock_quantity, sku, status) VALUES
-- Product 1: Áo Thun Nike (4 size x 2 màu)
(1, 'S',  'Trắng', NULL,   30, 'NIKE-TEE-S-WHT',  1),
(1, 'M',  'Trắng', NULL,   45, 'NIKE-TEE-M-WHT',  1),
(1, 'L',  'Trắng', NULL,   40, 'NIKE-TEE-L-WHT',  1),
(1, 'XL', 'Trắng', NULL,   20, 'NIKE-TEE-XL-WHT', 1),
(1, 'S',  'Đen',   NULL,   25, 'NIKE-TEE-S-BLK',  1),
(1, 'M',  'Đen',   NULL,   50, 'NIKE-TEE-M-BLK',  1),
(1, 'L',  'Đen',   NULL,   35, 'NIKE-TEE-L-BLK',  1),
(1, 'XL', 'Đen',   NULL,   15, 'NIKE-TEE-XL-BLK', 1),
-- Product 2: Áo Thun Adidas
(2, 'S',  'Xanh navy', NULL,  20, 'ADI-TEE-S-NVY',  1),
(2, 'M',  'Xanh navy', NULL,  40, 'ADI-TEE-M-NVY',  1),
(2, 'L',  'Xanh navy', NULL,  30, 'ADI-TEE-L-NVY',  1),
(2, 'S',  'Xám',       NULL,  25, 'ADI-TEE-S-GRY',  1),
(2, 'M',  'Xám',       NULL,  35, 'ADI-TEE-M-GRY',  1),
(2, 'L',  'Xám',       NULL,  20, 'ADI-TEE-L-GRY',  1),
-- Product 3: Uniqlo Supima
(3, 'S',  'Trắng', NULL,   50, 'UNI-TEE-S-WHT',  1),
(3, 'M',  'Trắng', NULL,   60, 'UNI-TEE-M-WHT',  1),
(3, 'L',  'Trắng', NULL,   45, 'UNI-TEE-L-WHT',  1),
(3, 'M',  'Đen',   NULL,   55, 'UNI-TEE-M-BLK',  1),
(3, 'L',  'Đen',   NULL,   40, 'UNI-TEE-L-BLK',  1),
-- Product 4: Local Brand Oversize
(4, 'M',  'Be',    NULL,   30, 'LB-OS-M-BEI',    1),
(4, 'L',  'Be',    NULL,   25, 'LB-OS-L-BEI',    1),
(4, 'XL', 'Be',    NULL,   20, 'LB-OS-XL-BEI',   1),
(4, 'M',  'Đen',   NULL,   35, 'LB-OS-M-BLK',    1),
(4, 'L',  'Đen',   NULL,   30, 'LB-OS-L-BLK',    1),
-- Product 5: H&M Basic Tee
(5, 'S',  'Hồng',  NULL,   40, 'HM-TEE-S-PNK',   1),
(5, 'M',  'Hồng',  NULL,   50, 'HM-TEE-M-PNK',   1),
(5, 'S',  'Trắng', NULL,   45, 'HM-TEE-S-WHT',   1),
(5, 'M',  'Trắng', NULL,   55, 'HM-TEE-M-WHT',   1),
-- Product 6: Nike Jacket
(6, 'S',  'Đen',        850000, 15, 'NIKE-JKT-S-BLK',  1),
(6, 'M',  'Đen',        850000, 20, 'NIKE-JKT-M-BLK',  1),
(6, 'L',  'Đen',        850000, 18, 'NIKE-JKT-L-BLK',  1),
(6, 'M',  'Xanh lá',    890000, 12, 'NIKE-JKT-M-GRN',  1),
-- Product 7: Zara Denim Jacket
(7, 'S',  'Xanh nhạt',  NULL,   20, 'ZARA-DJK-S-LBL', 1),
(7, 'M',  'Xanh nhạt',  NULL,   25, 'ZARA-DJK-M-LBL', 1),
(7, 'L',  'Xanh nhạt',  NULL,   18, 'ZARA-DJK-L-LBL', 1),
-- Product 8: Adidas Hoodie
(8, 'S',  'Xám',   NULL,   20, 'ADI-HDI-S-GRY',  1),
(8, 'M',  'Xám',   NULL,   30, 'ADI-HDI-M-GRY',  1),
(8, 'L',  'Xám',   NULL,   25, 'ADI-HDI-L-GRY',  1),
(8, 'M',  'Đen',   NULL,   35, 'ADI-HDI-M-BLK',  1),
-- Product 9: Bomber Local Brand
(9, 'M',  'Xanh navy', NULL, 15, 'LB-BMB-M-NVY',  1),
(9, 'L',  'Xanh navy', NULL, 12, 'LB-BMB-L-NVY',  1),
(9, 'M',  'Đen',       NULL, 18, 'LB-BMB-M-BLK',  1),
-- Product 10: Jeans Slim Zara
(10, '28', 'Xanh trung', NULL, 20, 'ZARA-SLM-28-MBL', 1),
(10, '30', 'Xanh trung', NULL, 30, 'ZARA-SLM-30-MBL', 1),
(10, '32', 'Xanh trung', NULL, 25, 'ZARA-SLM-32-MBL', 1),
(10, '34', 'Xanh trung', NULL, 15, 'ZARA-SLM-34-MBL', 1),
-- Product 11: Jeans Wide H&M
(11, '26', 'Xanh nhạt', NULL, 20, 'HM-WDL-26-LBL', 1),
(11, '28', 'Xanh nhạt', NULL, 25, 'HM-WDL-28-LBL', 1),
(11, '30', 'Xanh nhạt', NULL, 20, 'HM-WDL-30-LBL', 1),
-- Product 12: Jeans Skinny Uniqlo
(12, '28', 'Đen', NULL, 30, 'UNI-SKN-28-BLK', 1),
(12, '30', 'Đen', NULL, 35, 'UNI-SKN-30-BLK', 1),
(12, '32', 'Đen', NULL, 28, 'UNI-SKN-32-BLK', 1),
-- Product 13: Nike Short
(13, 'S',  'Đen',  NULL, 40, 'NIKE-SHT-S-BLK',  1),
(13, 'M',  'Đen',  NULL, 50, 'NIKE-SHT-M-BLK',  1),
(13, 'L',  'Đen',  NULL, 35, 'NIKE-SHT-L-BLK',  1),
(13, 'M',  'Xám',  NULL, 40, 'NIKE-SHT-M-GRY',  1),
-- Product 14: Kaki Short Zara
(14, 'S',  'Be',   NULL, 25, 'ZARA-KAK-S-BEI', 1),
(14, 'M',  'Be',   NULL, 30, 'ZARA-KAK-M-BEI', 1),
(14, 'L',  'Be',   NULL, 20, 'ZARA-KAK-L-BEI', 1),
-- Product 15: Jeans Short H&M
(15, 'S',  'Xanh rách', NULL, 20, 'HM-JSH-S-DST', 1),
(15, 'M',  'Xanh rách', NULL, 25, 'HM-JSH-M-DST', 1),
-- Product 16: Zara Midi Dress
(16, 'S',  'Hoa đỏ',  NULL, 15, 'ZARA-MDR-S-RED', 1),
(16, 'M',  'Hoa đỏ',  NULL, 20, 'ZARA-MDR-M-RED', 1),
(16, 'L',  'Hoa đỏ',  NULL, 12, 'ZARA-MDR-L-RED', 1),
(16, 'S',  'Hoa xanh',NULL, 15, 'ZARA-MDR-S-BLU', 1),
(16, 'M',  'Hoa xanh',NULL, 18, 'ZARA-MDR-M-BLU', 1),
-- Product 17: H&M Mini Skirt
(17, 'S',  'Xanh nhạt', NULL, 20, 'HM-MNS-S-LBL', 1),
(17, 'M',  'Xanh nhạt', NULL, 25, 'HM-MNS-M-LBL', 1),
-- Product 18: Local Brand Maxi
(18, 'S',  'Vàng bo', NULL, 15, 'LB-MAX-S-YLW', 1),
(18, 'M',  'Vàng bo', NULL, 20, 'LB-MAX-M-YLW', 1),
(18, 'L',  'Vàng bo', NULL, 15, 'LB-MAX-L-YLW', 1),
-- Product 19: Nike Bucket Hat
(19, 'Free Size', 'Đen',   NULL, 50, 'NIKE-BCK-FS-BLK', 1),
(19, 'Free Size', 'Trắng', NULL, 40, 'NIKE-BCK-FS-WHT', 1),
-- Product 20: Local Brand Tote (status=0, vẫn có variant để test admin)
(20, 'Free Size', 'Kem', NULL, 30, 'LB-TOTE-FS-CRM', 1);

-- =============================================================================
-- 9. VOUCHERS
-- =============================================================================
INSERT INTO vouchers (voucher_id, code, description, discount_type, discount_value, max_discount_amount, min_order_value, usage_limit, used_count, user_usage_limit, start_date, expiry_date, is_active, created_by) VALUES
(1, 'WELCOME10',  'Giảm 10% cho đơn hàng đầu tiên',           'PERCENTAGE', 10,     50000,  0,       100, 5,  1, '2025-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
(2, 'SUMMER50K',  'Giảm 50.000đ cho đơn từ 300.000đ',         'FIXED',      50000,  NULL,   300000,  50,  10, 1, '2025-06-01 00:00:00', '2026-08-31 23:59:59', 1, 1),
(3, 'VIP20',      'Giảm 20% tối đa 100.000đ cho VIP',         'PERCENTAGE', 20,     100000, 500000,  30,  3,  1, '2025-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
(4, 'FREESHIP',   'Miễn phí vận chuyển cho mọi đơn hàng',     'FREESHIP',   30000,  30000,  0,       200, 20, 1, '2025-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1),
(5, 'FLASH100K',  'Flash sale giảm 100.000đ đơn từ 700.000đ', 'FIXED',      100000, NULL,   700000,  20,  0,  1, '2026-03-10 00:00:00', '2026-03-10 23:59:59', 1, 1),
(6, 'EXPIRED',    'Voucher đã hết hạn (test)',                 'PERCENTAGE', 15,     NULL,   0,       50,  0,  1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 0, 1);

-- =============================================================================
-- 10. ORDERS (6 đơn hàng với các trạng thái khác nhau)
-- =============================================================================
INSERT INTO orders (order_id, user_id, address_id, voucher_id, voucher_code_snapshot, order_date, status, subtotal, discount_total, shipping_fee, total_amount, payment_status, cancelled_by) VALUES
(1, 2, 1, 4,    'FREESHIP',  '2026-01-15 10:30:00', 'delivered',  700000,  30000,  0,      670000,  'paid',    NULL),
(2, 3, 3, NULL, NULL,        '2026-01-20 14:00:00', 'delivered',  420000,  0,      30000,  450000,  'paid',    NULL),
(3, 4, 4, 2,    'SUMMER50K', '2026-02-05 09:15:00', 'shipping',   650000,  50000,  30000,  630000,  'paid',    NULL),
(4, 5, 5, NULL, NULL,        '2026-02-10 16:45:00', 'confirmed',  350000,  0,      30000,  380000,  'pending', NULL),
(5, 6, 6, 3,    'VIP20',     '2026-03-01 11:00:00', 'pending',    890000,  100000, 30000,  820000,  'pending', NULL),
(6, 2, 1, NULL, NULL,        '2026-03-05 08:00:00', 'cancelled',  280000,  0,      30000,  310000,  'refunded','USER');

-- =============================================================================
-- 11. ORDER ITEMS
-- =============================================================================
INSERT INTO order_items (order_id, variant_id, quantity, unit_price_snapshot, line_total, product_name_snapshot, size_snapshot, color_snapshot) VALUES
-- Order 1: user 2, Áo Nike (M/Đen) + Quần Nike Short (M/Đen)
(1, 6,  1, 350000, 350000, 'Áo Thun Basic Nike Swoosh', 'M', 'Đen'),
(1, 54, 1, 380000, 380000, 'Quần Short Thể Thao Nike Dri-FIT', 'M', 'Đen'),
-- Order 2: user 3, Áo Adidas (M/Xanh navy)
(2, 10, 1, 420000, 420000, 'Áo Thun Adidas 3-Stripes', 'M', 'Xanh navy'),
-- Order 3: user 4, Áo Zara Denim + Quần Jeans Slim
(3, 35, 1, 750000, 750000, 'Áo Khoác Denim Zara', 'M', 'Xanh nhạt'),    -- Zara jacket M
(3, 46, 1, 620000, 620000, 'Quần Jeans Slim Fit Zara', '30', 'Xanh trung'), -- Jeans 30
-- Order 4: user 5, Áo Thun Uniqlo (M/Trắng)
(4, 16, 1, 299000, 299000, 'Áo Thun Uniqlo SupimaⓇ', 'M', 'Trắng'),
-- Order 5: user 6, Nike Jacket (M/Đen)
(5, 31, 1, 890000, 890000, 'Áo Khoác Gió Nike Running', 'M', 'Đen'),
-- Order 6 (cancelled): user 2, Local Brand Oversize (M/Đen)
(6, 23, 1, 280000, 280000, 'Áo Thun Local Brand Oversize', 'M', 'Đen');

-- =============================================================================
-- 12. ORDER SHIPPING ADDRESS (snapshot địa chỉ)
-- =============================================================================
INSERT INTO order_shipping_address (order_id, receiver_name, receiver_phone, full_address) VALUES
(1, 'Nguyễn Văn An',  '0901234567', '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM'),
(2, 'Trần Thị Bích',  '0912345678', '56 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, TP.HCM'),
(3, 'Lê Minh Cường',  '0923456789', '78 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP.HCM'),
(4, 'Phạm Thị Dung',  '0934567890', '90 Võ Văn Tần, Phường 6, Quận 3, TP.HCM'),
(5, 'Hoàng Văn Em',   '0945678901', '101 Cách Mạng Tháng 8, Phường 4, Quận 3, TP.HCM'),
(6, 'Nguyễn Văn An',  '0901234567', '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM');

-- =============================================================================
-- 13. CARTS (giỏ hàng hiện tại của một số user)
-- =============================================================================
INSERT INTO carts (cart_id, user_id) VALUES
(1, 7),
(2, 8),
(3, 9);

INSERT INTO cart_items (cart_id, variant_id, quantity, price_snapshot) VALUES
-- user 7 (Võ Thị Phương): Áo Uniqlo M/Đen + Váy Zara S/Hoa đỏ
(1, 19, 1, 299000),
(1, 67, 1, 720000),
-- user 8 (Đỗ Quang Giang): Nike Short M/Đen x2
(2, 54, 2, 380000),
-- user 9 (Bùi Thị Hương): H&M Tee S/Hồng + Jeans Wide 28
(3, 25, 1, 199000),
(3, 49, 1, 550000);

-- =============================================================================
-- 14. PROMOTIONS
-- =============================================================================
INSERT INTO promotions (promotion_id, name, discount_type, start_date, end_date, status) VALUES
(1, 'Sale Hè 2026',         'PERCENTAGE', '2026-06-01 00:00:00', '2026-08-31 23:59:59', 1),
(2, 'Thanh lý cuối mùa',    'FIXED',      '2026-03-01 00:00:00', '2026-03-31 23:59:59', 1);

INSERT INTO promotion_items (promotion_id, product_id, discount_type, discount_value) VALUES
(1, 1,  'PERCENTAGE', 15),
(1, 2,  'PERCENTAGE', 15),
(1, 13, 'PERCENTAGE', 20),
(1, 14, 'PERCENTAGE', 20),
(1, 15, 'PERCENTAGE', 20),
(2, 5,  'FIXED',      50000),
(2, 17, 'FIXED',      80000),
(2, 18, 'FIXED',      100000);

-- =============================================================================
-- 15. VOUCHER USAGES
-- =============================================================================
INSERT INTO voucher_usages (voucher_id, user_id, order_id, discount_amount, used_at) VALUES
(4, 2, 1, 30000,  '2026-01-15 10:30:00'), -- FREESHIP dùng bởi user 2
(2, 4, 3, 50000,  '2026-02-05 09:15:00'), -- SUMMER50K dùng bởi user 4
(3, 6, 5, 100000, '2026-03-01 11:00:00'); -- VIP20 dùng bởi user 6

-- =============================================================================
-- Tài khoản test:
--   admin@is207.dev / Password123!
--   nguyenan@gmail.com / Password123!  (có orders, cart)
-- =============================================================================