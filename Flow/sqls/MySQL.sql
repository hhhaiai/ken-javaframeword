/*
MySQL Data Transfer
Source Host: localhost
Source Database: flow
Target Host: localhost
Target Database: flow
Date: 2011/10/24 11:30:53
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for app_config
-- ----------------------------
DROP TABLE IF EXISTS `app_config`;
CREATE TABLE `app_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_alias` varchar(50) DEFAULT NULL,
  `ip_port` int(11) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `app_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ip_group_config
-- ----------------------------
DROP TABLE IF EXISTS `ip_group_config`;
CREATE TABLE `ip_group_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_alias` varchar(50) DEFAULT NULL COMMENT 'IP别名',
  `ip_start_address` varchar(50) DEFAULT NULL COMMENT 'IP开始地址',
  `ip_end_address` varchar(50) DEFAULT NULL COMMENT 'IP结束地址',
  `ip_address` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `sub_net_mask` varchar(50) DEFAULT NULL COMMENT '子网掩码',
  `flag` int(2) DEFAULT '1',
  `group_id` varchar(50) NOT NULL DEFAULT '' COMMENT 'IP组唯一ID',
  PRIMARY KEY (`id`,`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='IP分组配置';

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='协议流量配置';

-- ----------------------------
-- Table structure for session_config
-- ----------------------------
DROP TABLE IF EXISTS `session_config`;
CREATE TABLE `session_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(50) DEFAULT NULL,
  `session_alias` varchar(50) DEFAULT NULL,
  `first_ip` varchar(50) DEFAULT NULL,
  `second_ip` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;