package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.model.DBModel;

public class SqliteExample {

	/**
	 * Sqlite Example
	 * 
	 * @param args
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		DBUtil
				.getInstance()
				.executeUpdate(
						"jdbc/Default2",
						"create table cache(sql varchar(20000),jndi varchar(50), result varchar(60000),time varchar(20))");
		DBUtil.getInstance().executeUpdate("jdbc/Default2",
				"insert into cache values ('123','123','123','1986-06-16')");
		DBModel model = DBUtil.getInstance().executeQuery("jdbc/Default2",
				"select * from cache");

		while (model.next() != 0) {
			System.out.println(model.getDataXml());
		}
		model.close();

	}

}
