package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.model.DBModel;

public class SelectAllTablesExample {

	/**
	 * 搜索all table
	 * 
	 * @param args
	 * @throws SQLException 
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		DBModel dbmodel = DBUtil.getInstance().getAllTables("jdbc/MonetDB",
				null);
		while (dbmodel.next() != 0) {
			System.out.println(dbmodel.getDataXml());
		}
		dbmodel.close();

	}

}
