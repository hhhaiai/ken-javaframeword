CREATE TABLE protocol_config (
  id int NOT NULL AUTO_INCREMENT,
  protocol_alias varchar(50) DEFAULT NULL,
  ip_port int DEFAULT NULL,
  protocol_id varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
);