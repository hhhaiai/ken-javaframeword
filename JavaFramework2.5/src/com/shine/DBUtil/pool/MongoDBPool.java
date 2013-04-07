package com.shine.DBUtil.pool;

import java.sql.Connection;
import java.sql.SQLException;

public class MongoDBPool implements DBPool {

	@Override
	public Connection getConnection() {
		// TODO Auto-generated method stub
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
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass) {
		// TODO Auto-generated method stub

	}

	@Override
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass, int initSize, int minPoolSize, int maxPoolSize,
			int maxStatements, int maxIdleTime) {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean testCheckoutConnection() throws SQLException {
		// TODO Auto-generated method stub
		return false;
	}

}
