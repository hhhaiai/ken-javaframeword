package com.shine.framework.DBUtil;

import com.shine.framework.DBUtil.model.DBModel;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework\\src\\com\\shine\\framework\\db\\xml\\dbXml.xml");
		DBModel map = DBUtil.getInstance()
				.executeQuery("select * from element");
		System.out.println(map.getDataXml());
	}
}
