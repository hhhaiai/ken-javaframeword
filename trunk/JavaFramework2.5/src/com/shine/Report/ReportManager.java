package com.shine.Report;

/**
 * 报告管理类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class ReportManager {
	private static ReportManager manager = null;

	public static ReportManager getManager() {
		if (manager == null)
			manager = new ReportManager();
		return manager;
	}
}
