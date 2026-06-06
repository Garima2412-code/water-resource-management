-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: hydrocivic
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `complaint_id` varchar(20) NOT NULL,
  `category` enum('Leakage','Contamination','No Water Supply','Low Pressure','Infrastructure Damage') DEFAULT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('Submitted','Assigned','In Progress','Resolved') DEFAULT NULL,
  `citizen_name` varchar(100) DEFAULT NULL,
  `assigned_officer` varchar(100) DEFAULT NULL,
  `date_submitted` date DEFAULT NULL,
  PRIMARY KEY (`complaint_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES ('cmp-01','No Water Supply','No Cauvery water supply since morning.','Marathahalli, Bengaluru','Assigned','Ramesh Kumar','Officer Sharma','2026-06-04'),('cmp-02','Leakage','Pipeline leakage near bus stand.','Jayanagar 4th Block, Bengaluru','In Progress','Anjali Rao','Officer Verma','2026-06-05'),('cmp-03','Contamination','Tap water has unusual odor and color.','Whitefield, Bengaluru','Submitted','Rahul Singh',NULL,'2026-06-05'),('cmp-04','Low Pressure','Water pressure too low during peak hours.','Electronic City, Bengaluru','Resolved','Priya Nair','Officer Sharma','2026-06-03');
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complainttimeline`
--

DROP TABLE IF EXISTS `complainttimeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complainttimeline` (
  `timeline_id` int NOT NULL AUTO_INCREMENT,
  `complaint_id` varchar(20) DEFAULT NULL,
  `status` enum('Submitted','Assigned','In Progress','Resolved') DEFAULT NULL,
  `note` text,
  `update_date` date DEFAULT NULL,
  PRIMARY KEY (`timeline_id`),
  KEY `complaint_id` (`complaint_id`),
  CONSTRAINT `complainttimeline_ibfk_1` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complainttimeline`
--

LOCK TABLES `complainttimeline` WRITE;
/*!40000 ALTER TABLE `complainttimeline` DISABLE KEYS */;
/*!40000 ALTER TABLE `complainttimeline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenancetasks`
--

DROP TABLE IF EXISTS `maintenancetasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenancetasks` (
  `task_id` varchar(20) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `source_id` varchar(20) DEFAULT NULL,
  `source_name` varchar(100) DEFAULT NULL,
  `type` enum('Request','Equipment Failure','Scheduled Inspection','Repair') DEFAULT NULL,
  `priority` enum('Low','Medium','High','Critical') DEFAULT NULL,
  `status` enum('Pending','Assigned','Ongoing','Completed') DEFAULT NULL,
  `date_created` date DEFAULT NULL,
  `date_completed` date DEFAULT NULL,
  `assigned_officer` varchar(100) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`task_id`),
  KEY `source_id` (`source_id`),
  CONSTRAINT `maintenancetasks_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `watersources` (`source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenancetasks`
--

LOCK TABLES `maintenancetasks` WRITE;
/*!40000 ALTER TABLE `maintenancetasks` DISABLE KEYS */;
INSERT INTO `maintenancetasks` VALUES ('maint-01','Cauvery Pipeline Inspection','src-04','Cauvery Water Treatment Plant','Scheduled Inspection','High','Ongoing','2026-06-04',NULL,'Officer Sharma','Inspection of distribution pipelines.'),('maint-02','Bellandur Water Quality Survey','src-03','Bellandur Lake','Repair','Critical','Assigned','2026-06-05',NULL,'Officer Verma','Water quality degradation investigation.'),('maint-03','Borewell Motor Replacement','src-05','Whitefield Borewell Cluster','Equipment Failure','High','Pending','2026-06-05',NULL,NULL,'Motor replacement required.');
/*!40000 ALTER TABLE `maintenancetasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` varchar(20) NOT NULL,
  `type` enum('low_water','quality_warning','complaint_update','maintenance_reminder') DEFAULT NULL,
  `title` varchar(150) DEFAULT NULL,
  `message` text,
  `notification_date` datetime DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `source_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `source_id` (`source_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `watersources` (`source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('notif-01','quality_warning','Bellandur Lake Alert','Water quality has crossed permissible limits.','2026-06-05 10:00:00',0,'src-03'),('notif-02','low_water','Whitefield Groundwater Alert','Groundwater level has dropped below 50%.','2026-06-05 08:00:00',0,'src-05'),('notif-03','maintenance_reminder','Cauvery Pipeline Inspection','Scheduled inspection due today.','2026-06-05 09:30:00',0,'src-04');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `unsafesources`
--

DROP TABLE IF EXISTS `unsafesources`;
/*!50001 DROP VIEW IF EXISTS `unsafesources`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `unsafesources` AS SELECT 
 1 AS `source_id`,
 1 AS `name`,
 1 AS `type`,
 1 AS `region`,
 1 AS `capacity`,
 1 AS `current_level`,
 1 AS `status`,
 1 AS `last_inspection`,
 1 AS `ph`,
 1 AS `tds`,
 1 AS `turbidity`,
 1 AS `dissolved_oxygen`,
 1 AS `latitude`,
 1 AS `longitude`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('citizen','officer','admin') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'garima rana','ranagarima2412@gmail.com','asdfghjkl','admin'),(7,'ram krishnan','ramk@tyd.in','qwert','officer');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waterlevelhistory`
--

DROP TABLE IF EXISTS `waterlevelhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waterlevelhistory` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `source_id` varchar(20) DEFAULT NULL,
  `water_level` decimal(10,2) DEFAULT NULL,
  `recorded_date` date DEFAULT NULL,
  PRIMARY KEY (`history_id`),
  KEY `source_id` (`source_id`),
  CONSTRAINT `waterlevelhistory_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `watersources` (`source_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waterlevelhistory`
--

LOCK TABLES `waterlevelhistory` WRITE;
/*!40000 ALTER TABLE `waterlevelhistory` DISABLE KEYS */;
INSERT INTO `waterlevelhistory` VALUES (13,'src-01',420.00,'2026-01-01'),(14,'src-01',390.00,'2026-02-01'),(15,'src-01',350.00,'2026-03-01'),(16,'src-01',310.00,'2026-04-01'),(17,'src-02',900.00,'2026-01-01'),(18,'src-02',800.00,'2026-02-01'),(19,'src-02',700.00,'2026-03-01'),(20,'src-02',620.00,'2026-04-01'),(21,'src-03',400.00,'2026-01-01'),(22,'src-03',350.00,'2026-02-01'),(23,'src-03',300.00,'2026-03-01'),(24,'src-03',250.00,'2026-04-01');
/*!40000 ALTER TABLE `waterlevelhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waterqualityhistory`
--

DROP TABLE IF EXISTS `waterqualityhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waterqualityhistory` (
  `quality_id` int NOT NULL AUTO_INCREMENT,
  `source_id` varchar(20) DEFAULT NULL,
  `ph` decimal(4,2) DEFAULT NULL,
  `tds` decimal(10,2) DEFAULT NULL,
  `turbidity` decimal(10,2) DEFAULT NULL,
  `dissolved_oxygen` decimal(10,2) DEFAULT NULL,
  `recorded_date` date DEFAULT NULL,
  PRIMARY KEY (`quality_id`),
  KEY `source_id` (`source_id`),
  CONSTRAINT `waterqualityhistory_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `watersources` (`source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waterqualityhistory`
--

LOCK TABLES `waterqualityhistory` WRITE;
/*!40000 ALTER TABLE `waterqualityhistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `waterqualityhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watersources`
--

DROP TABLE IF EXISTS `watersources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watersources` (
  `source_id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('Reservoir','Lake','Borewell','Dam','Treatment Plant') DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `capacity` decimal(10,2) DEFAULT NULL,
  `current_level` decimal(10,2) DEFAULT NULL,
  `status` enum('Safe','Moderate','Unsafe') DEFAULT NULL,
  `last_inspection` date DEFAULT NULL,
  `ph` decimal(4,2) DEFAULT NULL,
  `tds` decimal(10,2) DEFAULT NULL,
  `turbidity` decimal(10,2) DEFAULT NULL,
  `dissolved_oxygen` decimal(10,2) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  PRIMARY KEY (`source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watersources`
--

LOCK TABLES `watersources` WRITE;
/*!40000 ALTER TABLE `watersources` DISABLE KEYS */;
INSERT INTO `watersources` VALUES ('src-01','Hesaraghatta Reservoir','Reservoir','Bengaluru Rural',500.00,310.00,'Safe','2026-06-01',7.20,180.00,0.80,8.10,13.1390000,77.4870000),('src-02','Krishna Raja Sagar Dam','Dam','Mandya',1500.00,620.00,'Moderate','2026-06-03',7.40,220.00,1.50,7.60,12.4210000,76.5720000),('src-03','Bellandur Lake','Lake','Bengaluru Urban',800.00,250.00,'Unsafe','2026-06-05',5.60,850.00,18.50,2.90,12.9250000,77.6760000),('src-04','Cauvery Water Treatment Plant','Treatment Plant','Bengaluru',900.00,710.00,'Safe','2026-06-02',7.10,140.00,0.50,8.70,12.9716000,77.5946000),('src-05','Whitefield Borewell Cluster','Borewell','Whitefield',120.00,55.00,'Moderate','2026-06-04',7.90,510.00,5.20,6.00,12.9698000,77.7500000);
/*!40000 ALTER TABLE `watersources` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `water_quality_alert` AFTER UPDATE ON `watersources` FOR EACH ROW BEGIN

    IF NEW.status='Unsafe' THEN

        INSERT INTO Notifications
        (
            notification_id,
            type,
            title,
            message,
            notification_date,
            is_read,
            source_id
        )
        VALUES
        (
            CONCAT('notif-',UNIX_TIMESTAMP()),
            'quality_warning',
            'Unsafe Water Detected',
            CONCAT(NEW.name,' requires immediate attention'),
            NOW(),
            FALSE,
            NEW.source_id
        );

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `unsafesources`
--

/*!50001 DROP VIEW IF EXISTS `unsafesources`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `unsafesources` AS select `watersources`.`source_id` AS `source_id`,`watersources`.`name` AS `name`,`watersources`.`type` AS `type`,`watersources`.`region` AS `region`,`watersources`.`capacity` AS `capacity`,`watersources`.`current_level` AS `current_level`,`watersources`.`status` AS `status`,`watersources`.`last_inspection` AS `last_inspection`,`watersources`.`ph` AS `ph`,`watersources`.`tds` AS `tds`,`watersources`.`turbidity` AS `turbidity`,`watersources`.`dissolved_oxygen` AS `dissolved_oxygen`,`watersources`.`latitude` AS `latitude`,`watersources`.`longitude` AS `longitude` from `watersources` where (`watersources`.`status` = 'Unsafe') */;
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

-- Dump completed on 2026-06-06 13:49:20
