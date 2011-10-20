CREATE TABLE session_config (id int NOT NULL AUTO_INCREMENT,
  session_id varchar(50) DEFAULT NULL,
  session_alias varchar(50) DEFAULT NULL,
  first_ip varchar(50) DEFAULT NULL,
  second_ip varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
);
