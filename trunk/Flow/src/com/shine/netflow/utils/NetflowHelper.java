package com.shine.netflow.utils;

import java.text.DecimalFormat;

import com.shine.framework.core.util.DateUtil;

public class NetflowHelper {
	private static NetflowHelper helper;

	public static NetflowHelper getHelper() {
		if (helper == null) {
			helper = new NetflowHelper();
		}
		return helper;
	}

	/**
	 * 获取小时表名称
	 * 
	 * @return
	 */
	public String getHourTableName() {
		return "rawnetflow_hour_" + new DecimalFormat("00").
			format(DateUtil.getCurrentHour());
	}
	
	/**
	 * 获取日期表名称
	 * 
	 * @return
	 */
	public String getDateTableName() {
		return "rawnetflow_date_" + DateUtil.getCurrentDateAsId();
	}

	/**
	 * 定时生成建表sql语句(每小时)
	 * 
	 * @return
	 */
	public String createHourTableSql() {
		StringBuffer sql = new StringBuffer();
		sql.append("CREATE TABLE IF NOT EXISTS ");
		sql.append(this.getHourTableName());
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
		sql.append("PRIMARY KEY (`num`)");
		sql.append(") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;");
		return sql.toString();
	}

	/**
	 * 定时生成建表sql语句(每天)
	 * 
	 * @return
	 */
	public String createDateTableSql() {
		StringBuffer sql = new StringBuffer();
		sql.append("CREATE TABLE IF NOT EXISTS ");
		sql.append(this.getDateTableName());
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
		sql.append("PRIMARY KEY (`num`)");
		sql.append(") ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;");
		return sql.toString();
	}
}
