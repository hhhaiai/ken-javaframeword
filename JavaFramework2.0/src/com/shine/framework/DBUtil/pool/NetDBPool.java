package com.shine.framework.DBUtil.pool;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.SQLException;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class NetDBPool implements DBPool {
	private ComboPooledDataSource dataSource;

	private String dbUserName;
	private String dbPassWord;
	private String jdbcUrl;
	private String driverClass;
	// 设置初始连接池的大小
	private int initSize = 2;
	// 设置连接池的最小值
	private int minPoolSize = 1;
	// 设置连接池的最大值
	private int maxPoolSize = 10;
	// 设置连接池中的最大Statements数量
	private int maxStatements = 50;
	// 设置连接池的最大空闲时间
	private int maxIdleTime = 60;

	/**
	 * 初始化连接池
	 */
	private void init() {
		try {
			dataSource = new ComboPooledDataSource();
			dataSource.setUser(dbUserName);
			dataSource.setPassword(dbPassWord);
			dataSource.setJdbcUrl(jdbcUrl);
			dataSource.setDriverClass(driverClass);
			// 设置初始连接池的大小
			dataSource.setInitialPoolSize(initSize);
			// 设置连接池的最小值
			dataSource.setMinPoolSize(minPoolSize);
			// 设置连接池的最大值
			dataSource.setMaxPoolSize(maxPoolSize);
			// 设置连接池中的最大Statements数量
			dataSource.setMaxStatements(maxStatements);
			// 设置连接池的最大空闲时间
			dataSource.setMaxIdleTime(maxIdleTime);
			System.out.println("初始数据源" + jdbcUrl + "完成");
		} catch (PropertyVetoException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 初始化连接池
	 * 
	 * @param dbUserName
	 * @param dbPassWord
	 * @param jdbcUrl
	 * @param driverClass
	 */
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass) {
		this.dbUserName = dbUserName;
		this.dbPassWord = dbPassWord;
		this.jdbcUrl = jdbcUrl;
		this.driverClass = driverClass;
		init();
	}

	/**
	 * 初始化连接池
	 * 
	 * @param dbUserName
	 * @param dbPassWord
	 * @param jdbcUrl
	 * @param driverClass
	 * @param initSize
	 * @param minPoolSize
	 * @param maxPoolSize
	 * @param maxStatements
	 * @param maxIdleTime
	 */
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass, int initSize, int minPoolSize, int maxPoolSize,
			int maxStatements, int maxIdleTime) {
		this.dbUserName = dbUserName;
		this.dbPassWord = dbPassWord;
		this.jdbcUrl = jdbcUrl;
		this.driverClass = driverClass;
		this.initSize = initSize;
		this.minPoolSize = minPoolSize;
		this.maxPoolSize = maxPoolSize;
		this.maxStatements = maxStatements;
		this.maxIdleTime = maxIdleTime;
		init();
	}

	/**
	 * 获取数据库连接
	 * 
	 * @return
	 */
	@Override
	public final Connection getConnection() {
		try {
			return dataSource.getConnection();
		} catch (SQLException e) {
			throw new RuntimeException("无法从数据源获取连接 ", e);
		}
	}
}
