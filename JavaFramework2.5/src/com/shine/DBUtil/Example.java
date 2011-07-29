package com.shine.DBUtil;

import com.shine.DBUtil.model.DBModel;

public class Example {

	/**
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

		DBUtil.getInstance().cacheUpdate("11", "1", "11111");
		DBModel map4 = DBUtil.getInstance().cacheQuery("11", "1");

		// ///////
		// DBUtil
		// .getInstance()
		// .executeUpdate(
		// "jdbc/Default2",
		// "create table cache(sql varchar(20000), result varchar(20000),time varchar(20));");
		// DBUtil
		// .getInstance()
		// .executeUpdate("jdbc/Default2",
		// "insert into cache values('ZhangSan1','123','2011-03-21 11:39:56');");
		// DBUtil
		// .getInstance()
		// .executeUpdate("jdbc/Default2",
		// "insert into cache values('ZhangSan1','123','2011-03-21 11:30:56');");
		//
		// DBModel map2 = DBUtil.getInstance().executeQuery("jdbc/Default2",
		// "select * from cache");
		// System.out.println(map2.getDataXml());
		//
		// map2 = DBUtil.getInstance().executeQuery("jdbc/Default2",
		// "select julianday(time)*86400 from cache;");
		// System.out.println(map2.getDataXml());
		//
		// map2 = DBUtil
		// .getInstance()
		// .executeQuery(
		// "jdbc/Default2",
		// "select (julianday(strftime('%Y-%m-%d %H:%M:%S','now','localtime'))*86400-1800),julianday(strftime('%Y-%m-%d %H:%M:%S','now','localtime'))*86400,strftime('%Y-%m-%d %H:%M:%S','now','localtime');");
		// System.out.println(map2.getDataXml());
		//
		// DBUtil
		// .getInstance()
		// .executeUpdate("jdbc/Default2",
		// "delete from cache where julianday(time)*86400<(julianday(strftime('%Y-%m-%d %H:%M:%S','now','localtime'))*86400-600);");
		//
		// map2 = DBUtil.getInstance().executeQuery("jdbc/Default2",
		// "select * from cache");
		// System.out.println(map2.getDataXml());

	}
}
