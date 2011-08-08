/*
MySQL Data Transfer
Source Host: localhost
Source Database: flow
Target Host: localhost
Target Database: flow
Date: 2011/8/4 12:19:45
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for rawnetflow_hour_01
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_01`;
CREATE TABLE `rawnetflow_hour_01` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_02
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_02`;
CREATE TABLE `rawnetflow_hour_02` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_03
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_03`;
CREATE TABLE `rawnetflow_hour_03` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_04
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_04`;
CREATE TABLE `rawnetflow_hour_04` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_05
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_05`;
CREATE TABLE `rawnetflow_hour_05` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_06
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_06`;
CREATE TABLE `rawnetflow_hour_06` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_07
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_07`;
CREATE TABLE `rawnetflow_hour_07` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_08
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_08`;
CREATE TABLE `rawnetflow_hour_08` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_09
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_09`;
CREATE TABLE `rawnetflow_hour_09` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_10
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_10`;
CREATE TABLE `rawnetflow_hour_10` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_11
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_11`;
CREATE TABLE `rawnetflow_hour_11` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_12
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_12`;
CREATE TABLE `rawnetflow_hour_12` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_13
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_13`;
CREATE TABLE `rawnetflow_hour_13` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_14
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_14`;
CREATE TABLE `rawnetflow_hour_14` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_15
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_15`;
CREATE TABLE `rawnetflow_hour_15` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_16
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_16`;
CREATE TABLE `rawnetflow_hour_16` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_17
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_17`;
CREATE TABLE `rawnetflow_hour_17` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_18
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_18`;
CREATE TABLE `rawnetflow_hour_18` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_19
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_19`;
CREATE TABLE `rawnetflow_hour_19` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_20
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_20`;
CREATE TABLE `rawnetflow_hour_20` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_21
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_21`;
CREATE TABLE `rawnetflow_hour_21` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_22
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_22`;
CREATE TABLE `rawnetflow_hour_22` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_23
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_23`;
CREATE TABLE `rawnetflow_hour_23` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rawnetflow_hour_24
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow_hour_24`;
CREATE TABLE `rawnetflow_hour_24` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `router_id` int(11) DEFAULT NULL,
  `src_ip` varchar(50) DEFAULT NULL,
  `src_port` int(11) DEFAULT NULL,
  `dst_ip` varchar(50) DEFAULT NULL,
  `dst_port` int(11) DEFAULT NULL,
  `in_if` varchar(100) DEFAULT NULL,
  `out_if` varchar(100) DEFAULT NULL,
  `protocol` varchar(50) DEFAULT NULL,
  `bytes` varchar(100) DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
