package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.manage.DBManager;
import com.shine.DBUtil.model.DBModel;

public class PageSelectPage {

	/**
	 * 翻页查询
	 * 
	 * @param args
	 * @throws SQLException
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		DBModel dbModel = DBUtil.getInstance().executeQuery("jdbc/test",
				"select * from test1");

		while (dbModel.next() != 0) {
			System.out.println(dbModel.size());
			// System.out.println(dbModel.getDataXml());
		}

		// 重新读取一次
		dbModel.beforeFirst();
		while (dbModel.next() != 0) {
			System.out.println(dbModel.size());
			// System.out.println(dbModel.getDataXml());
		}
		dbModel.close();

	}

}
