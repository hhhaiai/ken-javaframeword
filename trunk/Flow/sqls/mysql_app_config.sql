/*
MySQL Data Transfer
Source Host: localhost
Source Database: flow
Target Host: localhost
Target Database: flow
Date: 2011/9/5 9:59:40
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
INSERT INTO `app_config` VALUES ('7', 'FTP', '21', '0', '87d47c40-0a0e-498d-afb7-9cb6c3457dca');
INSERT INTO `app_config` VALUES ('8', 'HTTP', '80', '0', '452193cb-52af-4269-9db5-a47463982ce3');
