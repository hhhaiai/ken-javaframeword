package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.model.DBModel;

public class SelectSchemasExample {

	/**
	 * 查询数据库的所有模式
	 * 
	 * @param args
	 * @throws SQLException 
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		DBModel dbmodel = DBUtil.getInstance().getAllSchemas("jdbc/Default");
		while(dbmodel.next()!=0){
			System.out.println(dbmodel.getDataXml());
		}
		dbmodel.close();

	}

}
