package com.shine.DBUtil;

public class BatchExample {

	/**
	 * 批量提交
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("BatchExample...");
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");
		
		for (int i = 0; i < 2000; i++) {
			//System.out.println(i);
			String sql = "insert into test1(test) value('"+i+"')";
			DBUtil.getInstance().addBatchUpdate("jdbc/test", sql);
		}
		DBUtil.getInstance().cleanBatchUpdate("jdbc/test");

	}
}
