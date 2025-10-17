-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2025 at 05:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minshopstore`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ward` varchar(255) NOT NULL,
  `district` varchar(100) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `user_id`, `ward`, `district`, `city`, `zip_code`, `is_default`) VALUES
(2, 1, 'Phường Hoàng Văn Thụ', 'Thành phố Lạng Sơn', 'Tỉnh Lạng Sơn', '', 0),
(3, 1, 'Phường Hùng Vương', 'Thành phố Phúc Yên', 'Tỉnh Vĩnh Phúc', '', 1),
(4, 1, 'Xã Quảng Nghĩa', 'Thành phố Móng Cái', 'Tỉnh Quảng Ninh', '', 0),
(5, 7, 'Phường Giảng Võ', 'Quận Ba Đình', 'Thành phố Hà Nội', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brand_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brand_id`, `name`, `description`, `logo_url`) VALUES
(1, 'Coolmate', 'Thương hiệu thời trang Việt Nam', 'https://www.coolmate.me/images/logo.png'),
(2, 'Torano', 'Thương hiệu tối giản cao cấp', 'https://theme.hstatic.net/200000690725/1001078549/14/logo.png?v=888');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cart_id`, `user_id`, `session_id`, `created_at`) VALUES
(1, 1, NULL, '2025-10-07 13:09:30'),
(4, 7, NULL, '2025-10-13 05:49:27');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` int(11) NOT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`cart_item_id`, `cart_id`, `variant_id`, `quantity`) VALUES
(22, 1, 6, 2),
(25, 4, 1, 1),
(29, 1, 19, 1),
(30, 4, 5, 3);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`, `slug`, `parent_id`, `image_url`, `alt_text`, `is_active`) VALUES
(1, 'Áo Thun Nam', 'Danh mục áo thun nam chất liệu thoáng mát', 'ao-thun-nam', NULL, 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_8_img.jpg?v=928', 'Ảnh danh mục Áo Thun Nam', 1),
(2, 'Quần Kaki', 'Danh mục quần kaki nam phong cách năng động', 'quan-kaki', NULL, '	https://theme.hstatic.net/200000690725/1001078549/14/home_category_3_img.jpg?v=928', 'Ảnh danh mục Quần Short Nam', 1),
(3, 'Áo Polo Nam', 'Danh mục áo polo nam lịch sự, thoải mái', 'ao-polo-nam', NULL, 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_1_img.jpg?v=888', 'Ảnh danh mục Áo Polo Nam', 1),
(4, 'Quần Jeans Nam', 'Danh mục quần jeans nam bền đẹp, dễ phối đồ', 'quan-jeans-nam', NULL, '	https://theme.hstatic.net/200000690725/1001078549/14/home_category_4_img.jpg?v=928', 'Ảnh danh mục Quần Jeans Nam', 1),
(5, 'Áo Khoác Nam', 'Danh mục áo khoác nam trẻ trung, thời trang', 'ao-khoac-nam', NULL, 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_1_img.jpg?v=928', 'Ảnh danh mục Áo Khoác Nam', 1);

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `session_type` enum('website','zalo','facebook') DEFAULT 'website',
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ended_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT NULL,
  `max_uses` int(11) DEFAULT NULL,
  `uses_count` int(11) DEFAULT 0,
  `expiry_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_logs`
--

CREATE TABLE `inventory_logs` (
  `log_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `change_amount` int(11) NOT NULL,
  `reason` enum('sale','restock','purchase','adjustment','order_cancelled') NOT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_logs`
--

INSERT INTO `inventory_logs` (`log_id`, `variant_id`, `change_amount`, `reason`, `changed_by`, `changed_at`) VALUES
(1, 4, -1, 'sale', NULL, '2025-10-14 05:59:56'),
(2, 3, -1, 'sale', NULL, '2025-10-14 05:59:56'),
(3, 6, -1, 'sale', NULL, '2025-10-14 05:59:56'),
(4, 3, -1, 'sale', NULL, '2025-10-14 05:59:56'),
(5, 2, -1, 'sale', NULL, '2025-10-14 05:59:56'),
(6, 4, -1, 'sale', NULL, '2025-10-14 06:13:29'),
(7, 6, -2, 'sale', NULL, '2025-10-14 06:13:29'),
(8, 3, -1, 'sale', NULL, '2025-10-14 06:13:29'),
(9, 21, -2, 'sale', NULL, '2025-10-15 16:58:30'),
(10, 19, -1, 'sale', NULL, '2025-10-15 18:08:24'),
(11, 6, -2, 'sale', NULL, '2025-10-15 18:08:24'),
(12, 1, -1, 'sale', NULL, '2025-10-16 01:38:25'),
(13, 1, 1, 'order_cancelled', NULL, '2025-10-16 01:56:15'),
(14, 5, -3, 'sale', NULL, '2025-10-16 03:58:38'),
(15, 1, -1, 'sale', NULL, '2025-10-16 03:58:38'),
(16, 1, 50, 'purchase', NULL, '2025-10-16 10:39:10'),
(17, 1, 50, 'restock', NULL, '2025-10-16 10:39:10');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `address_id`, `order_date`, `status`, `total_amount`, `shipping_fee`, `discount_amount`, `notes`) VALUES
(1, 1, 3, '2025-10-14 05:59:56', 'shipped', 1315000.00, 0.00, 0.00, ''),
(2, 1, 4, '2025-10-14 06:13:29', 'cancelled', 1006000.00, 0.00, 0.00, ''),
(3, 1, 3, '2025-10-15 16:58:30', 'shipped', 398000.00, 0.00, 0.00, ''),
(4, 1, 3, '2025-10-15 18:08:24', 'shipped', 398050.00, 0.00, 0.00, ''),
(5, 7, 5, '2025-10-16 01:38:25', 'cancelled', 199000.00, 0.00, 0.00, ''),
(6, 7, 5, '2025-10-16 03:58:38', 'shipped', 1396000.00, 0.00, 0.00, '');

--
-- Triggers `orders`
--
DELIMITER $$
CREATE TRIGGER `after_order_cancelled` AFTER UPDATE ON `orders` FOR EACH ROW BEGIN
    -- Chỉ chạy khi trạng thái thay đổi thành 'cancelled'
    IF OLD.status <> 'cancelled' AND NEW.status = 'cancelled' THEN
        -- Cộng lại số lượng hàng đã trừ trong kho
        UPDATE Product_Variants pv
        JOIN Order_Items oi ON pv.variant_id = oi.variant_id
        SET pv.stock_quantity = pv.stock_quantity + oi.quantity
        WHERE oi.order_id = NEW.order_id;

        -- Ghi log hoàn kho
        INSERT INTO Inventory_Logs (variant_id, change_amount, reason, changed_by)
        SELECT oi.variant_id, oi.quantity, 'order_cancelled', NULL
        FROM Order_Items oi
        WHERE oi.order_id = NEW.order_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `order_coupons`
--

CREATE TABLE `order_coupons` (
  `oc_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `variant_id`, `quantity`, `price`) VALUES
(1, 1, 4, 1, 309000.00),
(2, 1, 3, 1, 299000.00),
(3, 1, 6, 1, 199000.00),
(4, 1, 3, 1, 299000.00),
(5, 1, 2, 1, 209000.00),
(6, 2, 4, 1, 309000.00),
(7, 2, 6, 2, 199000.00),
(8, 2, 3, 1, 299000.00),
(9, 3, 21, 2, 199000.00),
(10, 4, 19, 1, 50.00),
(11, 4, 6, 2, 199000.00),
(12, 5, 1, 1, 199000.00),
(13, 6, 5, 3, 399000.00),
(14, 6, 1, 1, 199000.00);

--
-- Triggers `order_items`
--
DELIMITER $$
CREATE TRIGGER `after_order_insert` AFTER INSERT ON `order_items` FOR EACH ROW BEGIN
    UPDATE Product_Variants
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE variant_id = NEW.variant_id;
    
    INSERT INTO Inventory_Logs (variant_id, change_amount, reason, changed_by)
    VALUES (NEW.variant_id, -NEW.quantity, 'sale', NULL);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `reset_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `payment_method` enum('cod','vnpay','momo','credit_card') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','failed') DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `sku` varchar(50) NOT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `base_price`, `category_id`, `brand_id`, `sku`, `weight`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Áo thun nam Coolmate Basics', 'Chất liệu cotton thoáng mát, phù hợp mọi ngày', 199000.00, 1, 1, 'ATN001', 0.20, 1, '2025-09-25 04:36:00', '2025-10-14 02:27:05'),
(2, 'Quần short nam Coolmate Active', 'Chất liệu vải nhẹ, thoáng khí', 299000.00, 2, 1, 'QSN001', 0.30, 1, '2025-09-25 04:36:00', '2025-10-14 02:29:08'),
(3, 'Áo thun nam Minimalist Premium', 'Chất liệu cao cấp, tạm ngừng kinh doanh', 399000.00, 1, 2, 'ATN002', 0.20, 1, '2025-09-25 04:36:00', '2025-10-16 16:32:52'),
(8, 'Quần Jeans nam Coolmate', 'Quần Jeans nam Coolmate', 123000.00, 4, 1, 'QJN001', 123.00, 1, '2025-10-13 09:08:47', '2025-10-16 15:56:21'),
(9, 'Áo khoác nam Coolmate	1', 'Chất liệu đẹp thoáng mát, phù hợp mọi ngày', 300000.00, 5, 2, 'AKN001', 200.00, 1, '2025-10-16 15:02:19', '2025-10-16 15:28:21'),
(11, 'Áo thun nam Torano Basics 1', 'Chất liệu cotton thoáng mát, phù hợp mọi ngày', 200000.00, 3, 2, 'ATN003', 50.00, 1, '2025-10-16 15:08:47', '2025-10-16 15:53:19'),
(12, 'Quần Jeans nam Torano', 'Quần Jeans nam Torano', 200000.00, 4, 2, 'QJN002', 100.00, 1, '2025-10-16 16:11:49', '2025-10-16 16:11:49'),
(13, 'Áo khoác nam Torano', 'Áo khoác nam Torano', 225000.00, 5, 2, 'AKN002', 79.00, 1, '2025-10-16 16:16:08', '2025-10-16 16:16:08');

-- --------------------------------------------------------

--
-- Table structure for table `product_costs`
--

CREATE TABLE `product_costs` (
  `cost_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `cost_price` decimal(10,2) NOT NULL,
  `effective_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_costs`
--

INSERT INTO `product_costs` (`cost_id`, `variant_id`, `cost_price`, `effective_date`, `notes`, `created_at`) VALUES
(1, 1, 100000.00, '2025-10-16', 'Tự động thêm khi nhập hàng', '2025-10-16 10:39:10');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `alt_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`image_id`, `product_id`, `variant_id`, `image_url`, `is_primary`, `alt_text`) VALUES
(1, 1, 6, 'https://media.routine.vn/1200x1500/prod/variant/10s25tss026-white-1-jpg-egzc.webp', 1, 'Ảnh biến thể White'),
(2, 1, 1, 'https://media.routine.vn/1200x1500/prod/product/10s25tss023-dark-sapphire-2-jpg-91sh.webp', 0, 'Ảnh biến thể Blue'),
(3, 1, 2, 'https://media.routine.vn/1200x1500/prod/product/10f24tss017r1-black-3-jpg-lde5.webp', 0, 'Ảnh biến thể Black'),
(4, 2, 7, 'https://media.routine.vn/1200x1500/prod/product/10s25psh002-black-3-jpg-l2bj.webp', 1, 'Ảnh biến thể Black'),
(5, 2, 3, 'https://media.routine.vn/1200x1500/prod/product/10s25dps008-l-indigo-3-jpg-znyk.webp', 0, 'Ảnh biến thể Kaki'),
(6, 2, 4, 'https://media.routine.vn/1200x1500/prod/product/10s25psh014-beige-2-jpg-ll2k.webp', 0, 'Ảnh biến thể Navy'),
(7, 3, 8, 'https://n7media.coolmate.me/uploads/September2025/t-shirt-the-thao-nam-flexline-active-1-_1-den.jpg?aio=w-1100', 1, 'Ảnh biến thể Black'),
(8, 3, 5, 'https://media.routine.vn/1200x1500/prod/product/10s25tss014-tofu-2-jpg-kr6h.webp', 0, 'Ảnh biến thể White'),
(12, 8, 13, 'https://media.routine.vn/1200x1500/prod/product/10s25dpa012-m-blue-2-jpg-qftu.webp', 0, 'Ảnh biến thể Blue'),
(13, NULL, NULL, 'https://n7media.coolmate.me/uploads/June2025/ao-polo-premium-aircool-1214-be_23.jpg?aio=w-1100', 0, NULL),
(14, NULL, NULL, 'https://n7media.coolmate.me/uploads/June2025/ao-polo-premium-aircool-1214-be_23.jpg?aio=w-1100', 0, NULL),
(15, NULL, NULL, 'https://n7media.coolmate.me/uploads/June2025/ao-polo-premium-aircool-1214-be_23.jpg?aio=w-1100', 0, NULL),
(16, NULL, NULL, 'https://n7media.coolmate.me/uploads/June2025/ao-polo-premium-aircool-1214-be_23.jpg?aio=w-1100', 0, NULL),
(17, 8, 14, 'https://media.routine.vn/1200x1500/prod/product/10s25dpa012-m-blue-2-jpg-qftu.webp', 0, 'Ảnh biến thể Blue'),
(18, 8, 16, 'https://media.routine.vn/1200x1500/prod/variant/10f25pfo023-dark-grey-0-jpg-sklg.webp', 0, 'Ảnh biến thể Black'),
(19, NULL, NULL, 'https://n7media.coolmate.me/uploads/June2025/ao-polo-premium-aircool-1214-be_23.jpg?aio=w-1100', 0, NULL),
(20, NULL, NULL, 'https://n7media.coolmate.me/uploads/June2025/ao-polo-premium-aircool-1214-be_23.jpg?aio=w-1100', 0, NULL),
(21, 8, 18, 'https://media.routine.vn/1200x1500/prod/variant/10f25pfo023-dark-grey-0-jpg-sklg.webp', 0, 'Ảnh biến thể Black'),
(22, 8, 19, 'https://media.routine.vn/1200x1500/prod/variant/10s25pca012-white-sand-0-jpg-ksu3.webp', 0, 'Ảnh biến thể White'),
(23, 8, 20, 'https://media.routine.vn/1200x1500/prod/variant/10s25pca012-white-sand-0-jpg-ksu3.webp', 0, 'Ảnh biến thể White'),
(24, 1, 21, 'https://media.routine.vn/1200x1500/prod/product/10s25tss023-dark-sapphire-2-jpg-91sh.webp', 0, 'Ảnh biến thể Blue'),
(25, 1, 22, 'https://media.routine.vn/1200x1500/prod/product/10f24tss017r1-black-3-jpg-lde5.webp', 0, 'Ảnh biến thể Black'),
(26, 1, 23, 'https://media.routine.vn/1200x1500/prod/variant/10s25tss026-white-1-jpg-egzc.webp', 0, 'Ảnh biến thể White'),
(29, 9, 24, 'https://media.routine.vn/1200x1500/prod/variant/10f25jac005-navy-0-jpg-dqe7.webp', 0, 'Ảnh biến thể Blue'),
(30, 9, 25, 'https://media.routine.vn/1200x1500/prod/variant/10f25jac005-navy-0-jpg-dqe7.webp', 0, 'Ảnh biến thể Blue'),
(31, 9, 26, 'https://media.routine.vn/1200x1500/prod/variant/10f25jac005-white-sand-4-jpg-qzl2.webp', 0, 'Ảnh biến thể Navy'),
(32, 9, 27, 'https://media.routine.vn/1200x1500/prod/variant/10f25jac005-white-sand-4-jpg-qzl2.webp', 0, 'Ảnh biến thể Navy'),
(33, 11, 28, 'https://media.routine.vn/1200x1500/prod/media/10s24tss007-black-ao-thun-nam-1-jpg-hx7j.webp', 0, 'Ảnh biến thể Black'),
(34, 11, 29, 'https://media.routine.vn/1200x1500/prod/media/10s24tss007-black-ao-thun-nam-1-jpg-hx7j.webp', 0, 'Ảnh biến thể Black'),
(35, 2, 30, 'https://media.routine.vn/1200x1500/prod/product/10s25psh002-black-3-jpg-l2bj.webp', 0, 'Ảnh biến thể Black'),
(36, 2, 32, 'https://media.routine.vn/1200x1500/prod/product/10s25psh014-beige-2-jpg-ll2k.webp', 0, 'Ảnh biến thể Navy'),
(37, 2, 33, 'https://media.routine.vn/1200x1500/prod/product/10s25dps008-l-indigo-3-jpg-znyk.webp', 0, 'Ảnh biến thể Kaki'),
(38, 11, 34, 'https://media.routine.vn/1200x1500/prod/product/10s25tss008-cool-brew-3-jpg-yjda.webp', 0, 'Ảnh biến thể Brown'),
(39, 11, 35, 'https://media.routine.vn/1200x1500/prod/product/10s25tss008-cool-brew-3-jpg-yjda.webp', 0, 'Ảnh biến thể Brown'),
(40, 3, 36, 'https://media.routine.vn/1200x1500/prod/product/10s25tss014-tofu-2-jpg-kr6h.webp', 0, 'Ảnh biến thể White'),
(41, 3, 37, 'https://n7media.coolmate.me/uploads/September2025/t-shirt-the-thao-nam-flexline-active-1-_1-den.jpg?aio=w-1100', 0, 'Ảnh biến thể Black'),
(42, 12, 38, 'https://media.routine.vn/1200x1500/prod/variant/10s25dpa015-navy-3-jpg-ofc0.webp', 0, 'Ảnh biến thể Blue'),
(43, 12, 39, 'https://media.routine.vn/1200x1500/prod/variant/10s25dpa015-navy-3-jpg-ofc0.webp', 0, 'Ảnh biến thể Blue'),
(44, 12, 40, 'https://media.routine.vn/1200x1500/prod/variant/10s25dpa030-white-2-jpg-j6u5.webp', 0, 'Ảnh biến thể White'),
(45, 12, 41, 'https://media.routine.vn/1200x1500/prod/variant/10s25dpa030-white-2-jpg-j6u5.webp', 0, 'Ảnh biến thể White'),
(46, 13, 42, 'https://media.routine.vn/1200x1500/prod/variant/10f25wja003-red-3-jpg-kwr5.webp', 0, 'Ảnh biến thể Red'),
(47, 13, 43, 'https://media.routine.vn/1200x1500/prod/variant/10f25wja003-red-3-jpg-kwr5.webp', 0, 'Ảnh biến thể Red'),
(48, 13, 44, 'https://media.routine.vn/1200x1500/prod/variant/10f24jac004-silver-birch-2-jpg-47nd.webp', 0, 'Ảnh biến thể White'),
(49, 13, 45, 'https://media.routine.vn/1200x1500/prod/variant/10f24jac004-silver-birch-2-jpg-47nd.webp', 0, 'Ảnh biến thể White');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `variant_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `sku` varchar(50) NOT NULL,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`variant_id`, `product_id`, `price`, `stock_quantity`, `sku`, `attributes`) VALUES
(1, 1, 199000.00, 99, 'ATN001-BLUE-M', '{\"size\": \"M\", \"color\": \"Blue\"}'),
(2, 1, 209000.00, 50, 'ATN001-BLACK-M', '{\"size\": \"M\", \"color\": \"Black\"}'),
(3, 2, 299000.00, 50, 'QSN001-KAKI-M', '{\"size\": \"M\", \"color\": \"Kaki\"}'),
(4, 2, 309000.00, 50, 'QSN001-NAVY-M', '{\"size\": \"M\", \"color\": \"Navy\"}'),
(5, 3, 200000.00, 47, 'ATN002-WHITE-M', '{\"size\": \"M\", \"color\": \"White\"}'),
(6, 1, 199000.00, 48, 'ATN001-WHITE-M', '{\"size\": \"M\", \"color\": \"White\"}'),
(7, 2, 199000.00, 30, 'QSN001- BLACK-M', '{\"size\": \"M\", \"color\": \"Black\"}'),
(8, 3, 199000.00, 30, 'ATN002- BLACK-M', '{\"size\": \"M\", \"color\": \"Black\"}'),
(13, 8, 209000.00, 50, 'QJN001-BLU-L', '{\"size\": \"L\", \"color\": \"Blue\"}'),
(14, 8, 199000.00, 20, 'QJN001-BLU-M', '{\"size\": \"M\", \"color\": \"Blue\"}'),
(16, 8, 150000.00, 10, 'QJN001-BLA-L', '{\"size\": \"L\", \"color\": \"Black\"}'),
(18, 8, 123400.00, 20, 'QJN001-BLA-M', '{\"size\": \"M\", \"color\": \"Black\"}'),
(19, 8, 500000.00, 29, 'QJN001-WHI-L', '{\"size\": \"L\", \"color\": \"White\"}'),
(20, 8, 500000.00, 30, 'QJN001-WHI-M', '{\"size\": \"M\", \"color\": \"White\"}'),
(21, 1, 199000.00, 48, 'ATN001-BLUE-L', '{\"size\": \"L\", \"color\": \"Blue\"}'),
(22, 1, 209000.00, 50, 'ATN001-BLACK-L', '{\"size\": \"L\", \"color\": \"Black\"}'),
(23, 1, 199000.00, 50, 'ATN001-WHITE-L', '{\"size\": \"L\", \"color\": \"White\"}'),
(24, 9, 300000.00, 60, 'AKN001-BLUE-L', '{\"size\": \"L\", \"color\": \"Blue\"}'),
(25, 9, 300000.00, 70, 'AKN001-BLUE-M', '{\"size\": \"M\", \"color\": \"Blue\"}'),
(26, 9, 350000.00, 45, 'AKN001-NAVY-L', '{\"size\": \"L\", \"color\": \"Navy\"}'),
(27, 9, 350000.00, 45, 'AKN001-NAVY-M', '{\"size\": \"M\", \"color\": \"Navy\"}'),
(28, 11, 200000.00, 50, 'ATN003-BLACK-L', '{\"size\": \"L\", \"color\": \"Black\"}'),
(29, 11, 200000.00, 50, 'ATN003-BLACK-M', '{\"size\": \"M\", \"color\": \"Black\"}'),
(30, 2, 200000.00, 30, 'QSN001- BLACK-L', '{\"size\": \"L\", \"color\": \"Black\"}'),
(32, 2, 309.00, 50, 'QSN001-NAVY-L', '{\"size\": \"L\", \"color\": \"Navy\"}'),
(33, 2, 300000.00, 50, 'QSN001-KAKI-L', '{\"size\": \"L\", \"color\": \"Kaki\"}'),
(34, 11, 200000.00, 50, 'ATN003-BROWN-L', '{\"size\": \"L\", \"color\": \"Brown\"}'),
(35, 11, 200000.00, 50, 'ATN003-BROWN-M', '{\"size\": \"M\", \"color\": \"Brown\"}'),
(36, 3, 200000.00, 50, 'ATN002-WHITE-L', '{\"size\": \"L\", \"color\": \"White\"}'),
(37, 3, 199000.00, 50, 'ATN002- BLACK-L', '{\"size\": \"L\", \"color\": \"Black\"}'),
(38, 12, 200000.00, 50, 'QJN002-BLUE-L', '{\"size\": \"L\", \"color\": \"Blue\"}'),
(39, 12, 200000.00, 50, 'QJN002-BLUE-M', '{\"size\": \"M\", \"color\": \"Blue\"}'),
(40, 12, 200000.00, 50, 'QJN002-WHITE-L', '{\"size\": \"L\", \"color\": \"White\"}'),
(41, 12, 200000.00, 50, 'QJN002-WHITE-M', '{\"size\": \"M\", \"color\": \"White\"}'),
(42, 13, 225000.00, 50, 'AKN002-RED-L', '{\"size\": \"L\", \"color\": \"Red\"}'),
(43, 13, 225000.00, 50, 'AKN002-RED-M', '{\"size\": \"M\", \"color\": \"Red\"}'),
(44, 13, 225000.00, 50, 'AKN002-WHITE-L', '{\"size\": \"L\", \"color\": \"White\"}'),
(45, 13, 225000.00, 50, 'AKN002-WHITE-M', '{\"size\": \"M\", \"color\": \"White\"}');

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `purchase_id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','received','cancelled') DEFAULT 'pending',
  `total_cost` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`purchase_id`, `supplier_id`, `purchase_date`, `status`, `total_cost`, `notes`) VALUES
(1, 1, '2025-10-16 10:39:10', 'received', 100000.00, '');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_items`
--

CREATE TABLE `purchase_items` (
  `pi_id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_items`
--

INSERT INTO `purchase_items` (`pi_id`, `purchase_id`, `variant_id`, `quantity`, `unit_cost`) VALUES
(1, 1, 1, 50, 100000.00);

--
-- Triggers `purchase_items`
--
DELIMITER $$
CREATE TRIGGER `after_purchase_item_insert` AFTER INSERT ON `purchase_items` FOR EACH ROW BEGIN
    UPDATE Product_Variants
    SET stock_quantity = stock_quantity + NEW.quantity
    WHERE variant_id = NEW.variant_id;
    
    INSERT INTO Inventory_Logs (variant_id, change_amount, reason, changed_by)
    VALUES (NEW.variant_id, NEW.quantity, 'purchase', NULL);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipments`
--

CREATE TABLE `shipments` (
  `shipment_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `carrier` varchar(50) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `shipment_date` timestamp NULL DEFAULT NULL,
  `delivery_date` timestamp NULL DEFAULT NULL,
  `status` enum('preparing','in_transit','delivered') DEFAULT 'preparing'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_availability`
--

CREATE TABLE `staff_availability` (
  `staff_id` int(11) NOT NULL,
  `status` enum('online','offline','busy') DEFAULT 'offline',
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `supplier_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`supplier_id`, `name`, `contact_email`, `phone`, `created_at`) VALUES
(1, 'Địnhhuhu', 'abc@gmail.com', '0348853256', '2025-10-16 09:42:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `provider` enum('email','google') DEFAULT 'email',
  `provider_id` varchar(255) DEFAULT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `role` enum('customer','admin','staff') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `last_password_reset` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `provider`, `provider_id`, `display_name`, `role`, `created_at`, `is_active`, `email_verified`, `last_password_reset`) VALUES
(1, 'dinhhodan@gmail.com', NULL, 'google', '102415548161126756469', NULL, 'admin', '2025-10-03 12:38:36', 1, NULL, NULL),
(7, 'dinh12345huhu@gmail.com', NULL, 'google', '115373957455318925457', NULL, NULL, '2025-10-12 19:28:56', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `loyalty_points` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`profile_id`, `user_id`, `first_name`, `last_name`, `phone`, `date_of_birth`, `gender`, `avatar_url`, `loyalty_points`) VALUES
(1, 1, 'Phúc', 'Định Bùi', '0348853255', '2004-04-30', 'male', 'https://lh3.googleusercontent.com/a/ACg8ocIHzGM3J2fGshjWgAWPZScYq3G0URNArWbBNb-jDnEWyl4-Yw=s96-c', 0),
(3, 7, 'Định', 'Bùi', '0348853256', '2004-05-09', 'male', 'https://lh3.googleusercontent.com/a/ACg8ocL-8PMZGZAE5MOpQ-GrNl3mbRkPSuMm2dp57Ai9OXeT7tY6Jw=s96-c', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `idx_addresses_user` (`user_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `variant_id` (`variant_id`),
  ADD KEY `changed_by` (`changed_by`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `idx_orders_user` (`user_id`);

--
-- Indexes for table `order_coupons`
--
ALTER TABLE `order_coupons`
  ADD PRIMARY KEY (`oc_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `coupon_id` (`coupon_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`reset_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `idx_products_category` (`category_id`);

--
-- Indexes for table `product_costs`
--
ALTER TABLE `product_costs`
  ADD PRIMARY KEY (`cost_id`),
  ADD KEY `idx_product_costs_variant` (`variant_id`,`effective_date`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `idx_product_images_product` (`product_id`),
  ADD KEY `idx_product_images_variant` (`variant_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_variants_product` (`product_id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`purchase_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `idx_purchases_date` (`purchase_date`);

--
-- Indexes for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`pi_id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`shipment_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `staff_availability`
--
ALTER TABLE `staff_availability`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`profile_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_coupons`
--
ALTER TABLE `order_coupons`
  MODIFY `oc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `reset_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product_costs`
--
ALTER TABLE `product_costs`
  MODIFY `cost_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `purchase_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `pi_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipments`
--
ALTER TABLE `shipments`
  MODIFY `shipment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chat_sessions_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chat_sessions_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL;

--
-- Constraints for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_logs_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`session_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`) ON DELETE SET NULL;

--
-- Constraints for table `order_coupons`
--
ALTER TABLE `order_coupons`
  ADD CONSTRAINT `order_coupons_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_coupons_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`) ON DELETE SET NULL;

--
-- Constraints for table `product_costs`
--
ALTER TABLE `product_costs`
  ADD CONSTRAINT `product_costs_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_images_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`purchase_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `shipments`
--
ALTER TABLE `shipments`
  ADD CONSTRAINT `shipments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_availability`
--
ALTER TABLE `staff_availability`
  ADD CONSTRAINT `staff_availability_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
