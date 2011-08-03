package com.shine.framework.DBUtil;

import java.sql.SQLException;

import com.shine.framework.DBUtil.model.DBModel;

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
						"E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\DBUtil\\config\\dbXml.xml");

		DBModel dbModel = DBUtil.getInstance().executeQuery("jdbc/Sybase",
				"select * from table_201107");

		while (dbModel.next() != 0) {
			System.out.println(dbModel.size());
			System.out.println(dbModel.getDataXml());
		}
		dbModel.close();

	}

}
