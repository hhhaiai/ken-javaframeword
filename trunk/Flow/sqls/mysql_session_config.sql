/*
MySQL Data Transfer
Source Host: localhost
Source Database: flow
Target Host: localhost
Target Database: flow
Date: 2011/9/29 14:51:37
*/

SET FOREIGN_KEY_CHECKS=0;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
