package com.shine.DBUtil;

import java.sql.Connection;
import java.sql.SQLException;

import com.shine.DBUtil.manage.DBManager;
import com.shine.DBUtil.model.DBModel;

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
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		DBUtil.getInstance().executeUpdate("jdbc/MonetDB",
				"insert into test(test) values('123')");
		DBModel dbModel = DBUtil.getInstance().executeQuery("jdbc/MonetDB",
				"select * from test");
		while (dbModel.next() != 0) {
			System.out.println(dbModel.getDataXml());
		}

	}

}
