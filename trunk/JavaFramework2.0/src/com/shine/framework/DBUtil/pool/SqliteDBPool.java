package com.shine.framework.DBUtil.pool;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class SqliteDBPool implements DBPool {
	// private String dbUserName;
	// private String dbPassWord;
	private String jdbcUrl;
	private String driverClass;

	// // 设置初始连接池的大小
	// private int initSize = 2;
	// // 设置连接池的最小值
	// private int minPoolSize = 1;
	// // 设置连接池的最大值
	// private int maxPoolSize = 10;
	// // 设置连接池中的最大Statements数量
	// private int maxStatements = 50;
	// // 设置连接池的最大空闲时间
	// private int maxIdleTime = 60;

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
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass) {
		// this.dbUserName = dbUserName;
		// this.dbPassWord = dbPassWord;
		this.jdbcUrl = jdbcUrl;
		this.driverClass = driverClass;
		System.out.println("初始数据源" + jdbcUrl + "完成");
	}

	@Override
	public void init(String dbUserName, String dbPassWord, String jdbcUrl,
			String driverClass, int initSize, int minPoolSize, int maxPoolSize,
			int maxStatements, int maxIdleTime) {
		// this.dbUserName = dbUserName;
		// this.dbPassWord = dbPassWord;
		this.jdbcUrl = jdbcUrl;
		this.driverClass = driverClass;
		// this.initSize = initSize;
		// this.minPoolSize = minPoolSize;
		// this.maxPoolSize = maxPoolSize;
		// this.maxStatements = maxStatements;
		// this.maxIdleTime = maxIdleTime;
		System.out.println("初始数据源" + jdbcUrl + "完成");
	}

	public static void main(String[] args) {
		try {
			SqliteDBPool pool = new SqliteDBPool();
			pool.init("", "", "jdbc:sqlite:E://zieckey.db", "org.sqlite.JDBC");
			Connection conn = pool.getConnection();

			Statement stat = conn.createStatement();
//
//			stat
//					.executeUpdate("create table tbl1(name varchar(20), salary int);");// 创建一个表，两列
//
//			stat.executeUpdate("insert into tbl1 values('ZhangSan',8000);"); // 插入数据
//
//			stat.executeUpdate("insert into tbl1 values('LiSi',7800);");
//			stat.executeUpdate("insert into tbl1 values('WangWu',5800);");
//			stat.executeUpdate("insert into tbl1 values('ZhaoLiu',9100);");

			ResultSet rs = stat.executeQuery("select * from tbl1;"); // 查询数据

			while (rs.next()) { // 将查询到的数据打印出来

				System.out.print("name = " + rs.getString("name") + " "); // 列属性一

				System.out.println("salary = " + rs.getString("salary")); // 列属性二

			}
			rs.close();
			conn.close(); // 结束数据库的连接

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
