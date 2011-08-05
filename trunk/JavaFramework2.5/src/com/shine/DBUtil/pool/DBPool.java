package com.shine.DBUtil.pool;

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

	/**
	 * 获取连接总数
	 * 
	 * @return
	 * @throws SQLException
	 */
	public int getNumConnection() throws SQLException;

	/**
	 * 获取空闲连接总数
	 * 
	 * @return
	 * @throws SQLException
	 */
	public int getNumIdleConection() throws SQLException;

	/**
	 * 获取繁忙连接总数
	 * 
	 * @return
	 * @throws SQLException
	 */
	public int getNumBusyConnection() throws SQLException;
}
