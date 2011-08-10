package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.model.DBModel;
import com.shine.framework.core.util.FileUtil;

public class CachePageSelectExample {

	/**
	 * 缓存翻页查询
	 * 
	 * @param args
	 * @throws SQLException
	 */
	public static void main(String[] args) throws SQLException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		// 首次查询，加入缓存
		DBModel model = DBUtil.getInstance().executeCacheQuery("jdbc/test",
				"select * from test1");
		model.close();

		
		DBModel model1 = DBUtil.getInstance().executeCacheQuery("jdbc/test",
				"select * from test1");
		
		// 缓存查询第一页数据
		model1.next();
		FileUtil.createFile("E://w1.txt");
		FileUtil.writeFile("E://w1.txt", model1.getDataXml());
		
		
		// 缓存查询第二页数据
		model1.next();
		FileUtil.createFile("E://w2.txt");
		FileUtil.writeFile("E://w2.txt", model1.getDataXml());
		
		
		//继续获取第一页数据
		model1.beforeFirst();
		model1.next();
		FileUtil.createFile("E://w3.txt");
		FileUtil.writeFile("E://w3.txt", model1.getDataXml());
		
		model1.close();
	}

}
