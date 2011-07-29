/*
MySQL Data Transfer
Source Host: localhost
Source Database: flow
Target Host: localhost
Target Database: flow
Date: 2011/7/27 11:14:59
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for rawnetflow
-- ----------------------------
DROP TABLE IF EXISTS `rawnetflow`;
CREATE TABLE `rawnetflow` (
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
) ENGINE=InnoDB AUTO_INCREMENT=10330 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
