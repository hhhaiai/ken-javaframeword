CREATE TABLE app_config (
id int NOT NULL AUTO_INCREMENT,
  app_alias varchar(50) DEFAULT NULL,
  ip_port int DEFAULT NULL,
  ip_address varchar(50) DEFAULT NULL,
  app_id varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
);
