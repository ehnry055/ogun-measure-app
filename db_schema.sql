-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: tyduzbv3ggpf15sx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com    Database: w35vs908petzdatd
-- ------------------------------------------------------
-- Server version	8.0.40

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `AggregatedData`
--

DROP TABLE IF EXISTS `AggregatedData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AggregatedData` (
  `STATE` varchar(255) DEFAULT NULL,
  `STATEICP` int DEFAULT NULL,
  `STATEFIPS` int DEFAULT NULL,
  `GISJOIN` varchar(255) NOT NULL,
  `COUNTYFIPS` int DEFAULT NULL,
  `ALLCOUNTIES` varchar(255) DEFAULT NULL,
  `RSG_SV1` int DEFAULT NULL,
  `RSG_LRA1` int DEFAULT NULL,
  `RSG_SV2` int DEFAULT NULL,
  `PO_LRA2` int DEFAULT NULL,
  `GR_SV1` int DEFAULT NULL,
  `GR_SV2` int DEFAULT NULL,
  `GR_LRA2` int DEFAULT NULL,
  `PI_SV1` int DEFAULT NULL,
  `PI_SV2` int DEFAULT NULL,
  `PI_LRA3` int DEFAULT NULL,
  `IP_SV3` int DEFAULT NULL,
  `OSU_SV1` int DEFAULT NULL,
  `OSU_LRA1` int DEFAULT NULL,
  `OSU_SV2` int DEFAULT NULL,
  `HCA_SV3` int DEFAULT NULL,
  `HFA_SV2` int DEFAULT NULL,
  `HFA_LRA2` int DEFAULT NULL,
  `HFA_SV3` int DEFAULT NULL,
  `HFA_LRA3` int DEFAULT NULL,
  `MM_LRA1` int DEFAULT NULL,
  PRIMARY KEY (`GISJOIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EP.SV3`
--

DROP TABLE IF EXISTS `EP.SV3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EP.SV3` (
  `FIPS` text,
  `NAME` text,
  `EP.SV3` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `OgunPage`
--

DROP TABLE IF EXISTS `OgunPage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OgunPage` (
  `pageId` varchar(255) NOT NULL,
  `content` json NOT NULL,
  `last_modified` datetime NOT NULL,
  PRIMARY KEY (`pageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ogun_pages`
--

DROP TABLE IF EXISTS `ogun_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ogun_pages` (
  `pageId` varchar(255) NOT NULL,
  `content` json NOT NULL,
  `last_modified` datetime NOT NULL,
  PRIMARY KEY (`pageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-17  9:14:47
