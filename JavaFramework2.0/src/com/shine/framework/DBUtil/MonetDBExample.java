package com.shine.framework.DBUtil;

import java.sql.Connection;
import java.sql.SQLException;

import com.shine.framework.DBUtil.model.DBModel;

public class MonetDBExample {

	/**
	 * MonetDB测试
	 * 
	 * @param args
	 * @throws SQLException
	 */
	public static void main(String[] args) throws SQLException {
		System.out.println("MonetDBExample...");
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\DBUtil\\config\\dbXml.xml");

		DBUtil.getInstance().executeUpdate("jdbc/MonetDB",
				"insert into test(test) values('123')");
		DBModel dbModel = DBUtil.getInstance().executeQuery("jdbc/MonetDB",
				"select * from test");
		while (dbModel.next() != 0) {
			System.out.println(dbModel.getDataXml());
		}

	}

}
