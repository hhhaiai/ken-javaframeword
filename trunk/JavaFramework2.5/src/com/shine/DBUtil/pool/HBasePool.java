package com.shine.DBUtil.pool;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class HBasePool implements DBPool {

	private String dbUserName;
	private String dbPassWord;
	private String jdbcUrl;
	private String driverClass;

	@Override
	public Connection getConnection() {
		try {
			Class.forName(driverClass);
			Connection conn = DriverManager.getConnection(jdbcUrl, dbUserName,
					dbPassWord);
			return conn;
		} catch (Exception e) {
			System.err.println(jdbcUrl + ":连接失败!");
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass) {
		this.dbUserName = dbUserName;
		this.dbPassWord = dbPassWord;
		this.jdbcUrl = jdbcUrl;
		this.driverClass = driverClass;
		System.out.println("初始数据源" + jdbcUrl + "完成");
	}

	@Override
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass, int initSize, int minPoolSize, int maxPoolSize,
			int maxStatements, int maxIdleTime) {
		this.dbUserName = dbUserName;
		this.dbPassWord = dbPassWord;
		this.jdbcUrl = jdbcUrl;
		this.driverClass = driverClass;
		// this.initSize = initSize;
		// this.minPoolSize = minPoolSize;
		// this.maxPoolSize = maxPoolSize;
		// this.maxStatements = maxStatements;
		// this.maxIdleTime = maxIdleTime;
		System.out.println("初始数据源" + jdbcUrl + "完成");
	}

	@Override
	public int getNumConnection() throws SQLException {
		return 0;
	}

	@Override
	public int getNumIdleConection() throws SQLException {
		return 0;
	}

	@Override
	public int getNumBusyConnection() throws SQLException {
		return 0;
	}

	@Override
	public boolean testCheckoutConnection() throws SQLException {
		return true;
	}

}
