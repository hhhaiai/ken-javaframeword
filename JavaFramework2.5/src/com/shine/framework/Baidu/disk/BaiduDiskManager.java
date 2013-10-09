package com.shine.framework.Baidu.disk;

/**
 * 百度网盘操作
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class BaiduDiskManager {
	private static BaiduDiskManager manager = null;

	public static BaiduDiskManager getManager() {
		if (manager == null)
			manager = new BaiduDiskManager();
		return manager;
	}
}
