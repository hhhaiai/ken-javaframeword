package com.shine.framework.DBUtil;

import com.shine.framework.DBUtil.model.DBModel;

public class CacheSelectExample {

	/**
	 * 缓冲提交例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\DBUtil\\config\\dbXml.xml");
		DBModel map = DBUtil.getInstance().executeQuery(
				"select * from gdzfw_bag_video_link");
		System.out.println(map.getDataXml());
		DBModel map3 = new DBModel();
		map3.setXmlValue(map.getDataXml());
		System.out.println();
		map3.close();

		DBUtil.getInstance().cacheUpdate("11", "1", "11111");
		DBModel map4 = DBUtil.getInstance().cacheQuery("11", "1");
		map4.close();

	}

}
