package com.shine.DBUtil.pool;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * cvs数据库
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class CsvDBPool implements DBPool {
	private String jdbcUrl;
	private String driverClass;

	@Override
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass) {
		this.jdbcUrl = jdbcUrl;
		this.driverClass = driverClass;
		System.out.println("初始数据源" + jdbcUrl + "完成");
	}

	@Override
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass, int initSize, int minPoolSize, int maxPoolSize,
			int maxStatements, int maxIdleTime) {
		this.jdbcUrl = jdbcUrl;
		this.driverClass = driverClass;
		System.out.println("初始数据源" + jdbcUrl + "完成");

	}

	@Override
	public Connection getConnection() {
		try {
			Class.forName(driverClass);
			Connection conn = DriverManager.getConnection(jdbcUrl);
			return conn;
		} catch (Exception e) {
			System.err.println(jdbcUrl + ":连接失败!");
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public int getNumBusyConnection() throws SQLException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getNumConnection() throws SQLException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getNumIdleConection() throws SQLException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public boolean testCheckoutConnection() throws SQLException {
		// TODO Auto-generated method stub
		return false;
	}

}
