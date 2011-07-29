package com.shine.DBUtil;

public class NormalUpdate {

	/**
	 * 普通更新数据库例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\DBUtil\\config\\dbXml.xml");

		DBUtil.getInstance().executeUpdate(
				"insert into test1(test) value('123')");
	}

}
