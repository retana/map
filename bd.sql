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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

/*Data for the table `lugar` */

insert  into `lugar`(`idLugar`,`nombre`,`longitud`,`latitud`,`idTour`) values (1,'a','a','a',NULL),(2,'b',NULL,NULL,NULL),(3,'6A Avenida 19, Guatemala, Guatemala','-90.5353995','14.625485800000002',2),(4,'1 Av A, Guatemala, Guatemala','-90.58914184570312','14.531744589750675',2),(5,'7A Avenida, Guatemala, Guatemala','-90.53146362304688','14.595544539181391',2),(6,'6A Avenida 19, Guatemala, Guatemala','-90.5353995','14.625485800000002',2),(7,'1 Av A, Guatemala, Guatemala','-90.58914184570312','14.531744589750675',2),(8,'7A Avenida, Guatemala, Guatemala','-90.53146362304688','14.595544539181391',2),(9,'6A Avenida 19, Guatemala, Guatemala','-90.5353995','14.625485800000002',3),(10,'1 Av A, Guatemala, Guatemala','-90.58914184570312','14.531744589750675',3),(11,'7A Avenida, Guatemala, Guatemala','-90.53146362304688','14.595544539181391',3),(12,'6A Avenida 19, Guatemala, Guatemala','-90.5353995','14.625485800000002',3),(13,'1 Av A, Guatemala, Guatemala','-90.58914184570312','14.531744589750675',3),(14,'7A Avenida, Guatemala, Guatemala','-90.53146362304688','14.595544539181391',3),(15,'Unnamed Road, Guatemala','-90.615234375','14.462607193559837',4),(16,'2, Fraijanes, Guatemala','-90.45867919921875','14.477234210156505',4);

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

insert  into `tour`(`idTour`,`dia`,`hora_inicio`,`hora_fin`,`actividad`,`hotel`,`distancia`,`tipoCarretera`,`tipoDeTransporte`,`biomas`,`lugaresAVisitar`) values (1,'1','01:40','20:50','a','H1','','Terrazeria','Caminata','b1','b'),(2,'1','01:50','08:50','2','H2','','Asfaltada','Caminata','b1','1'),(3,'1','01:50','08:50','2','H3','','Asfaltada','Caminata','b1','1'),(4,'5','05:40','20:59','a1','H4','','Terrazeria','Lancha','d','l2');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
