package com.shine.netflow.utils;

public class NetflowHelper {
	private static NetflowHelper helper;

	public static NetflowHelper getHelper() {
		if (helper == null) {
			helper = new NetflowHelper();
		}
		return helper;
	}

	/**
	 * 生成MySql建表sql语句
	 * 
	 * @param tableName 表名
	 * @return
	 */
	public String createMysqlTableSql(String tableName) {
		StringBuffer sql = new StringBuffer();
		sql.append("create table if not exists ");
		sql.append(tableName);
		sql.append(this.mysqlFieldSql());
		return sql.toString();
	}
	
	private String mysqlFieldSql() {
		StringBuffer sql = new StringBuffer();
		sql.append(" (num int(11) NOT NULL AUTO_INCREMENT,");
		sql.append("router_id int(11) DEFAULT NULL,");
		sql.append("src_ip varchar(50) DEFAULT NULL,");
		sql.append("src_port int(11) DEFAULT NULL,");
		sql.append("dst_ip varchar(50) DEFAULT NULL,");
		sql.append("dst_port int(11) DEFAULT NULL,");
		sql.append("in_if varchar(100) DEFAULT NULL,");
		sql.append("out_if varchar(100) DEFAULT NULL,");
		sql.append("protocol varchar(50) DEFAULT NULL,");
		sql.append("bytes bigint DEFAULT NULL,");
		sql.append("log_time datetime DEFAULT NULL,");
		sql.append("PRIMARY KEY (num),");
		sql.append("key src_ip_index(src_ip),");
		sql.append("key des_ip_index(dst_ip),");
		sql.append("key log_time_index(log_time)");
		sql.append(") ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;");
		return sql.toString();
	}
	
	/**
	 * 生成MonetDB建表sql语句
	 * 
	 * @param tableName 表名
	 * @return
	 */
	public String createMonetDBTableSql(String tableName) {
		StringBuffer sql = new StringBuffer();
		sql.append("create table ");
		sql.append(tableName);
		sql.append(this.monetDBFieldSql());
		return sql.toString();
	}
	
	private String monetDBFieldSql() {
		StringBuffer sql = new StringBuffer();
		sql.append(" (num int generated always as identity (start with 1 increment by 1),");
		sql.append("router_id int DEFAULT NULL,");
		sql.append("src_ip varchar(50) DEFAULT NULL,");
		sql.append("src_port int DEFAULT NULL,");
		sql.append("dst_ip varchar(50) DEFAULT NULL,");
		sql.append("dst_port int DEFAULT NULL,");
		sql.append("in_if varchar(100) DEFAULT NULL,");
		sql.append("out_if varchar(100) DEFAULT NULL,");
		sql.append("protocol varchar(50) DEFAULT NULL,");
		sql.append("bytes bigint DEFAULT NULL,");
		sql.append("log_time timestamp DEFAULT NULL,");
		sql.append("PRIMARY KEY (num)");
		sql.append(")");
		return sql.toString();
	}
}