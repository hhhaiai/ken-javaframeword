package com.shine.framework.Lealone;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class LealoneManager {
	public static LealoneManager manager = null;

	protected static Connection conn;
	protected static Statement stmt;
	protected ResultSet rs;
	protected String sql;
	protected String db = "hbasedb";
	protected static String url = "jdbc:lealone:tcp://localhost:9092/hbasedb";

	public static LealoneManager getManager() {
		if (manager == null)
			manager = new LealoneManager();
		return manager;
	}
	
	public void initConnection(){
		
	}

	public void createTable(String tableName, String... splitKeys)
			throws Exception {
		stmt.executeUpdate("DROP TABLE IF EXISTS " + tableName);

		StringBuilder builder = new StringBuilder();
		for (String s : splitKeys) {
			if (builder.length() > 0) {
				builder.append(", ");
			}
			builder.append("'").append(s).append("'");
		}

		String splitKeyStr = "";
		if (splitKeys.length > 0) {
			splitKeyStr = "SPLIT KEYS(" + builder + "), ";
		}

		// CREATE HBASE TABLE语句不用定义字段
		excuteSql("CREATE HBASE TABLE IF NOT EXISTS "
				+ tableName
				+ " (" //
				// 此OPTIONS对应org.apache.hadoop.hbase.HTableDescriptor的参数选项
				+ "OPTIONS(DEFERRED_LOG_FLUSH='false'), "

				// 预分region
				+ splitKeyStr

				// COLUMN
				// FAMILY中的OPTIONS对应org.apache.hadoop.hbase.HColumnDescriptor的参数选项
				+ "COLUMN FAMILY cf1 (OPTIONS(MIN_VERSIONS=2, KEEP_DELETED_CELLS=true)), " //

				+ "COLUMN FAMILY cf2 (OPTIONS(MIN_VERSIONS=2, KEEP_DELETED_CELLS=true))" //
				+ ")");

	}

	public void excuteSql(String sql) throws SQLException {
		 stmt.executeUpdate(sql);
	}

	public ResultSet selectSql() {
		return null;
	}
}
