package com.shine.DBUtil;

import java.sql.Connection;
import java.sql.SQLException;

import com.shine.DBUtil.manage.DBManager;
import com.shine.DBUtil.model.DBModel;

public class ConnectionExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		Connection conn1 = DBManager.getInstance().getConnection("jdbc/test");
		Connection conn2 = DBManager.getInstance().getConnection("jdbc/test");

		System.out.println("连接总数"
				+ DBManager.getInstance().getNumConnection("jdbc/test"));
		System.out.println("空闲连接总数"
				+ DBManager.getInstance().getNumIdleConection("jdbc/test"));
		System.out.println("繁忙连接总数"
				+ DBManager.getInstance().getNumBusyConnection("jdbc/test"));

		System.out.println("=======================");

		DBModel map = DBUtil.getInstance().executeQuery(conn1,
				"select * from test1");
		if (map.next() != 0)
			System.out.println(map.getDataXml());

		conn1.close();
		conn2.close();

		System.out.println("连接总数"
				+ DBManager.getInstance().getNumConnection("jdbc/test"));
		System.out.println("空闲连接总数"
				+ DBManager.getInstance().getNumIdleConection("jdbc/test"));
		System.out.println("繁忙连接总数"
				+ DBManager.getInstance().getNumBusyConnection("jdbc/test"));

	}

}
