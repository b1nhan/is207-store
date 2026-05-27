-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: is207_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `brand_name` (`brand_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (2,'Adidas'),(5,'H&M'),(6,'Local Brand VN'),(1,'Nike'),(3,'Uniqlo'),(4,'Zara');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_config`
--

DROP TABLE IF EXISTS `campaign_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_config` (
  `campaign_id` int NOT NULL,
  `discount_value` decimal(12,2) NOT NULL COMMENT 'PERCENTAGE: % giảm (vd: 50). FIXED_PRICE: mức giá đồng giá (vd: 99000)',
  PRIMARY KEY (`campaign_id`),
  CONSTRAINT `fk_cc_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_config`
--

LOCK TABLES `campaign_config` WRITE;
/*!40000 ALTER TABLE `campaign_config` DISABLE KEYS */;
INSERT INTO `campaign_config` VALUES (1,20.00),(2,36.00),(3,22.00),(4,50.00),(5,34.00),(6,99999.00);
/*!40000 ALTER TABLE `campaign_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_products`
--

DROP TABLE IF EXISTS `campaign_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_products` (
  `campaign_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`campaign_id`,`product_id`),
  KEY `fk_cp_product` (`product_id`),
  CONSTRAINT `fk_cp_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cp_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_products`
--

LOCK TABLES `campaign_products` WRITE;
/*!40000 ALTER TABLE `campaign_products` DISABLE KEYS */;
INSERT INTO `campaign_products` VALUES (1,1),(2,1),(4,1),(7,1),(8,1),(1,2),(2,2),(4,2),(8,2),(1,3),(2,3),(4,3),(8,3),(4,4),(8,4),(4,5),(8,5),(4,6),(8,6),(4,7),(8,7),(4,8),(6,8),(8,8),(4,9),(7,9),(8,9),(4,10),(8,10),(4,11),(6,11),(8,11),(4,12),(6,12),(7,12),(8,12),(4,13),(7,13),(8,13),(4,14),(8,14),(4,15),(6,15),(8,15),(4,16),(7,16),(8,16),(4,17),(6,17),(7,17),(8,17),(4,18),(8,18),(3,19),(4,19),(6,19),(7,19),(8,19),(4,20),(8,20),(3,21),(4,21),(7,21),(8,21),(3,22),(4,22),(8,22),(3,23),(4,23),(5,23),(7,23),(8,23),(3,24),(4,24),(5,24),(7,24),(8,24);
/*!40000 ALTER TABLE `campaign_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_tiers`
--

DROP TABLE IF EXISTS `campaign_tiers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_tiers` (
  `tier_id` int NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `min_order_value` decimal(12,2) NOT NULL COMMENT 'Ngưỡng tổng tiền các sản phẩm trong campaign',
  `discount_value` decimal(12,2) NOT NULL COMMENT '% giảm khi đạt ngưỡng này',
  PRIMARY KEY (`tier_id`),
  KEY `idx_tier_campaign` (`campaign_id`,`min_order_value`),
  CONSTRAINT `fk_ct_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_tiers`
--

LOCK TABLES `campaign_tiers` WRITE;
/*!40000 ALTER TABLE `campaign_tiers` DISABLE KEYS */;
INSERT INTO `campaign_tiers` VALUES (1,7,50000.00,15.00),(2,7,150000.00,20.00),(3,7,500000.00,34.00),(4,7,1000000.00,50.00);
/*!40000 ALTER TABLE `campaign_tiers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `campaign_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `campaign_type` enum('PERCENTAGE','FIXED_PRICE','TIER_DISCOUNT','FREESHIP') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` tinyint DEFAULT '1' COMMENT '1=active, 0=inactive',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`campaign_id`),
  KEY `idx_campaign_status_date` (`status`,`start_date`,`end_date`),
  KEY `fk_campaign_creator` (`created_by`),
  CONSTRAINT `fk_campaign_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (1,'Summer Sale',NULL,'PERCENTAGE','2026-05-17 08:00:00','2026-05-30 23:59:59',1,12,'2026-05-17 16:11:22','2026-05-27 05:48:33'),(2,'Flash Sale',NULL,'PERCENTAGE','2025-06-01 00:00:00','2025-06-30 23:59:59',0,12,'2026-05-17 16:15:12','2026-05-26 02:38:05'),(3,'123',NULL,'PERCENTAGE','2026-05-21 10:14:00','2026-05-23 10:14:00',0,15,'2026-05-21 17:14:35','2026-05-26 02:38:04'),(4,'hihi',NULL,'PERCENTAGE','2026-05-25 18:37:00','2026-05-29 23:32:00',1,15,'2026-05-26 01:32:57','2026-05-26 03:45:53'),(5,'hahaha',NULL,'PERCENTAGE','2026-05-26 01:42:00','2026-07-02 01:42:00',1,15,'2026-05-26 02:42:53','2026-05-27 05:24:41'),(6,'Flash Sale 1/6',NULL,'FIXED_PRICE','2026-05-26 22:17:00','2026-06-05 22:17:00',1,15,'2026-05-27 05:17:57','2026-05-27 05:17:57'),(7,'Summer Day','Minecraft là trò chơi điện tử phi tuyến tính và Sandbox được phát triển và phát hành bởi Mojang Studio. Trò chơi được tạo bởi Markus Persson bằng ngôn ngữ lập trình Java','TIER_DISCOUNT','2026-05-26 22:22:00','2026-06-02 22:22:00',1,15,'2026-05-27 05:23:23','2026-05-27 05:23:23'),(8,'Ship tận nhà - Mua hàng thả ga','Trong lĩnh vực thần kinh học nhận thức, thị giác của con người được xem là một quá trình “predictive processing” — tức não bộ không đơn thuần tiếp nhận dữ liệu từ mắt một cách thụ động, mà liên tục xây dựng các mô hình dự đoán về môi trường xung quanh. Thông tin thị giác thực tế sau đó được dùng để xác nhận hoặc điều chỉnh những dự đoán này. Cơ chế đó giúp não giảm đáng kể lượng dữ liệu cần xử lý mỗi giây, từ đó tối ưu tốc độ phản ứng và tiết kiệm năng lượng. Đây cũng là lý do con người có thể đọc một câu bị thiếu vài ký tự nhưng vẫn hiểu nội dung, hoặc đôi khi gặp các hiện tượng ảo giác thị giác khi dự đoán của não không khớp hoàn toàn với tín hiệu cảm nhận thực tế.','FREESHIP','2026-05-25 22:28:00','2026-06-04 22:28:00',1,15,'2026-05-27 05:28:55','2026-05-27 05:28:55');
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `variant_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price_snapshot` decimal(12,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `cart_id` (`cart_id`,`variant_id`),
  KEY `cart_id_2` (`cart_id`),
  KEY `fk_cart_item_variant` (`variant_id`),
  CONSTRAINT `fk_cart_item_main` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_item_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,1,19,1,299000.00,'2026-03-11 21:11:41'),(2,1,67,1,720000.00,'2026-03-11 21:11:41'),(3,2,54,2,380000.00,'2026-03-11 21:11:41'),(4,3,25,1,199000.00,'2026-03-11 21:11:41'),(5,3,49,1,550000.00,'2026-03-11 21:11:41'),(46,5,76,1,360000.00,'2026-05-27 15:33:58'),(47,5,15,1,299000.00,'2026-05-27 15:34:01'),(48,5,33,1,750000.00,'2026-05-27 15:34:02'),(49,5,36,1,650000.00,'2026-05-27 15:34:03'),(50,5,75,2,360000.00,'2026-05-27 23:22:32'),(52,5,1,1,350000.00,'2026-05-27 23:23:24'),(53,5,74,1,180000.00,'2026-05-27 23:24:52');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,7,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(2,8,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(3,9,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(4,12,'2026-05-15 15:39:18','2026-05-15 15:39:18'),(5,15,'2026-05-17 00:58:22','2026-05-17 00:58:22');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Áo thun','ao-thun'),(2,'Áo khoác','ao-khoac'),(3,'Quần jeans','quan-jeans'),(4,'Quần short','quan-short'),(5,'Váy & Đầm','vay-dam'),(6,'Phụ kiện','phu-kien'),(7,'Áo thể thao','ao-the-thao'),(8,'Quần CU','quan-cu'),(9,'Quần bơi','quan-boi');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `variant_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price_snapshot` decimal(12,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `product_name_snapshot` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_snapshot` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_snapshot` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `fk_item_variant` (`variant_id`),
  CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,6,1,350000.00,350000.00,'Áo Thun Basic Nike Swoosh','M','Đen'),(2,1,54,1,380000.00,380000.00,'Quần Short Thể Thao Nike Dri-FIT','M','Đen'),(3,2,10,1,420000.00,420000.00,'Áo Thun Adidas 3-Stripes','M','Xanh navy'),(4,3,35,1,750000.00,750000.00,'Áo Khoác Denim Zara','M','Xanh nhạt'),(5,3,46,1,620000.00,620000.00,'Quần Jeans Slim Fit Zara','30','Xanh trung'),(6,4,16,1,299000.00,299000.00,'Áo Thun Uniqlo SupimaⓇ','M','Trắng'),(7,5,31,1,890000.00,890000.00,'Áo Khoác Gió Nike Running','M','Đen'),(8,6,23,1,280000.00,280000.00,'Áo Thun Local Brand Oversize','M','Đen'),(9,7,12,2,420000.00,840000.00,'Áo Thun Adidas 3-Stripes','S','Xám'),(10,8,15,2,299000.00,598000.00,'Áo Thun Uniqlo SupimaⓇ','S','Trắng'),(11,8,34,3,750000.00,2250000.00,'Áo Khoác Denim Zara','M','Xanh nhạt'),(12,9,25,1,199000.00,199000.00,'Áo Thun H&M Basic Tee','S','Hồng'),(13,9,14,3,420000.00,1260000.00,'Áo Thun Adidas 3-Stripes','L','Xám'),(14,10,1,4,350000.00,1400000.00,'Áo Thun Basic Nike Swoosh','S','Trắng'),(15,10,76,1,360000.00,360000.00,'Áo ba lỗ mixi','M','Blue yung kai'),(16,11,10,1,420000.00,420000.00,'Áo Thun Adidas 3-Stripes','M','Xanh navy'),(17,11,75,1,360000.00,360000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(18,12,75,5,360000.00,1800000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(19,13,15,2,299000.00,598000.00,'Áo Thun Uniqlo SupimaⓇ','S','Trắng'),(20,14,15,3,299000.00,897000.00,'Áo Thun Uniqlo SupimaⓇ','S','Trắng'),(21,15,75,1,360000.00,360000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(22,15,20,1,280000.00,280000.00,'Áo Thun Local Brand Oversize','M','Be'),(23,15,60,1,280000.00,280000.00,'Quần Short Jeans Rách H&M','S','Xanh rách'),(24,16,9,1,420000.00,420000.00,'Áo Thun Adidas 3-Stripes','S','Xanh navy'),(25,16,29,1,850000.00,850000.00,'Áo Khoác Gió Nike Running','S','Đen'),(26,16,75,1,360000.00,360000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(27,17,75,1,260000.00,260000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(28,18,76,3,260000.00,780000.00,'Áo ba lỗ mixi','M','Blue yung kai'),(29,19,75,1,260000.00,260000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(30,20,75,2,260000.00,520000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(31,21,75,2,360000.00,720000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(32,21,15,1,299000.00,299000.00,'Áo Thun Uniqlo SupimaⓇ','S','Trắng'),(33,22,75,2,360000.00,720000.00,'Áo ba lỗ mixi','XXL','Đen ánh đỏ formula'),(34,22,74,2,180000.00,360000.00,'Túi Tote Canvas Local Brand','Free Size','Kem'),(35,22,18,1,299000.00,299000.00,'Áo Thun Uniqlo SupimaⓇ','M','Đen'),(36,22,34,1,750000.00,750000.00,'Áo Khoác Denim Zara','M','Xanh nhạt'),(37,22,73,1,250000.00,250000.00,'Mũ Bucket Nike','Free Size','Trắng'),(38,22,29,1,850000.00,850000.00,'Áo Khoác Gió Nike Running','S','Đen'),(39,23,15,1,299000.00,299000.00,'Áo Thun Uniqlo SupimaⓇ','S','Trắng'),(40,23,36,1,650000.00,650000.00,'Áo Khoác Hoodie Adidas','S','Xám'),(41,23,29,1,850000.00,850000.00,'Áo Khoác Gió Nike Running','S','Đen');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_shipping_address`
--

DROP TABLE IF EXISTS `order_shipping_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_shipping_address` (
  `order_id` int NOT NULL,
  `receiver_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`order_id`),
  CONSTRAINT `fk_shipping_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_shipping_address`
--

LOCK TABLES `order_shipping_address` WRITE;
/*!40000 ALTER TABLE `order_shipping_address` DISABLE KEYS */;
INSERT INTO `order_shipping_address` VALUES (1,'Nguyễn Văn An','0901234567','12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM'),(2,'Trần Thị Bích','0912345678','56 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, TP.HCM'),(3,'Lê Minh Cường','0923456789','78 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP.HCM'),(4,'Phạm Thị Dung','0934567890','90 Võ Văn Tần, Phường 6, Quận 3, TP.HCM'),(5,'Hoàng Văn Em','0945678901','101 Cách Mạng Tháng 8, Phường 4, Quận 3, TP.HCM'),(6,'Nguyễn Văn An','0901234567','12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM'),(7,'New Product','0123457989','Product description'),(8,'MCK','0132456789','ABCDJDasdasd'),(9,'HNK','0123456789','36 Yên Lãng'),(10,'SonTungMTP','0132456797','HCM'),(11,'Wxrdie','0132456798','HCM'),(12,'Wxrdie','0132456798','HCM'),(13,'MCK','0213456789','UIT - Cổng A, Hàn Thuyên'),(14,'Wxrdie','0132456798','HCM'),(15,'Sơn Tùng MTP','0132456798','HCM UIT'),(16,'Wxrdie','0132456798','HCM'),(17,'Wxrdie','0132456798','HCM'),(18,'Wxrdie','0132456798','HCM'),(19,'SonTung','0123456789','UIT Cổng A'),(20,'Sơn Tùng MTP','0132456798','HCM UIT'),(21,'Wxrdie','0132456798','HCM'),(22,'Wxrdie','0132456798','HCM'),(23,'Wxrdie','0132456798','HCM');
/*!40000 ALTER TABLE `order_shipping_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `profile_id` int DEFAULT NULL,
  `voucher_id` int DEFAULT NULL,
  `campaign_id` int DEFAULT NULL,
  `voucher_code_snapshot` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `subtotal` decimal(12,2) NOT NULL,
  `discount_total` decimal(12,2) DEFAULT '0.00',
  `campaign_discount_total` decimal(12,2) DEFAULT '0.00',
  `shipping_fee` decimal(12,2) DEFAULT '0.00',
  `total_amount` decimal(12,2) NOT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `cancelled_by` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `fk_order_user` (`user_id`),
  KEY `fk_order_voucher` (`voucher_id`),
  KEY `fk_order_campaign` (`campaign_id`),
  KEY `fk_order_profile` (`profile_id`),
  CONSTRAINT `fk_order_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`),
  CONSTRAINT `fk_order_profile` FOREIGN KEY (`profile_id`) REFERENCES `shipping_profiles` (`profile_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_order_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`voucher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,NULL,4,NULL,'FREESHIP','2026-01-15 10:30:00','delivered',700000.00,30000.00,0.00,0.00,670000.00,'paid',NULL,'2026-03-11 21:11:41'),(2,3,NULL,NULL,NULL,NULL,'2026-01-20 14:00:00','delivered',420000.00,0.00,0.00,30000.00,450000.00,'paid',NULL,'2026-03-11 21:11:41'),(3,4,NULL,2,NULL,'SUMMER50K','2026-02-05 09:15:00','cancelled',650000.00,50000.00,0.00,30000.00,630000.00,'paid','ADMIN','2026-03-11 21:11:41'),(4,5,NULL,NULL,NULL,NULL,'2026-02-10 16:45:00','delivered',350000.00,0.00,0.00,30000.00,380000.00,'pending',NULL,'2026-03-11 21:11:41'),(5,6,NULL,3,NULL,'VIP20','2026-03-01 11:00:00','delivered',890000.00,100000.00,0.00,30000.00,820000.00,'pending',NULL,'2026-03-11 21:11:41'),(6,2,NULL,NULL,NULL,NULL,'2026-03-05 08:00:00','cancelled',280000.00,0.00,0.00,30000.00,310000.00,'refunded','USER','2026-03-11 21:11:41'),(7,12,NULL,NULL,NULL,NULL,'2026-05-15 15:45:51','cancelled',840000.00,0.00,0.00,30000.00,870000.00,'pending','USER','2026-05-15 15:45:51'),(8,15,NULL,NULL,NULL,NULL,'2026-05-17 01:19:02','delivered',2848000.00,0.00,0.00,30000.00,2878000.00,'pending',NULL,'2026-05-17 01:19:02'),(9,15,NULL,NULL,NULL,NULL,'2026-05-19 20:13:34','delivered',1459000.00,0.00,0.00,30000.00,1489000.00,'pending',NULL,'2026-05-19 20:13:34'),(10,15,NULL,NULL,NULL,NULL,'2026-05-21 10:03:52','delivered',1760000.00,0.00,0.00,30000.00,1790000.00,'pending',NULL,'2026-05-21 10:03:52'),(11,15,3,NULL,3,NULL,'2026-05-22 02:57:54','delivered',780000.00,0.00,79200.00,30000.00,730800.00,'pending',NULL,'2026-05-22 02:57:54'),(12,15,3,2,3,'SUMMER50K','2026-05-22 15:31:43','delivered',1800000.00,50000.00,396000.00,30000.00,1384000.00,'pending',NULL,'2026-05-22 15:31:43'),(13,15,2,NULL,NULL,NULL,'2026-05-22 15:33:33','cancelled',598000.00,0.00,0.00,30000.00,628000.00,'pending','USER','2026-05-22 15:33:33'),(14,15,3,3,NULL,'VIP20','2026-05-22 15:35:36','delivered',897000.00,100000.00,0.00,30000.00,827000.00,'pending',NULL,'2026-05-22 15:35:36'),(15,15,4,NULL,3,NULL,'2026-05-23 01:01:34','delivered',920000.00,0.00,79200.00,30000.00,870800.00,'pending',NULL,'2026-05-23 01:01:34'),(16,15,3,NULL,NULL,NULL,'2026-05-23 13:14:37','delivered',1630000.00,0.00,0.00,30000.00,1660000.00,'pending',NULL,'2026-05-23 13:14:37'),(17,15,3,NULL,NULL,NULL,'2026-05-25 11:57:50','delivered',260000.00,0.00,0.00,30000.00,290000.00,'pending',NULL,'2026-05-25 11:57:50'),(18,15,3,NULL,NULL,NULL,'2026-05-25 19:17:09','delivered',780000.00,0.00,0.00,30000.00,810000.00,'pending',NULL,'2026-05-25 19:17:09'),(19,12,1,NULL,NULL,NULL,'2026-05-26 00:11:48','delivered',260000.00,0.00,0.00,30000.00,290000.00,'paid',NULL,'2026-05-26 00:11:48'),(20,15,4,NULL,NULL,NULL,'2026-05-26 02:24:57','cancelled',520000.00,0.00,0.00,30000.00,550000.00,'cancelled','ADMIN','2026-05-26 02:24:57'),(21,15,3,NULL,NULL,NULL,'2026-05-26 02:49:50','delivered',1019000.00,0.00,0.00,30000.00,1049000.00,'paid',NULL,'2026-05-26 02:49:50'),(22,15,3,NULL,4,NULL,'2026-05-27 15:18:26','delivered',3229000.00,0.00,1614500.00,30000.00,1644500.00,'paid',NULL,'2026-05-27 15:18:26'),(23,15,3,NULL,4,NULL,'2026-05-27 15:33:45','pending',1799000.00,0.00,899500.00,30000.00,929500.00,'pending',NULL,'2026-05-27 15:33:45');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_primary` tinyint DEFAULT '0',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`image_id`),
  KEY `fk_image_product` (`product_id`),
  CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://placehold.co/600x800/111/fff?text=Nike+Tee+1',NULL,1,0),(2,1,'https://placehold.co/600x800/222/fff?text=Nike+Tee+2',NULL,0,1),(3,2,'https://placehold.co/600x800/333/fff?text=Adidas+Tee+1',NULL,1,0),(4,3,'https://placehold.co/600x800/444/fff?text=Uniqlo+Tee+1',NULL,1,0),(5,3,'https://placehold.co/600x800/555/fff?text=Uniqlo+Tee+2',NULL,0,1),(6,4,'https://placehold.co/600x800/666/fff?text=Local+Oversize+1',NULL,1,0),(7,5,'https://placehold.co/600x800/777/fff?text=HM+Basic+1',NULL,1,0),(8,6,'https://placehold.co/600x800/888/fff?text=Nike+Jacket+1',NULL,1,0),(9,6,'https://placehold.co/600x800/999/fff?text=Nike+Jacket+2',NULL,0,1),(10,7,'https://placehold.co/600x800/aaa/fff?text=Zara+Denim+1',NULL,1,0),(11,8,'https://placehold.co/600x800/bbb/fff?text=Adidas+Hoodie+1',NULL,1,0),(12,9,'https://placehold.co/600x800/ccc/fff?text=Local+Bomber+1',NULL,1,0),(13,10,'https://placehold.co/600x800/ddd/fff?text=Zara+Jeans+1',NULL,1,0),(14,11,'https://placehold.co/600x800/eee/333?text=HM+Wideleg+1',NULL,1,0),(15,12,'https://placehold.co/600x800/123/fff?text=Uniqlo+Skinny+1',NULL,1,0),(16,13,'https://placehold.co/600x800/456/fff?text=Nike+Short+1',NULL,1,0),(17,14,'https://placehold.co/600x800/789/fff?text=Zara+Short+1',NULL,1,0),(18,15,'https://placehold.co/600x800/abc/fff?text=HM+Jeans+Short+1',NULL,1,0),(19,16,'https://placehold.co/600x800/def/fff?text=Zara+Dress+1',NULL,1,0),(20,16,'https://placehold.co/600x800/012/fff?text=Zara+Dress+2',NULL,0,1),(21,17,'https://placehold.co/600x800/345/fff?text=HM+Skirt+1',NULL,1,0),(22,18,'https://placehold.co/600x800/678/fff?text=Local+Maxi+1',NULL,1,0),(23,19,'https://placehold.co/600x800/901/fff?text=Nike+Bucket+1',NULL,1,0),(24,20,'https://placehold.co/600x800/234/fff?text=Local+Tote+1',NULL,1,0),(25,23,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779173110/products/f5koa7nctt3fko1wcthj.jpg','products/f5koa7nctt3fko1wcthj',1,0),(26,23,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779173111/products/ahu90yqgq1hfscuc3xpx.png','products/ahu90yqgq1hfscuc3xpx',0,1),(27,24,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779327990/products/rpqbxojbaq4rjxk3bwdt.jpg','products/rpqbxojbaq4rjxk3bwdt',1,0),(28,24,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779327992/products/znxivjplfcj4x6v06wli.jpg','products/znxivjplfcj4x6v06wli',0,1),(29,22,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779713230/products/a7powewzasnjrdkufskh.jpg','products/a7powewzasnjrdkufskh',1,0),(31,25,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779901488/products/ts4sokiuubfx5zvkr5aj.jpg','products/ts4sokiuubfx5zvkr5aj',0,1),(32,25,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779901489/products/mnfajtazcdjlnfwioea6.jpg','products/mnfajtazcdjlnfwioea6',0,2),(33,25,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779901490/products/cuuqa3ruhibvf30v4egv.jpg','products/cuuqa3ruhibvf30v4egv',0,3),(34,25,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779901491/products/kw9m7xwitp1wgihgkh4i.jpg','products/kw9m7xwitp1wgihgkh4i',0,4),(35,25,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779901492/products/dlpiswuzbirzy843fnk9.jpg','products/dlpiswuzbirzy843fnk9',0,5),(37,25,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779901494/products/zewa0ak7rz4tf4b61tiv.jpg','products/zewa0ak7rz4tf4b61tiv',0,7),(38,25,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779901495/products/ursph60e1otzjsrpdnk7.jpg','products/ursph60e1otzjsrpdnk7',0,8),(39,25,'https://res.cloudinary.com/dlefkbf8l/image/upload/v1779901621/products/gdm79rdrup1gao7nsdvm.jpg','products/gdm79rdrup1gao7nsdvm',1,9);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `variant_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `size` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variant_price` decimal(12,2) DEFAULT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  PRIMARY KEY (`variant_id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `fk_variant_product` (`product_id`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'S','Trắng',NULL,26,'NIKE-TEE-S-WHT',1),(2,1,'M','Trắng',NULL,45,'NIKE-TEE-M-WHT',1),(3,1,'L','Trắng',NULL,40,'NIKE-TEE-L-WHT',1),(4,1,'XL','Trắng',NULL,20,'NIKE-TEE-XL-WHT',1),(5,1,'S','Đen',NULL,25,'NIKE-TEE-S-BLK',1),(6,1,'M','Đen',NULL,50,'NIKE-TEE-M-BLK',1),(7,1,'L','Đen',NULL,35,'NIKE-TEE-L-BLK',1),(8,1,'XL','Đen',NULL,15,'NIKE-TEE-XL-BLK',1),(9,2,'S','Xanh navy',NULL,19,'ADI-TEE-S-NVY',1),(10,2,'M','Xanh navy',NULL,39,'ADI-TEE-M-NVY',1),(11,2,'L','Xanh navy',NULL,30,'ADI-TEE-L-NVY',1),(12,2,'S','Xám',NULL,25,'ADI-TEE-S-GRY',1),(13,2,'M','Xám',NULL,35,'ADI-TEE-M-GRY',1),(14,2,'L','Xám',NULL,17,'ADI-TEE-L-GRY',1),(15,3,'S','Trắng',NULL,43,'UNI-TEE-S-WHT',1),(16,3,'M','Trắng',NULL,60,'UNI-TEE-M-WHT',1),(17,3,'L','Trắng',NULL,45,'UNI-TEE-L-WHT',1),(18,3,'M','Đen',NULL,54,'UNI-TEE-M-BLK',1),(19,3,'L','Đen',NULL,40,'UNI-TEE-L-BLK',1),(20,4,'M','Be',NULL,29,'LB-OS-M-BEI',1),(21,4,'L','Be',NULL,25,'LB-OS-L-BEI',1),(22,4,'XL','Be',NULL,20,'LB-OS-XL-BEI',1),(23,4,'M','Đen',NULL,35,'LB-OS-M-BLK',1),(24,4,'L','Đen',NULL,30,'LB-OS-L-BLK',1),(25,5,'S','Hồng',NULL,39,'HM-TEE-S-PNK',1),(26,5,'M','Hồng',NULL,50,'HM-TEE-M-PNK',1),(27,5,'S','Trắng',NULL,45,'HM-TEE-S-WHT',1),(28,5,'M','Trắng',NULL,55,'HM-TEE-M-WHT',1),(29,6,'S','Đen',850000.00,12,'NIKE-JKT-S-BLK',1),(30,6,'M','Đen',850000.00,20,'NIKE-JKT-M-BLK',1),(31,6,'L','Đen',850000.00,18,'NIKE-JKT-L-BLK',1),(32,6,'M','Xanh lá',890000.00,12,'NIKE-JKT-M-GRN',1),(33,7,'S','Xanh nhạt',NULL,20,'ZARA-DJK-S-LBL',1),(34,7,'M','Xanh nhạt',NULL,21,'ZARA-DJK-M-LBL',1),(35,7,'L','Xanh nhạt',NULL,19,'ZARA-DJK-L-LBL',1),(36,8,'S','Xám',NULL,19,'ADI-HDI-S-GRY',1),(37,8,'M','Xám',NULL,30,'ADI-HDI-M-GRY',1),(38,8,'L','Xám',NULL,25,'ADI-HDI-L-GRY',1),(39,8,'M','Đen',NULL,35,'ADI-HDI-M-BLK',1),(40,9,'M','Xanh navy',NULL,15,'LB-BMB-M-NVY',1),(41,9,'L','Xanh navy',NULL,12,'LB-BMB-L-NVY',1),(42,9,'M','Đen',NULL,18,'LB-BMB-M-BLK',1),(43,10,'28','Xanh trung',NULL,20,'ZARA-SLM-28-MBL',1),(44,10,'30','Xanh trung',NULL,30,'ZARA-SLM-30-MBL',1),(45,10,'32','Xanh trung',NULL,25,'ZARA-SLM-32-MBL',1),(46,10,'34','Xanh trung',NULL,16,'ZARA-SLM-34-MBL',1),(47,11,'26','Xanh nhạt',NULL,20,'HM-WDL-26-LBL',1),(48,11,'28','Xanh nhạt',NULL,25,'HM-WDL-28-LBL',1),(49,11,'30','Xanh nhạt',NULL,20,'HM-WDL-30-LBL',1),(50,12,'28','Đen',NULL,30,'UNI-SKN-28-BLK',1),(51,12,'30','Đen',NULL,35,'UNI-SKN-30-BLK',1),(52,12,'32','Đen',NULL,28,'UNI-SKN-32-BLK',1),(53,13,'S','Đen',NULL,40,'NIKE-SHT-S-BLK',1),(54,13,'M','Đen',NULL,50,'NIKE-SHT-M-BLK',1),(55,13,'L','Đen',NULL,35,'NIKE-SHT-L-BLK',1),(56,13,'M','Xám',NULL,40,'NIKE-SHT-M-GRY',1),(57,14,'S','Be',NULL,25,'ZARA-KAK-S-BEI',1),(58,14,'M','Be',NULL,30,'ZARA-KAK-M-BEI',1),(59,14,'L','Be',NULL,20,'ZARA-KAK-L-BEI',1),(60,15,'S','Xanh rách',NULL,19,'HM-JSH-S-DST',1),(61,15,'M','Xanh rách',NULL,25,'HM-JSH-M-DST',1),(62,16,'S','Hoa đỏ',NULL,15,'ZARA-MDR-S-RED',1),(63,16,'M','Hoa đỏ',NULL,20,'ZARA-MDR-M-RED',1),(64,16,'L','Hoa đỏ',NULL,12,'ZARA-MDR-L-RED',1),(65,16,'S','Hoa xanh',NULL,15,'ZARA-MDR-S-BLU',1),(66,16,'M','Hoa xanh',NULL,18,'ZARA-MDR-M-BLU',1),(67,17,'S','Xanh nhạt',NULL,20,'HM-MNS-S-LBL',1),(68,17,'M','Xanh nhạt',NULL,25,'HM-MNS-M-LBL',1),(69,18,'S','Vàng bo',NULL,15,'LB-MAX-S-YLW',1),(70,18,'M','Vàng bo',NULL,20,'LB-MAX-M-YLW',1),(71,18,'L','Vàng bo',NULL,15,'LB-MAX-L-YLW',1),(72,19,'Free Size','Đen',NULL,50,'NIKE-BCK-FS-BLK',1),(73,19,'Free Size','Trắng',NULL,39,'NIKE-BCK-FS-WHT',1),(74,20,'Free Size','Kem',NULL,28,'LB-TOTE-FS-CRM',1),(75,24,'XXL','Đen ánh đỏ formula',NULL,22,NULL,1),(76,24,'M','Blue yung kai',NULL,8,'LOCA-AOBALO-BLUE-M-667D',1);
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_description` text COLLATE utf8mb4_unicode_ci,
  `material` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('men','women','unisex','kids') COLLATE utf8mb4_unicode_ci DEFAULT 'unisex',
  `base_price` decimal(12,2) NOT NULL,
  `brand_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `fk_product_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Áo Thun Basic Nike Swoosh','ao-thun-basic-nike-swoosh','Áo thun cotton cao cấp, logo Swoosh thêu nổi, phù hợp mặc hàng ngày.','Cotton 100%','unisex',350000.00,1,1,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(2,'Áo Thun Adidas 3-Stripes','ao-thun-adidas-3-stripes','Áo thun thể thao với 3 sọc đặc trưng của Adidas, chất liệu thoáng mát.','Cotton 95% Spandex 5%','men',420000.00,2,1,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(3,'Áo Thun Uniqlo SupimaⓇ','ao-thun-uniqlo-supima','Chất liệu Supima cotton mềm mịn, form regular fit, nhiều màu.','Supima Cotton 100%','unisex',299000.00,3,1,1,'2026-03-11 21:11:41','2026-05-26 02:47:55'),(4,'Áo Thun Local Brand Oversize','ao-thun-local-brand-oversize','Form oversize trend, in hoạ tiết street art độc quyền.','Cotton 100%','unisex',280000.00,6,1,1,'2026-03-11 21:11:41','2026-05-27 05:46:26'),(5,'Áo Thun H&M Basic Tee','ao-thun-hm-basic-tee','Áo thun basic giá tốt, nhiều màu sắc đa dạng.','Cotton 100%','women',199000.00,5,1,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(6,'Áo Khoác Gió Nike Running','ao-khoac-gio-nike-running','Áo khoác gió nhẹ, chống nước nhẹ, lý tưởng cho chạy bộ và hoạt động ngoài trời.','Polyester 100%','men',890000.00,1,2,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(7,'Áo Khoác Denim Zara','ao-khoac-denim-zara','Áo khoác denim classic, form regular, wash nhạt thời thượng.','Denim Cotton 100%','unisex',750000.00,4,2,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(8,'Áo Khoác Hoodie Adidas','ao-khoac-hoodie-adidas','Hoodie nỉ bông dày dặn, có túi kangaroo, logo thêu ngực.','Cotton 80% Polyester 20%','unisex',650000.00,2,2,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(9,'Áo Khoác Bomber Local Brand','ao-khoac-bomber-local-brand','Bomber jacket phong cách Y2K, lót satin, nhiều chi tiết độc đáo.','Polyester 100%','unisex',580000.00,6,2,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(10,'Quần Jeans Slim Fit Zara','quan-jeans-slim-fit-zara','Quần jeans slim fit co giãn nhẹ, wash medium, basic dễ phối.','Cotton 98% Elastane 2%','men',620000.00,4,3,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(11,'Quần Jeans Ống Rộng H&M','quan-jeans-ong-rong-hm','Quần jeans ống rộng wide-leg, lưng cao, phong cách retro.','Cotton 100%','women',550000.00,5,3,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(12,'Quần Jeans Skinny Uniqlo','quan-jeans-skinny-uniqlo','Quần jeans skinny co giãn 4 chiều, thoải mái cả ngày.','Cotton 92% Elastane 8%','unisex',490000.00,3,3,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(13,'Quần Short Thể Thao Nike Dri-FIT','quan-short-nike-dri-fit','Quần short thể thao công nghệ Dri-FIT thấm hút mồ hôi nhanh.','Polyester 100%','men',380000.00,1,4,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(14,'Quần Short Kaki Zara','quan-short-kaki-zara','Quần short kaki basic, túi hộp, phù hợp đi chơi và đi học.','Cotton 100%','men',320000.00,4,4,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(15,'Quần Short Jeans Rách H&M','quan-short-jeans-rach-hm','Quần short jeans distressed, hem raw, phong cách cá tính.','Cotton 100%','women',280000.00,5,4,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(16,'Đầm Midi Floral Zara','dam-midi-floral-zara','Đầm midi họa tiết hoa, cổ V, tay bồng, thanh lịch dịu dàng.','Viscose 100%','women',720000.00,4,5,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(17,'Váy Mini Denim H&M','vay-mini-denim-hm','Váy mini denim, lưng thun co giãn, dễ phối với áo thun.','Cotton 100%','women',380000.00,5,5,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(18,'Đầm Maxi Boho Local Brand','dam-maxi-boho-local-brand','Đầm maxi boho chiffon nhẹ bay, phù hợp đi biển và du lịch.','Chiffon Polyester 100%','women',450000.00,6,5,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(19,'Mũ Bucket Nike','mu-bucket-nike','Mũ bucket vành tròn, logo thêu, chống nắng tốt.','Cotton 100%','unisex',250000.00,1,6,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(20,'Túi Tote Canvas Local Brand','tui-tote-canvas-local-brand','Túi tote canvas dày dặn, in slogan, dung tích lớn.','Canvas Cotton 100%','unisex',180000.00,6,6,1,'2026-03-11 21:11:41','2026-05-22 23:14:07'),(21,'Áo con chó','ao-con-cho',NULL,NULL,'unisex',360000.00,6,1,1,'2026-05-19 13:11:03','2026-05-19 13:11:03'),(22,'Áo con chó là bạn không phải tôi','ao-con-cho-la-ban-khong-phai-toi',NULL,NULL,'unisex',360000.00,6,1,1,'2026-05-19 13:11:27','2026-05-19 13:11:27'),(23,'Áo con chó là bạn không phải tôi','ao-con-cho-la-ban-khong-phai-toi-hihi',NULL,NULL,'unisex',360000.00,6,1,1,'2026-05-19 13:14:11','2026-05-19 13:44:38'),(24,'Áo ba lỗ mixi','ao-ba-lo-mixi','Áo ba lỗ mixi là lựa chọn hoàn hảo cho những ai yêu thích phong cách trẻ trung và năng động. Với chất liệu polyester 100%, sản phẩm này mang đến cảm giác thoải mái và dễ chịu khi穿. Áo ba lỗ mixi còn phù hợp với nhiều dịp khác nhau, từ đi chơi, đi học cho đến tham gia các hoạt động ngoài trời. Đặc biệt, với sự kết hợp của hai yếu tố hihi và hehe, áo ba lỗ mixi sẽ khiến bạn trở nên tự tin và phong cách hơn.','Polyester 100%, Hihi, Hehe','unisex',360000.00,6,7,1,'2026-05-21 08:46:25','2026-05-28 00:43:40'),(25,'Tặng em 1 cành hồng','tang-em-1-canh-hong','Tặngg iem 1 cànhh hồnggg','Hihi','unisex',555555.00,6,6,1,'2026-05-28 00:02:01','2026-05-28 00:02:01');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_profiles`
--

DROP TABLE IF EXISTS `shipping_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_profiles` (
  `profile_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `receiver_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'VD: Nhà riêng, Văn phòng',
  `is_default` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  KEY `idx_user_default` (`user_id`,`is_default`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_profiles`
--

LOCK TABLES `shipping_profiles` WRITE;
/*!40000 ALTER TABLE `shipping_profiles` DISABLE KEYS */;
INSERT INTO `shipping_profiles` VALUES (1,12,'SonTung','0123456789','UIT Cổng A',NULL,0,'2026-05-22 01:50:58'),(2,15,'MCK','0213456789','UIT - Cổng A, Hàn Thuyên','Trường học',0,'2026-05-22 02:19:51'),(3,15,'Wxrdie','0132456798','HCM',NULL,1,'2026-05-22 02:20:58'),(4,15,'Sơn Tùng MTP','0132456798','HCM UIT','Home',0,'2026-05-22 15:55:03');
/*!40000 ALTER TABLE `shipping_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_user_role` (`role_id`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'admin','admin@is207.dev','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Admin System','0900000001','2026-03-11 21:11:41','2026-03-11 21:11:41'),(2,2,'nguyen_an','nguyenan@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Nguyễn Văn An','0901234567','2026-03-11 21:11:41','2026-03-11 21:11:41'),(3,2,'tran_bich','tranbich@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Trần Thị Bích','0912345678','2026-03-11 21:11:41','2026-03-11 21:11:41'),(4,2,'le_cuong','lecuong@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Lê Minh Cường','0923456789','2026-03-11 21:11:41','2026-03-11 21:11:41'),(5,2,'pham_dung','phamdung@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Phạm Thị Dung','0934567890','2026-03-11 21:11:41','2026-03-11 21:11:41'),(6,2,'hoang_em','hoangemail@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Hoàng Văn Em','0945678901','2026-03-11 21:11:41','2026-03-11 21:11:41'),(7,2,'vo_phuong','vophuong@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Võ Thị Phương','0956789012','2026-03-11 21:11:41','2026-03-11 21:11:41'),(8,2,'do_giang','dogiang@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Đỗ Quang Giang','0967890123','2026-03-11 21:11:41','2026-03-11 21:11:41'),(9,2,'bui_huong','buihuong@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Bùi Thị Hương','0978901234','2026-03-11 21:11:41','2026-03-11 21:11:41'),(10,2,'nguyen_long','nguyenlong@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.','Nguyễn Hoàng Long','0989012345','2026-03-11 21:11:41','2026-03-11 21:11:41'),(11,2,'Admin123','admin@admin.com','$2b$10$Glu4oSZAfiuwmq01W.OcqO5OH4sB4HPfdaYZkLMDiLqpF3H.PuQdO','i am admin','0123456789','2026-03-24 05:56:59','2026-03-24 07:02:48'),(12,1,'Ad123','admin@ad.com','$2b$10$DQJm43m2x3GiBVToyCECGub1UaOmnOzN8fE2gLZlVPVcV4T7d3tDS','i am admin','0123456789','2026-04-10 16:43:20','2026-05-05 08:58:41'),(13,2,'MCK','mck@nolabel.com','$2b$10$ksrz//We0ghiIZRe4Y7LKOqmGwJ/1zuwi2B3bYAZwoJnqAmNen2gq',NULL,NULL,'2026-05-17 00:04:12','2026-05-17 00:04:12'),(14,2,'Admin123hihi','Admin123@admin.com','$2b$10$eU9veySDNNj9mVL3s/A2r.gRMoHT09RURnmdpv64wIDhK0cE5GWV2',NULL,NULL,'2026-05-17 00:10:59','2026-05-17 00:10:59'),(15,1,'Admin321','Admin321@admin.com','$2b$10$W53Jk/lo3dx2tyMOsCMeyuTkNmylnVvkztOubqS9E33LlsUtmKRjC','Nguyễn Văn Admin','0123456789','2026-05-17 00:14:23','2026-05-22 00:22:03'),(16,2,'test','24520040@gm.uit.edu.vn','$2b$10$yF.l5a9BCpGToS3gUHbX/eabYTrywbcy//nBI.lTMdNsCFL37DVKW',NULL,NULL,'2026-05-25 16:52:42','2026-05-25 16:53:20');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher_usages`
--

DROP TABLE IF EXISTS `voucher_usages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher_usages` (
  `usage_id` int NOT NULL AUTO_INCREMENT,
  `voucher_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int NOT NULL,
  `discount_amount` decimal(12,2) DEFAULT NULL,
  `used_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usage_id`),
  KEY `fk_usage_voucher` (`voucher_id`),
  KEY `fk_usage_user` (`user_id`),
  KEY `fk_usage_order` (`order_id`),
  CONSTRAINT `fk_usage_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_usage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_usage_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`voucher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher_usages`
--

LOCK TABLES `voucher_usages` WRITE;
/*!40000 ALTER TABLE `voucher_usages` DISABLE KEYS */;
INSERT INTO `voucher_usages` VALUES (1,4,2,1,30000.00,'2026-01-15 10:30:00'),(2,2,4,3,50000.00,'2026-02-05 09:15:00'),(3,3,6,5,100000.00,'2026-03-01 11:00:00'),(4,2,15,12,50000.00,'2026-05-22 15:31:43'),(5,3,15,14,100000.00,'2026-05-22 15:35:36');
/*!40000 ALTER TABLE `voucher_usages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `voucher_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_type` enum('PERCENTAGE','FIXED','FREESHIP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `max_discount_amount` decimal(12,2) DEFAULT NULL,
  `min_order_value` decimal(12,2) DEFAULT '0.00',
  `usage_limit` int NOT NULL,
  `used_count` int DEFAULT '0',
  `user_usage_limit` int DEFAULT '1',
  `start_date` datetime DEFAULT NULL,
  `expiry_date` datetime NOT NULL,
  `is_active` tinyint DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`voucher_id`),
  UNIQUE KEY `code` (`code`),
  KEY `code_2` (`code`),
  KEY `fk_voucher_creator` (`created_by`),
  CONSTRAINT `fk_voucher_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES (1,'WELCOME10','Giảm 10% cho đơn hàng đầu tiên','PERCENTAGE',10.00,50000.00,0.00,100,5,1,'2025-01-01 00:00:00','2026-12-31 23:59:59',1,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(2,'SUMMER50K','Giảm 50.000đ cho đơn từ 300.000đ','FIXED',50000.00,NULL,300000.00,50,11,1,'2025-06-01 00:00:00','2026-08-31 23:59:59',1,1,'2026-03-11 21:11:41','2026-05-22 15:31:43'),(3,'VIP20','Giảm 20% tối đa 100.000đ cho VIP','PERCENTAGE',20.00,100000.00,500000.00,30,4,1,'2025-01-01 00:00:00','2026-12-31 23:59:59',1,1,'2026-03-11 21:11:41','2026-05-22 15:35:36'),(4,'FREESHIP','Miễn phí vận chuyển cho mọi đơn hàng','FREESHIP',30000.00,30000.00,0.00,200,20,1,'2025-01-01 00:00:00','2026-12-31 23:59:59',1,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(5,'FLASH100K','Flash sale giảm 100.000đ đơn từ 700.000đ','FIXED',100000.00,NULL,700000.00,20,0,1,'2026-03-10 00:00:00','2026-03-10 23:59:59',1,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(6,'EXPIRED','Voucher đã hết hạn (test)','PERCENTAGE',15.00,NULL,0.00,50,0,1,'2024-01-01 00:00:00','2024-12-31 23:59:59',0,1,'2026-03-11 21:11:41','2026-03-11 21:11:41'),(7,'HIHI',NULL,'PERCENTAGE',5.00,NULL,0.00,500,0,1000,NULL,'2026-06-02 19:45:00',1,15,'2026-05-26 01:43:19','2026-05-26 17:55:02');
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-28  1:31:47
