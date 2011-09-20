/*
MySQL Data Transfer
Source Host: localhost
Source Database: flow
Target Host: localhost
Target Database: flow
Date: 2011/9/2 13:57:53
*/

SET FOREIGN_KEY_CHECKS=0;
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='IP分组配置';

-- ----------------------------
-- Records 
-- ----------------------------
INSERT INTO `ip_group_config` VALUES ('10', '河源公安', '129.8.1.1', '196.255.1.1', null, null, '1', '3927c634-d072-462d-8fdc-55348bd6d537');
INSERT INTO `ip_group_config` VALUES ('11', '汕头公安', '1.255.1.1', '255.0.0.1', null, null, '1', 'b5a8ac91-9265-40f9-8df9-c5d69bab9454');
INSERT INTO `ip_group_config` VALUES ('13', '全局IP', '1.0.0.0', '255.255.255.255', null, null, '1', '0ed2c5bf-2890-4700-867d-b6a05e745f10');
