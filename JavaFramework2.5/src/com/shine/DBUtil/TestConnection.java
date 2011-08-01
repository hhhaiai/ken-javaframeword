package com.shine.DBUtil;

import java.sql.Connection;
import java.sql.SQLException;

import com.shine.DBUtil.manage.DBManager;
import com.shine.DBUtil.model.DBModel;

public class TestConnection {

	/**
	 * 测试连接关闭
	 * 
	 * @param args
	 * @throws SQLException 
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		Connection conn = DBManager.getInstance().getConnection("jdbc/test");

		DBModel dbModel = DBUtil.getInstance().executeQuery(conn,
				"select * from test1");
		dbModel.next();
		System.out.println(dbModel.getDataXml());
		dbModel.close();

//		DBModel dbModel1 = DBUtil.getInstance().executeQuery(conn,
//				"select * from test1");
//		dbModel1.next();
//		System.out.println(dbModel1.getDataXml());
//		dbModel1.close();

	}

}
