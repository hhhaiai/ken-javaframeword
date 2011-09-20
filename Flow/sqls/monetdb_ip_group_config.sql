CREATE TABLE ip_group_config (
  id int NOT NULL AUTO_INCREMENT,
  ip_alias varchar(50) DEFAULT NULL,
  ip_start_address varchar(50) DEFAULT NULL,
  ip_end_address varchar(50) DEFAULT NULL,
  ip_address varchar(50) DEFAULT NULL,
  sub_net_mask varchar(50) DEFAULT NULL,
  flag int DEFAULT '1',
  group_id varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (id,group_id)
);
