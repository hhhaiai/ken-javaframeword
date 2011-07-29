package com.shine.framework.DBUtil.pool;

import java.sql.Connection;
import java.sql.SQLException;

public interface DBPool {

	/**
	 * 初始化连接池
	 * 
	 * @param dbUserName
	 * @param dbPassWord
	 * @param jdbcUrl
	 * @param driverClass
	 */
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass);

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
			int maxStatements, int maxIdleTime);

	/**
	 * 获取数据库连接
	 * 
	 * @return
	 */
	public Connection getConnection();
}
