package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.model.DBModel;

public class NormalSelect {

	/**
	 * 普通查询
	 * 
	 * @param args
	 * @throws SQLException
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\DBUtil\\config\\dbXml.xml");
		DBModel dbModel = DBUtil.getInstance().executeQuery("jdbc/Default",
				"select * from gdzfw_bag_video_link");
		dbModel.next();
		System.out.println(dbModel.getDataXml());
		dbModel.close();

	}

}
