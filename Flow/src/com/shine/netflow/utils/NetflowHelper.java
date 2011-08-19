package com.shine.netflow.utils;

import com.shine.framework.utils.TableUtil;

public class NetflowHelper {
	private static NetflowHelper helper;

	public static NetflowHelper getHelper() {
		if (helper == null) {
			helper = new NetflowHelper();
		}
		return helper;
	}
	
	/**
	 * 定时生成建表sql语句(每小时)
	 * 
	 * @return
	 */
	public String createHourTableSql() {
		StringBuffer sql = new StringBuffer();
		sql.append("create table if not exists ");
		sql.append(TableUtil.getCurrentHourTable());
		sql.append(this.fieldSql());
		return sql.toString();
	}

	/**
	 * 定时生成建表sql语句(每天)
	 * 
	 * @return
	 */
	public String createDateTableSql() {
		StringBuffer sql = new StringBuffer();
		sql.append("create table if not exists ");
		sql.append(TableUtil.getTodayTable());
		sql.append(this.fieldSql());
		return sql.toString();
	}

	/**
	 * 定时生成建表sql语句(每月)
	 * 
	 * @return
	 */
	public String createMonthTableSql() {
		StringBuffer sql = new StringBuffer();
		sql.append("create table if not exists ");
		sql.append(TableUtil.getCurrentMonthTable());
		sql.append(this.fieldSql());
		return sql.toString();
	}
	
	/**
	 * 生成建表sql语句
	 * 
	 * @param tableName
	 *            表名
	 * @return
	 */
	public String createTableSql(String tableName) {
		StringBuffer sql = new StringBuffer();
		sql.append("create table if not exists ");
		sql.append(tableName);
		sql.append(this.fieldSql());
		return sql.toString();
	}
	
	private String fieldSql() {
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
		sql.append("bytes varchar(100) DEFAULT NULL,");
		sql.append("log_time datetime DEFAULT NULL,");
		sql.append("PRIMARY KEY (num),");
		sql.append("key src_ip_index(src_ip),");
		sql.append("key des_ip_index(dst_ip),");
		sql.append("key log_time_index(log_time)");
		sql.append(") ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;");
		return sql.toString();
	}
}
