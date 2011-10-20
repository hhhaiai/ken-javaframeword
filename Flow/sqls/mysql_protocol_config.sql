/*
MySQL Data Transfer
Source Host: localhost
Source Database: flow
Target Host: localhost
Target Database: flow
Date: 2011/9/28 16:11:01
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for protocol_config
-- ----------------------------
DROP TABLE IF EXISTS `protocol_config`;
CREATE TABLE `protocol_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `protocol_alias` varchar(50) DEFAULT NULL,
  `ip_port` int(11) DEFAULT NULL,
  `protocol_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='协议流量配置';

-- ----------------------------
-- Records 
-- ----------------------------
