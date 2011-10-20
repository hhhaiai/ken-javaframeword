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

CREATE TABLE app_config (
  id int NOT NULL AUTO_INCREMENT,
  app_alias varchar(50) DEFAULT NULL,
  ip_port int DEFAULT NULL,
  ip_address varchar(50) DEFAULT NULL,
  app_id varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE session_config (id int NOT NULL AUTO_INCREMENT,
  session_id varchar(50) DEFAULT NULL,
  session_alias varchar(50) DEFAULT NULL,
  first_ip varchar(50) DEFAULT NULL,
  second_ip varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE protocol_config (
  id int NOT NULL AUTO_INCREMENT,
  protocol_alias varchar(50) DEFAULT NULL,
  ip_port int DEFAULT NULL,
  protocol_id varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
);