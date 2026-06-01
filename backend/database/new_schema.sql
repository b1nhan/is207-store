-- ============================================================
--  Schema: is207_db
--  MySQL 8.0+ compatible
--  Generated from structure dump 2026-05-29
--  Execute this file to recreate the full database structure.
-- ============================================================

CREATE DATABASE IF NOT EXISTS `is207_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `is207_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id`   INT          NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(50)  NOT NULL COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uq_role_name` (`role_name`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. users  (depends on: roles)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `user_id`       INT           NOT NULL AUTO_INCREMENT,
  `role_id`       INT           NOT NULL,
  `username`      VARCHAR(50)   NOT NULL COLLATE utf8mb4_unicode_ci,
  `email`         VARCHAR(100)  NOT NULL COLLATE utf8mb4_unicode_ci,
  `password_hash` VARCHAR(255)  NOT NULL COLLATE utf8mb4_unicode_ci,
  `full_name`     VARCHAR(100)           DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `phone`         VARCHAR(20)            DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `created_at`    DATETIME               DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_username` (`username`),
  UNIQUE KEY `uq_email`    (`email`),
  KEY `fk_user_role` (`role_id`),
  CONSTRAINT `fk_user_role`
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. brands
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `brands` (
  `brand_id`   INT          NOT NULL AUTO_INCREMENT,
  `brand_name` VARCHAR(100) NOT NULL COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `uq_brand_name` (`brand_name`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id`   INT          NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL COLLATE utf8mb4_unicode_ci,
  `slug`          VARCHAR(150) NOT NULL COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`category_name`),
  UNIQUE KEY `uq_slug`          (`slug`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. products  (depends on: brands, categories)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `product_id`          INT           NOT NULL AUTO_INCREMENT,
  `product_name`        VARCHAR(100)  NOT NULL COLLATE utf8mb4_unicode_ci,
  `slug`                VARCHAR(255)  NOT NULL COLLATE utf8mb4_unicode_ci,
  `product_description` TEXT                   DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `material`            VARCHAR(100)           DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `gender`              ENUM('men','women','unisex','kids')
                                               DEFAULT 'unisex' COLLATE utf8mb4_unicode_ci,
  `base_price`          DECIMAL(12,2) NOT NULL,
  `brand_id`            INT                    DEFAULT NULL,
  `category_id`         INT                    DEFAULT NULL,
  `status`              TINYINT                DEFAULT '1',
  `created_at`          DATETIME               DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `uq_product_slug` (`slug`),
  KEY `fk_product_category` (`category_id`),
  KEY `fk_product_brand`    (`brand_id`),
  CONSTRAINT `fk_product_brand`
    FOREIGN KEY (`brand_id`)    REFERENCES `brands`     (`brand_id`),
  CONSTRAINT `fk_product_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. product_variants  (depends on: products)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_variants` (
  `variant_id`     INT           NOT NULL AUTO_INCREMENT,
  `product_id`     INT           NOT NULL,
  `size`           VARCHAR(20)   NOT NULL COLLATE utf8mb4_unicode_ci,
  `color`          VARCHAR(30)   NOT NULL COLLATE utf8mb4_unicode_ci,
  `variant_price`  DECIMAL(12,2)          DEFAULT NULL,
  `stock_quantity` INT           NOT NULL  DEFAULT '0',
  `sku`            VARCHAR(50)            DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `status`         TINYINT                DEFAULT '1',
  PRIMARY KEY (`variant_id`),
  UNIQUE KEY `uq_sku` (`sku`),
  KEY `fk_variant_product` (`product_id`),
  CONSTRAINT `fk_variant_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. product_images  (depends on: products)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_images` (
  `image_id`   INT          NOT NULL AUTO_INCREMENT,
  `product_id` INT          NOT NULL,
  `image_url`  TEXT         NOT NULL COLLATE utf8mb4_unicode_ci,
  `public_id`  VARCHAR(255)          DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `is_primary` TINYINT               DEFAULT '0',
  `sort_order` INT                   DEFAULT '0',
  PRIMARY KEY (`image_id`),
  KEY `fk_image_product` (`product_id`),
  CONSTRAINT `fk_image_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. vouchers  (depends on: users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vouchers` (
  `voucher_id`         INT           NOT NULL AUTO_INCREMENT,
  `code`               VARCHAR(20)   NOT NULL COLLATE utf8mb4_unicode_ci,
  `description`        VARCHAR(255)           DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `discount_type`      ENUM('PERCENTAGE','FIXED','FREESHIP')
                                     NOT NULL COLLATE utf8mb4_unicode_ci,
  `discount_value`     DECIMAL(10,2) NOT NULL,
  `max_discount_amount` DECIMAL(12,2)          DEFAULT NULL,
  `min_order_value`    DECIMAL(12,2)           DEFAULT '0.00',
  `usage_limit`        INT           NOT NULL,
  `used_count`         INT                    DEFAULT '0',
  `user_usage_limit`   INT                    DEFAULT '1',
  `start_date`         DATETIME               DEFAULT NULL,
  `expiry_date`        DATETIME      NOT NULL,
  `is_active`          TINYINT                DEFAULT '1',
  `created_by`         INT                    DEFAULT NULL,
  `created_at`         DATETIME               DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`voucher_id`),
  UNIQUE KEY `uq_code` (`code`),
  KEY `idx_code`           (`code`),
  KEY `fk_voucher_creator` (`created_by`),
  CONSTRAINT `fk_voucher_creator`
    FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. campaigns  (depends on: users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `campaigns` (
  `campaign_id`   INT          NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(255) NOT NULL COLLATE utf8mb4_unicode_ci,
  `description`   TEXT                  DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `campaign_type` ENUM('PERCENTAGE','FIXED_PRICE','TIER_DISCOUNT','FREESHIP')
                               NOT NULL COLLATE utf8mb4_unicode_ci,
  `start_date`    DATETIME     NOT NULL,
  `end_date`      DATETIME     NOT NULL,
  `status`        TINYINT               DEFAULT '1' COMMENT '1=active, 0=inactive',
  `created_by`    INT                   DEFAULT NULL,
  `created_at`    DATETIME              DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`campaign_id`),
  KEY `idx_campaign_status_date` (`status`, `start_date`, `end_date`),
  KEY `fk_campaign_creator`      (`created_by`),
  CONSTRAINT `fk_campaign_creator`
    FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. campaign_config  (depends on: campaigns)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `campaign_config` (
  `campaign_id`    INT           NOT NULL,
  `discount_value` DECIMAL(12,2) NOT NULL
    COMMENT 'PERCENTAGE: % giảm (vd: 50). FIXED_PRICE: mức giá đồng giá (vd: 99000)',
  PRIMARY KEY (`campaign_id`),
  CONSTRAINT `fk_cc_campaign`
    FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. campaign_products  (depends on: campaigns, products)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `campaign_products` (
  `campaign_id` INT NOT NULL,
  `product_id`  INT NOT NULL,
  PRIMARY KEY (`campaign_id`, `product_id`),
  KEY `fk_cp_product` (`product_id`),
  CONSTRAINT `fk_cp_campaign`
    FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cp_product`
    FOREIGN KEY (`product_id`)  REFERENCES `products`  (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. campaign_tiers  (depends on: campaigns)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `campaign_tiers` (
  `tier_id`         INT           NOT NULL AUTO_INCREMENT,
  `campaign_id`     INT           NOT NULL,
  `min_order_value` DECIMAL(12,2) NOT NULL
    COMMENT 'Ngưỡng tổng tiền các sản phẩm trong campaign',
  `discount_value`  DECIMAL(12,2) NOT NULL
    COMMENT '% giảm khi đạt ngưỡng này',
  PRIMARY KEY (`tier_id`),
  KEY `idx_tier_campaign` (`campaign_id`, `min_order_value`),
  CONSTRAINT `fk_ct_campaign`
    FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 13. shipping_profiles  (depends on: users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipping_profiles` (
  `profile_id`     INT          NOT NULL AUTO_INCREMENT,
  `user_id`        INT          NOT NULL,
  `receiver_name`  VARCHAR(100) NOT NULL COLLATE utf8mb4_unicode_ci,
  `receiver_phone` VARCHAR(20)  NOT NULL COLLATE utf8mb4_unicode_ci,
  `full_address`   TEXT         NOT NULL COLLATE utf8mb4_unicode_ci,
  `label`          VARCHAR(50)           DEFAULT NULL
    COMMENT 'VD: Nhà riêng, Văn phòng' COLLATE utf8mb4_unicode_ci,
  `is_default`     TINYINT               DEFAULT '0',
  `created_at`     DATETIME              DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  KEY `idx_user_default` (`user_id`, `is_default`),
  CONSTRAINT `fk_profile_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 14. carts  (depends on: users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `carts` (
  `cart_id`    INT      NOT NULL AUTO_INCREMENT,
  `user_id`    INT      NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `uq_cart_user` (`user_id`),
  CONSTRAINT `fk_cart_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 15. cart_items  (depends on: carts, product_variants)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cart_items` (
  `cart_item_id`   INT           NOT NULL AUTO_INCREMENT,
  `cart_id`        INT           NOT NULL,
  `variant_id`     INT           NOT NULL,
  `quantity`       INT           NOT NULL DEFAULT '1',
  `price_snapshot` DECIMAL(12,2)          DEFAULT NULL,
  `created_at`     DATETIME               DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `uq_cart_variant` (`cart_id`, `variant_id`),
  KEY `idx_cart_id`           (`cart_id`),
  KEY `fk_cart_item_variant`  (`variant_id`),
  CONSTRAINT `fk_cart_item_main`
    FOREIGN KEY (`cart_id`)    REFERENCES `carts`            (`cart_id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_cart_item_variant`
    FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 16. orders  (depends on: users, vouchers, campaigns, shipping_profiles)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id`               INT           NOT NULL AUTO_INCREMENT,
  `user_id`                INT           NOT NULL,
  `profile_id`             INT                    DEFAULT NULL,
  `voucher_id`             INT                    DEFAULT NULL,
  `campaign_id`            INT                    DEFAULT NULL,
  `voucher_code_snapshot`  VARCHAR(20)            DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `order_date`             DATETIME               DEFAULT CURRENT_TIMESTAMP,
  `status`                 VARCHAR(30)            DEFAULT 'pending' COLLATE utf8mb4_unicode_ci,
  `subtotal`               DECIMAL(12,2) NOT NULL,
  `discount_total`         DECIMAL(12,2)          DEFAULT '0.00',
  `campaign_discount_total` DECIMAL(12,2)         DEFAULT '0.00',
  `shipping_fee`           DECIMAL(12,2)          DEFAULT '0.00',
  `total_amount`           DECIMAL(12,2) NOT NULL,
  `payment_status`         VARCHAR(20)            DEFAULT 'pending' COLLATE utf8mb4_unicode_ci,
  `cancelled_by`           VARCHAR(10)            DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `created_at`             DATETIME               DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `fk_order_user`     (`user_id`),
  KEY `fk_order_voucher`  (`voucher_id`),
  KEY `fk_order_campaign` (`campaign_id`),
  KEY `fk_order_profile`  (`profile_id`),
  CONSTRAINT `fk_order_user`
    FOREIGN KEY (`user_id`)     REFERENCES `users`             (`user_id`),
  CONSTRAINT `fk_order_voucher`
    FOREIGN KEY (`voucher_id`)  REFERENCES `vouchers`          (`voucher_id`),
  CONSTRAINT `fk_order_campaign`
    FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`         (`campaign_id`),
  CONSTRAINT `fk_order_profile`
    FOREIGN KEY (`profile_id`)  REFERENCES `shipping_profiles` (`profile_id`) ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 17. order_items  (depends on: orders, product_variants)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id`        INT           NOT NULL AUTO_INCREMENT,
  `order_id`             INT           NOT NULL,
  `variant_id`           INT           NOT NULL,
  `quantity`             INT           NOT NULL,
  `unit_price_snapshot`  DECIMAL(12,2) NOT NULL,
  `line_total`           DECIMAL(12,2) NOT NULL,
  `product_name_snapshot` VARCHAR(100)          DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `size_snapshot`        VARCHAR(20)            DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  `color_snapshot`       VARCHAR(30)            DEFAULT NULL COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`order_item_id`),
  KEY `idx_order_id`     (`order_id`),
  KEY `fk_item_variant`  (`variant_id`),
  CONSTRAINT `fk_item_order`
    FOREIGN KEY (`order_id`)   REFERENCES `orders`           (`order_id`)   ON DELETE CASCADE,
  CONSTRAINT `fk_item_variant`
    FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 18. order_shipping_address  (depends on: orders)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_shipping_address` (
  `order_id`       INT          NOT NULL,
  `receiver_name`  VARCHAR(100) NOT NULL COLLATE utf8mb4_unicode_ci,
  `receiver_phone` VARCHAR(20)  NOT NULL COLLATE utf8mb4_unicode_ci,
  `full_address`   TEXT         NOT NULL COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`order_id`),
  CONSTRAINT `fk_shipping_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 19. voucher_usages  (depends on: vouchers, users, orders)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `voucher_usages` (
  `usage_id`       INT           NOT NULL AUTO_INCREMENT,
  `voucher_id`     INT           NOT NULL,
  `user_id`        INT           NOT NULL,
  `order_id`       INT           NOT NULL,
  `discount_amount` DECIMAL(12,2)          DEFAULT NULL,
  `used_at`        DATETIME               DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usage_id`),
  KEY `fk_usage_voucher` (`voucher_id`),
  KEY `fk_usage_user`    (`user_id`),
  KEY `fk_usage_order`   (`order_id`),
  CONSTRAINT `fk_usage_voucher`
    FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`voucher_id`),
  CONSTRAINT `fk_usage_user`
    FOREIGN KEY (`user_id`)    REFERENCES `users`    (`user_id`),
  CONSTRAINT `fk_usage_order`
    FOREIGN KEY (`order_id`)   REFERENCES `orders`   (`order_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO roles (role_id, role_name) VALUES
(1, 'admin'),
(2, 'user');