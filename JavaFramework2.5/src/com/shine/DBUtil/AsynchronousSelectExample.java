package com.shine.DBUtil;

import com.shine.DBUtil.model.DBModel;

public class AsynchronousSelectExample {

	public void getReusltModel(DBModel dbModel) {
		System.err.println(dbModel.getDataXml());
		dbModel.close();
	}

	/**
	 * 异步查找例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\DBUtil\\config\\dbXml.xml");

		AsynchronousSelectExample example = new AsynchronousSelectExample();
		DBUtil.getInstance()
				.asynchronousExecuteQuery("jdbc/Default",
						"select * from gdzfw_bag_video_link", example,
						"getReusltModel");

	}
}
