package com.shine.framework.LogUtil;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Logger
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework\\src\\com\\shine\\framework\\LogUtil\\config\\LoggerXml.xml");
		Logger.getInstance().log("系统错误!");
		Logger.getInstance().log("系统错误!");
	}
}
