package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.model.DBModel;

public class SybaseIqExample {

	/**
	 * sybase iq翻页 查询
	 * 
	 * @param args
	 * @throws SQLException 
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		DBModel dbModel = DBUtil.getInstance().executeQuery("jdbc/Sybase",
				"select * from table_201107");

		while (dbModel.next() != 0) {
			System.out.println(dbModel.size());
			System.out.println(dbModel.getDataXml());
		}
		dbModel.close();

	}

}
