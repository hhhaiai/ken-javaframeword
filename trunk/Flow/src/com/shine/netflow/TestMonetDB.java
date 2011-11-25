package com.shine.netflow;

import com.shine.DBUtil.DBUtil;
import com.shine.framework.core.util.FileResult;

public class TestMonetDB {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("test MonetDBExample...");
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");
		FileResult fileResult = new FileResult(
				"C:\\Users\\123\\Desktop\\rawnetflow_hour_13.sql");
		while (fileResult.next() != 0) {
			for (String sql : fileResult) {
				DBUtil.getInstance().addBatchUpdate("jdbc/MonetDB", sql);
			}
		}
		DBUtil.getInstance().cleanBatchUpdate("jdbc/MonetDB");
	}

}
