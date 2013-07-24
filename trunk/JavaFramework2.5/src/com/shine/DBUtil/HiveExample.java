package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.model.DBModel;

public class HiveExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"D:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		DBModel model = DBUtil.getInstance().executeQuery("jdbc/HBase",
				"SELECT a.* FROM test a");

		while (model.next() != 0) {
			System.out.println(model.getDataXml());
		}
		model.close();

	}

}
