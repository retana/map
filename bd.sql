/*
SQLyog Ultimate v9.02 
MySQL - 5.6.21 : Database - db_tour
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_tour` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `db_tour`;

/*Table structure for table `lugar` */

DROP TABLE IF EXISTS `lugar`;

CREATE TABLE `lugar` (
  `idLugar` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(128) DEFAULT NULL,
  `longitud` varchar(128) DEFAULT NULL,
  `latitud` varchar(128) DEFAULT NULL,
  `idTour` int(10) DEFAULT NULL,
  PRIMARY KEY (`idLugar`),
  KEY `FK_lugar` (`idTour`),
  CONSTRAINT `FK_lugar` FOREIGN KEY (`idTour`) REFERENCES `tour` (`idTour`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `lugar` */

/*Table structure for table `tour` */

DROP TABLE IF EXISTS `tour`;

CREATE TABLE `tour` (
  `idTour` int(10) NOT NULL AUTO_INCREMENT,
  `dia` varchar(32) DEFAULT NULL,
  `hora_inicio` varchar(128) DEFAULT NULL,
  `hora_fin` varchar(128) DEFAULT NULL,
  `actividad` longtext,
  `hotel` longtext,
  `distancia` varchar(128) DEFAULT NULL,
  `tipoCarretera` varchar(128) DEFAULT NULL,
  `tipoDeTransporte` varchar(128) DEFAULT NULL,
  `biomas` longtext,
  `lugaresAVisitar` longtext,
  PRIMARY KEY (`idTour`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `tour` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
