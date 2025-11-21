-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: emca_bdd
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id_order` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `id_user_account` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `delivery_address` text COLLATE utf8mb4_unicode_ci,
  `delivery_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_postal_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_order`),
  KEY `idx_user` (`id_user_account`),
  KEY `idx_status` (`status`),
  KEY `idx_created` (`created_at`),
  KEY `idx_order_user_status` (`id_user_account`,`status`),
  KEY `idx_order_created_status` (`created_at`,`status`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`id_user_account`) REFERENCES `user_account` (`id_user_account`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id_order_item` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `id_order` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_product` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_order_item`),
  KEY `idx_order` (`id_order`),
  KEY `idx_product` (`id_product`),
  CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`id_order`) REFERENCES `order` (`id_order`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_check_stock_before_insert` BEFORE INSERT ON `order_item` FOR EACH ROW BEGIN
   DECLARE v_stock INT;
   SELECT stock INTO v_stock FROM product WHERE id_product = NEW.id_product;
   
   IF v_stock < NEW.quantity THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Stock insuffisant pour ce produit';
   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_calculate_subtotal` BEFORE INSERT ON `order_item` FOR EACH ROW BEGIN
   SET NEW.subtotal = NEW.quantity * NEW.unit_price;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id_token` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `id_user_account` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_token`),
  KEY `idx_token` (`token`),
  KEY `idx_user` (`id_user_account`),
  KEY `idx_expires` (`expires_at`),
  CONSTRAINT `password_reset_token_ibfk_1` FOREIGN KEY (`id_user_account`) REFERENCES `user_account` (`id_user_account`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id_payment` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `id_order` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_payment`),
  KEY `idx_order` (`id_order`),
  KEY `idx_status` (`payment_status`),
  KEY `idx_transaction` (`transaction_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`id_order`) REFERENCES `order` (`id_order`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id_product` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `intensity` tinyint DEFAULT NULL COMMENT 'Niveau d''intensité du café (1-10)',
  `format` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Format (ex: 250g, 500g, 1kg, 10 capsules)',
  `coffee_type` enum('ARABICA','ROBUSTA','BLEND','DECAFFEINATED','ORGANIC') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Type de café',
  `origin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Origine du café (ex: Colombie, Brésil, Éthiopie)',
  `roast_level` enum('LIGHT','MEDIUM','DARK','EXTRA_DARK') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Niveau de torréfaction',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Coffee',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `size` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preparation` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ingredient` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_product`),
  KEY `idx_name` (`name`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`is_active`),
  KEY `idx_price` (`price`),
  KEY `idx_coffee_type` (`coffee_type`),
  KEY `idx_intensity` (`intensity`),
  FULLTEXT KEY `idx_fulltext_product` (`name`,`description`,`origin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('87e55931-c5e5-11f0-9c5e-04421aa0a376','Grains Crus de Café Vert 100% Bio ',NULL,34.99,100,7,'1000g',NULL,'Perou',NULL,'/img/products/200-bio-1.png','Coffee',1,'2025-11-20 07:50:06','2025-11-20 07:58:32','20x15x10','',NULL),('fd6d3621-c5e4-11f0-9c5e-04421aa0a376','Grains Crus de Café Vert 100% Bio ',NULL,16.99,100,7,'500g',NULL,'Perou',NULL,'/img/products/200-bio-1.png','Coffee',1,'2025-11-20 07:46:14','2025-11-20 07:56:07','20x15x10',NULL,NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_account`
--

DROP TABLE IF EXISTS `user_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_account` (
  `id_user_account` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('M','F','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'France',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'CLIENT',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user_account`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_account`
--

LOCK TABLES `user_account` WRITE;
/*!40000 ALTER TABLE `user_account` DISABLE KEYS */;
INSERT INTO `user_account` VALUES ('0008721d-fc32-4498-a6f2-6a145a455f90','Dugain','Clarence','M','dugain.c@outlook.com','0612345678','123 Rue de la Paix','Appartement 4B','Paris','75001','France','$2b$10$L6qcQZz/WcRAwF0YSMFDZe7ly9F0ke.zUROrU1kxAQkV9PLyOs.Uy','CLIENT','2025-11-18 09:49:15','2025-11-18 09:49:15'),('31705dae-4dce-435a-8ce1-e5c817bcfe8c','jean','Bonot','M','Jean@example.com',NULL,NULL,NULL,NULL,NULL,'France','$2b$10$NgU413FTtFQ8n6h5hUHQqOJBZrCqOGNVbmQDsTWO0gfBKuDz65APq','CLIENT','2025-11-19 10:25:59','2025-11-19 10:25:59'),('4848e16d-0ec1-4ab2-a461-e1d31c597c45','Marie','Dupont','F','marie.dupont@example.com','0612345678','123 Rue de la Paix','Appartement 4B','Paris','75001','France','$2b$10$kKsZgW.ze4xPMiRx7ae5vemiXdfaz7Ucm1tHi7DbLw.QvWQZibYpC','CLIENT','2025-11-13 13:46:13','2025-11-13 13:46:13'),('67f53fb9-c07a-11f0-baf9-90e86841aae8','Admin','System',NULL,'admin@example.com',NULL,NULL,NULL,NULL,NULL,'France','$2b$10$YourHashedPasswordHere','ADMIN','2025-11-13 10:20:41','2025-11-13 10:20:41'),('67f5ad58-c07a-11f0-baf9-90e86841aae8','John','Doe',NULL,'john@example.com',NULL,NULL,NULL,NULL,NULL,'France','$2b$10$YourHashedPasswordHere','CLIENT','2025-11-13 10:20:41','2025-11-13 10:20:41'),('c50ee9ff-03a5-4c40-9193-a337d1b12bed','Jean','Bonot','M','Jean.Bonot@example.com','0612345678','123 Rue de la Paix','Appartement 4B','Paris','75001','France','$2b$10$HlBbtZWved5K4hESA7vDwOHQcwtnFlhfyc/NUumEvsPufNO1WWyIi','ADMIN','2025-11-17 14:25:42','2025-11-17 14:25:54'),('cdac2fb6-c81d-45ac-81a7-e70ff1481afe','test','test','M','test@test.com',NULL,NULL,NULL,NULL,NULL,'France','$2b$10$nlbUb.Jt1q5lZHNDZDVbNOQJosmETljIBumSexDfwUoHUOFRml01m','CLIENT','2025-11-19 10:24:30','2025-11-19 10:24:30');
/*!40000 ALTER TABLE `user_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_order_details`
--

DROP TABLE IF EXISTS `v_order_details`;
/*!50001 DROP VIEW IF EXISTS `v_order_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_order_details` AS SELECT 
 1 AS `id_order`,
 1 AS `status`,
 1 AS `total`,
 1 AS `created_at`,
 1 AS `id_order_item`,
 1 AS `product_name`,
 1 AS `quantity`,
 1 AS `unit_price`,
 1 AS `subtotal`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `email`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_orders_with_user`
--

DROP TABLE IF EXISTS `v_orders_with_user`;
/*!50001 DROP VIEW IF EXISTS `v_orders_with_user`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_orders_with_user` AS SELECT 
 1 AS `id_order`,
 1 AS `status`,
 1 AS `total`,
 1 AS `created_at`,
 1 AS `id_user_account`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `email`,
 1 AS `total_items`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_product_stats`
--

DROP TABLE IF EXISTS `v_product_stats`;
/*!50001 DROP VIEW IF EXISTS `v_product_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_product_stats` AS SELECT 
 1 AS `id_product`,
 1 AS `name`,
 1 AS `price`,
 1 AS `stock`,
 1 AS `category`,
 1 AS `times_ordered`,
 1 AS `total_quantity_sold`,
 1 AS `total_revenue`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'emca_bdd'
--
/*!50003 DROP FUNCTION IF EXISTS `fn_calculate_order_total` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_calculate_order_total`(p_order_id CHAR(36)) RETURNS decimal(10,2)
    DETERMINISTIC
BEGIN
   DECLARE v_total DECIMAL(10,2);
   SELECT COALESCE(SUM(subtotal), 0) INTO v_total
   FROM order_item
   WHERE id_order = p_order_id;
   RETURN v_total;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_order` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_order`(
   IN p_user_id CHAR(36),
   IN p_items JSON
)
BEGIN
   DECLARE v_order_id CHAR(36);
   DECLARE v_total DECIMAL(10,2) DEFAULT 0;
   DECLARE v_idx INT DEFAULT 0;
   DECLARE v_items_count INT;
   
   -- Démarrer la transaction
   START TRANSACTION;
   
   -- Créer la commande
   SET v_order_id = UUID();
   INSERT INTO `order` (id_order, id_user_account, status, total)
   VALUES (v_order_id, p_user_id, 'PENDING', 0);
   
   -- Traiter chaque item
   SET v_items_count = JSON_LENGTH(p_items);
   
   WHILE v_idx < v_items_count DO
      SET @product_id = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', v_idx, '].id_product')));
      SET @quantity = JSON_EXTRACT(p_items, CONCAT('$[', v_idx, '].quantity'));
      
      -- Récupérer le prix du produit
      SELECT price INTO @unit_price FROM product WHERE id_product = @product_id;
      SET @subtotal = @unit_price * @quantity;
      
      -- Créer l'item
      INSERT INTO order_item (id_order_item, id_order, id_product, quantity, unit_price, subtotal)
      VALUES (UUID(), v_order_id, @product_id, @quantity, @unit_price, @subtotal);
      
      -- Mettre à jour le stock
      UPDATE product SET stock = stock - @quantity WHERE id_product = @product_id;
      
      -- Ajouter au total
      SET v_total = v_total + @subtotal;
      SET v_idx = v_idx + 1;
   END WHILE;
   
   -- Mettre à jour le total de la commande
   UPDATE `order` SET total = v_total WHERE id_order = v_order_id;
   
   -- Valider la transaction
   COMMIT;
   
   -- Retourner l'ID de la commande
   SELECT v_order_id as order_id, v_total as total;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `v_order_details`
--

/*!50001 DROP VIEW IF EXISTS `v_order_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_order_details` AS select `o`.`id_order` AS `id_order`,`o`.`status` AS `status`,`o`.`total` AS `total`,`o`.`created_at` AS `created_at`,`oi`.`id_order_item` AS `id_order_item`,`p`.`name` AS `product_name`,`oi`.`quantity` AS `quantity`,`oi`.`unit_price` AS `unit_price`,`oi`.`subtotal` AS `subtotal`,`u`.`first_name` AS `first_name`,`u`.`last_name` AS `last_name`,`u`.`email` AS `email` from (((`order` `o` join `order_item` `oi` on((`o`.`id_order` = `oi`.`id_order`))) join `product` `p` on((`oi`.`id_product` = `p`.`id_product`))) join `user_account` `u` on((`o`.`id_user_account` = `u`.`id_user_account`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_orders_with_user`
--

/*!50001 DROP VIEW IF EXISTS `v_orders_with_user`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_orders_with_user` AS select `o`.`id_order` AS `id_order`,`o`.`status` AS `status`,`o`.`total` AS `total`,`o`.`created_at` AS `created_at`,`u`.`id_user_account` AS `id_user_account`,`u`.`first_name` AS `first_name`,`u`.`last_name` AS `last_name`,`u`.`email` AS `email`,count(`oi`.`id_order_item`) AS `total_items` from ((`order` `o` join `user_account` `u` on((`o`.`id_user_account` = `u`.`id_user_account`))) left join `order_item` `oi` on((`o`.`id_order` = `oi`.`id_order`))) group by `o`.`id_order`,`o`.`status`,`o`.`total`,`o`.`created_at`,`u`.`id_user_account`,`u`.`first_name`,`u`.`last_name`,`u`.`email` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_product_stats`
--

/*!50001 DROP VIEW IF EXISTS `v_product_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_product_stats` AS select `p`.`id_product` AS `id_product`,`p`.`name` AS `name`,`p`.`price` AS `price`,`p`.`stock` AS `stock`,`p`.`category` AS `category`,count(`oi`.`id_order_item`) AS `times_ordered`,coalesce(sum(`oi`.`quantity`),0) AS `total_quantity_sold`,coalesce(sum(`oi`.`subtotal`),0) AS `total_revenue` from (`product` `p` left join `order_item` `oi` on((`p`.`id_product` = `oi`.`id_product`))) group by `p`.`id_product`,`p`.`name`,`p`.`price`,`p`.`stock`,`p`.`category` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-20  9:16:47
