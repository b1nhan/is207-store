CREATE DATABASE IF NOT EXISTS is207_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE is207_db;

-- 1. Bảng Roles (Phân quyền)
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE -- admin, user
) ENGINE=InnoDB;

-- 2. Bảng Users (Người dùng)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB;

-- 3. Bảng Addresses (Địa chỉ user)
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_address TEXT NOT NULL,
    is_default TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Bảng Brands (Thương hiệu)
CREATE TABLE brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 5. Bảng Categories (Danh mục)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 6. Bảng Products (Sản phẩm tổng quát)
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    product_description TEXT,
    material VARCHAR(100),
    gender ENUM('men', 'women', 'unisex', 'kids') DEFAULT 'unisex',
    base_price DECIMAL(12,2) NOT NULL,
    brand_id INT,
    category_id INT,
    status TINYINT DEFAULT 1, -- 1=on sale, 0=hidden
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (category_id),
    INDEX (brand_id),
    CONSTRAINT fk_product_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
) ENGINE=InnoDB;

-- 7. Bảng Product_images (Ảnh sản phẩm)
CREATE TABLE product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL,
    is_primary TINYINT DEFAULT 0,
    sort_order INT DEFAULT 0,
    CONSTRAINT fk_image_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Bảng Product_variants (Biến thể: Size, Màu, Kho)
CREATE TABLE product_variants (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(30) NOT NULL,
    variant_price DECIMAL(12,2) NULL, -- Override giá nếu có
    stock_quantity INT NOT NULL DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    status TINYINT DEFAULT 1,
    CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Bảng Vouchers (Mã giảm giá)
CREATE TABLE vouchers (
    voucher_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(255),
    discount_type ENUM('PERCENTAGE', 'FIXED', 'FREESHIP') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount_amount DECIMAL(12,2),
    min_order_value DECIMAL(12,2) DEFAULT 0,
    usage_limit INT NOT NULL,
    used_count INT DEFAULT 0,
    user_usage_limit INT DEFAULT 1,
    start_date DATETIME NULL,
    expiry_date DATETIME NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (code),
    CONSTRAINT fk_voucher_creator FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 10. Bảng Orders (Đơn hàng)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT, -- Có thể NULL nếu địa chỉ bị xóa, dùng snapshot thay thế
    voucher_id INT NULL,
    voucher_code_snapshot VARCHAR(20),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'pending', -- pending, confirmed, shipping, delivered, cancelled, returned
    subtotal DECIMAL(12,2) NOT NULL,
    discount_total DECIMAL(12,2) DEFAULT 0,
    shipping_fee DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    cancelled_by VARCHAR(10) NULL, -- USER | ADMIN
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_order_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(voucher_id),
    CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 11. Bảng Order_items (Chi tiết đơn hàng - Snapshot)
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price_snapshot DECIMAL(12,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    product_name_snapshot VARCHAR(100),
    size_snapshot VARCHAR(20),
    color_snapshot VARCHAR(30),
    INDEX (order_id),
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_item_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 12. Bảng Order_shipping_address (Lưu vết địa chỉ khi mua)
CREATE TABLE order_shipping_address (
    order_id INT PRIMARY KEY,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
	full_address TEXT NOT NULL,
    CONSTRAINT fk_shipping_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Bảng Carts (Giỏ hàng)
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Bảng Cart_items
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_snapshot DECIMAL(12,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, variant_id),
    INDEX (cart_id),
    CONSTRAINT fk_cart_item_main FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
) ENGINE=InnoDB;

-- 15. Bảng Promotions (Chiến dịch khuyến mãi)
CREATE TABLE promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    discount_type ENUM('PERCENTAGE', 'FIXED') NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    status TINYINT DEFAULT 1
) ENGINE=InnoDB;

-- 16. Bảng Promotion_items (Liên kết SP vào Campaign)
CREATE TABLE promotion_items (
    promotion_id INT NOT NULL,
    product_id INT NOT NULL,
    discount_type ENUM('PERCENTAGE', 'FIXED') NOT NULL DEFAULT 'PERCENTAGE',
    discount_value DECIMAL(12,2), -- Mức giảm riêng cho SP này trong Campaign
    PRIMARY KEY (promotion_id, product_id),
    CONSTRAINT fk_promo_main FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id) ON DELETE CASCADE,
    CONSTRAINT fk_promo_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 17. Bảng Voucher_usages (Lịch sử dùng voucher)
CREATE TABLE voucher_usages (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    voucher_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(12,2),
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usage_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(voucher_id),
    CONSTRAINT fk_usage_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_usage_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
) ENGINE=InnoDB;

DELIMITER //

CREATE PROCEDURE sp_place_order(
    IN p_user_id INT,
    IN p_variant_id INT,
    IN p_quantity INT,
    IN p_voucher_id INT,
    IN p_address_id INT,
    IN p_receiver_name VARCHAR(100),
    IN p_receiver_phone VARCHAR(20),
    IN p_full_address TEXT
)
BEGIN
    -- Error handling: If any SQL error occurs, rollback everything
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    -- 1. Lock & Check Voucher (if provided)
    IF p_voucher_id IS NOT NULL THEN
        SELECT used_count, usage_limit FROM vouchers 
        WHERE voucher_id = p_voucher_id FOR UPDATE;
        
        -- Note: Validation logic (dates, min order) usually happens in App Layer
    END IF;

    -- 2. Insert into orders (Assuming simplified columns for this example)
    INSERT INTO orders (user_id, address_id, voucher_id, subtotal, total_amount)
    VALUES (p_user_id, p_address_id, p_voucher_id, 0.00, 0.00); 
    
    SET @last_order_id = LAST_INSERT_ID();

    -- 3. Update stock with safety check
    UPDATE product_variants 
    SET stock_quantity = stock_quantity - p_quantity 
    WHERE variant_id = p_variant_id AND stock_quantity >= p_quantity;

    -- If stock wasn't updated (affected_rows = 0), force a rollback
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock or invalid variant';
    END IF;

    -- 4. Update voucher usage count
    IF p_voucher_id IS NOT NULL THEN
        UPDATE vouchers 
        SET used_count = used_count + 1 
        WHERE voucher_id = p_voucher_id AND used_count < usage_limit;
        
        IF ROW_COUNT() = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Voucher limit reached';
        END IF;
    END IF;

    -- 5. Record shipping snapshot
    INSERT INTO order_shipping_address (order_id, receiver_name, receiver_phone, full_address)
    VALUES (@last_order_id, p_receiver_name, p_receiver_phone, p_full_address);

    COMMIT;
END //

DELIMITER ;

-- Orders
ALTER TABLE orders ADD INDEX idx_orders_user (user_id);
ALTER TABLE orders ADD INDEX idx_orders_status (status);
ALTER TABLE orders ADD INDEX idx_orders_payment_status (payment_status);

-- Vouchers
ALTER TABLE vouchers ADD INDEX idx_vouchers_expiry (expiry_date);
ALTER TABLE vouchers ADD INDEX idx_vouchers_active (is_active, expiry_date);

-- Product variants
ALTER TABLE product_variants ADD INDEX idx_variants_product (product_id);

-- Voucher usages — kiểm tra user đã dùng chưa
ALTER TABLE voucher_usages ADD INDEX idx_usage_user_voucher (user_id, voucher_id);

ALTER TABLE promotions ADD INDEX idx_promo_status_date (status, start_date, end_date);